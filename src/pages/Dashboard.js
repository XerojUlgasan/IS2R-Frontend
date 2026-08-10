import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useDashboard } from "../hooks/useDashboard";

function peso(value) {
  const num = Number(value) || 0;
  return `₱${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function pesoCompact(value) {
  const num = Number(value) || 0;
  return `₱${new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(num)}`;
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "numeric", minute: "2-digit" });
}

// Compact "x mins ago" style relative time for the activity feed.
function relativeTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function SaleStatusBadge({ status }) {
  const s = String(status || "").toUpperCase();
  if (s === "PAID") {
    return <span className="inline-block px-sm py-xs bg-primary text-on-primary font-label-md text-[10px] uppercase tracking-widest">Paid</span>;
  }
  return <span className="inline-block px-sm py-xs border border-primary text-primary font-label-md text-[10px] uppercase tracking-widest">Pending</span>;
}

function actionIcon(action) {
  const a = String(action || "").toUpperCase();
  if (a.includes("ADD") || a.includes("CREATE")) return "add";
  if (a.includes("DELETE") || a.includes("REMOVE")) return "delete";
  if (a.includes("SALE")) return "receipt_long";
  if (a.includes("PAID") || a.includes("PAY")) return "check_circle";
  return "bolt";
}

function Dashboard() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;

  const [revenuePeriod, setRevenuePeriod] = useState("monthly"); // "weekly" | "monthly"
  // Single fetch now returns both periods; toggling is purely client-side.
  const { summary, loading, error, refetch } = useDashboard(businessId);

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  // Defensive reads.
  const s = summary || {};
  const lowStock = s.lowStock || [];
  const activity = s.activity || [];
  const recentSales = s.recentSales || [];

  const todayTrend = Number(s.todaysRevenueTrendPct);
  const hasTodayTrend = !Number.isNaN(todayTrend);
  const todayUp = todayTrend >= 0;

  // Period revenue card (weekly/monthly). The payload now carries both periods
  // under `s.periods`, so the toggle just picks the right slice. Falls back to
  // the legacy single-period / monthly fields for backward compatibility.
  const periodLabel = revenuePeriod === "weekly" ? "Weekly" : "Monthly";
  const periodWord = revenuePeriod === "weekly" ? "week" : "month";
  const periods = s.periods || {};
  const activePeriod = periods[revenuePeriod] || {};
  const periodRevenue = activePeriod.revenue ?? s.periodRevenue ?? s.monthlyRevenue;
  const periodExpenses = activePeriod.expenses ?? s.periodExpenses ?? s.monthlyExpenses;
  const periodNet = activePeriod.net ?? s.periodNet ?? (Number(periodRevenue) || 0) - (Number(periodExpenses) || 0);
  const netNegative = Number(periodNet) < 0;

  // No workspace chosen yet.
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">dashboard</span>
        <h2 className="font-headline-md text-headline-md text-primary">No workspace selected</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Choose a business to view its dashboard.
        </p>
        <Link
          to="/my-businesses"
          className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors"
        >
          Select Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-full gap-lg">
      {/* Header */}
      <div className="flex flex-col gap-xs w-full mb-md">
        <h1 className="font-display-lg text-display-lg text-on-surface uppercase">Owner Overview</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          High-level snapshot of current financial and operational metrics.
        </p>
      </div>

      {/* Error banner (non-401) */}
      {!loading && error && error.status !== 401 && (
        <div className="flex items-center justify-between gap-md border border-error bg-error-container p-md">
          <div className="flex items-center gap-sm text-on-error-container">
            <span className="material-symbols-outlined text-error">error</span>
            <span className="font-body-md">{error.message || "Something went wrong, try again."}</span>
          </div>
          <button
            onClick={refetch}
            className="px-md py-sm bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest hover:bg-surface hover:text-primary border border-primary transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-md w-full">
        {/* Today's Revenue (Large) */}
        <div className="col-span-1 md:col-span-8 bg-surface border border-outline-variant p-lg flex flex-col justify-between min-h-[300px] relative group overflow-hidden">
          <div className="flex justify-between items-start z-10 relative">
            <span className="font-headline-md text-headline-md text-primary tracking-tight uppercase">Today's Revenue</span>
            <span className="material-symbols-outlined text-primary text-[32px]">trending_up</span>
          </div>
          <div className="flex flex-col gap-xs z-10 relative mt-auto">
            <span className="font-display-lg text-[72px] leading-none font-extrabold text-primary tracking-tighter tabular-nums">
              {loading ? "…" : peso(s.todaysRevenue)}
            </span>
            {hasTodayTrend && (
              <div className="flex items-center gap-sm">
                <span className="px-sm py-xs bg-primary text-on-primary font-label-md text-label-md uppercase flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[14px]">{todayUp ? "arrow_upward" : "arrow_downward"}</span>
                  {Math.abs(todayTrend)}% vs Yesterday
                </span>
              </div>
            )}
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mt-xs">Since 12:00 AM today</span>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-surface-container-high rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700 ease-out"></div>
        </div>

        {/* Period Revenue (Weekly / Monthly toggle) */}
        <div className="col-span-1 md:col-span-4 bg-primary text-on-primary border border-primary p-lg flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-start gap-sm">
            <span className="font-headline-md text-headline-md tracking-tight uppercase">{periodLabel} Revenue</span>
            {/* Weekly / Monthly toggle */}
            <div className="flex border border-on-primary/40 shrink-0">
              <button
                type="button"
                onClick={() => setRevenuePeriod("weekly")}
                className={`px-sm py-xs font-label-md text-[10px] uppercase tracking-widest transition-colors ${
                  revenuePeriod === "weekly" ? "bg-on-primary text-primary" : "text-on-primary hover:bg-on-primary/10"
                }`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setRevenuePeriod("monthly")}
                className={`px-sm py-xs font-label-md text-[10px] uppercase tracking-widest transition-colors ${
                  revenuePeriod === "monthly" ? "bg-on-primary text-primary" : "text-on-primary hover:bg-on-primary/10"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-xs mt-auto">
            <span className="font-headline-lg text-headline-lg font-bold tabular-nums">{loading ? "…" : peso(periodRevenue)}</span>
            <div className="w-full h-px bg-on-primary/20 my-sm"></div>
            <span className="font-label-md text-label-md text-on-primary/70 uppercase tracking-widest">Net after expenses (this {periodWord})</span>
            <span className={`font-headline-md text-headline-md font-bold tabular-nums ${netNegative ? "text-error" : "text-on-primary"}`}>
              {loading ? "…" : peso(periodNet)}
            </span>
          </div>
        </div>

        {/* Pending Payments & Inventory Value */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-md">
          {/* Pending Payments → Sales History filtered to pending */}
          <button
            onClick={() => navigate("/sales-history?status=PENDING")}
            className="flex-1 text-left bg-surface-container-lowest border border-outline-variant p-lg flex flex-col justify-between group hover:border-primary transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Pending Payments</span>
              <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center">
                <span className="font-label-md text-label-md text-on-error tabular-nums">{loading ? "—" : Number(s.pendingPaymentsCount) || 0}</span>
              </div>
            </div>
            <div className="mt-md flex items-center gap-xs text-primary">
              <span className="font-headline-md text-headline-md">Requires Action</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </button>

          {/* Current Inventory Value */}
          <div className="flex-1 bg-surface-container-low border border-outline-variant p-lg flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Est. Inventory Value</span>
              <span className="material-symbols-outlined text-on-surface-variant">inventory_2</span>
            </div>
            <div className="mt-md">
              <span className="font-headline-lg text-headline-lg text-primary tabular-nums">{loading ? "…" : pesoCompact(s.inventoryValue)}</span>
            </div>
          </div>

          {/* Fully Consumed Materials */}
          <div className="bg-surface-container-lowest border border-outline-variant p-lg flex justify-between items-center group hover:bg-primary hover:text-on-primary transition-colors duration-300">
            <span className="font-label-md text-label-md uppercase tracking-widest group-hover:text-on-primary">Fully Consumed</span>
            <span className="font-headline-md text-headline-md font-bold group-hover:text-on-primary tabular-nums">{loading ? "—" : Number(s.fullyConsumedCount) || 0}</span>
          </div>
        </div>

        {/* Low Stock Materials Preview */}
        <div className="col-span-1 md:col-span-4 bg-surface border border-outline-variant flex flex-col">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <span className="font-headline-md text-headline-md uppercase tracking-tight">Low Stock</span>
            <span className="px-xs py-[2px] border border-primary text-primary font-label-md text-label-md uppercase">{lowStock.length} Items</span>
          </div>
          <div className="flex flex-col flex-1">
            {lowStock.length === 0 && !loading && (
              <div className="flex-1 flex items-center justify-center p-lg text-on-surface-variant font-body-sm text-center">
                All materials are well-stocked.
              </div>
            )}
            {lowStock.map((item, i) => (
              <div
                key={item.id || i}
                className={`flex items-center justify-between p-md hover:bg-surface-container-low transition-colors ${i < lowStock.length - 1 ? "border-b border-outline-variant" : "flex-1"}`}
              >
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 border border-outline-variant bg-surface-bright flex items-center justify-center">
                    <span className="font-label-md text-label-md">{String(item.name || "?").charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md font-bold">{item.name || "Untitled material"}</span>
                    {item.unit && <span className="font-body-sm text-body-sm text-on-surface-variant">Unit: {item.unit}</span>}
                  </div>
                </div>
                <span className="font-label-md text-label-md text-error tabular-nums">
                  {(Number(item.remaining) || 0).toLocaleString()} {item.unit || ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="col-span-1 md:col-span-4 bg-surface-container-lowest border border-outline-variant flex flex-col">
          <div className="p-lg border-b border-outline-variant">
            <span className="font-headline-md text-headline-md uppercase tracking-tight">Activity Log</span>
          </div>
          <div className="p-lg flex flex-col gap-lg relative">
            {activity.length > 1 && <div className="absolute left-[39px] top-lg bottom-lg w-px bg-outline-variant"></div>}
            {activity.length === 0 && !loading && (
              <div className="text-on-surface-variant font-body-sm text-center py-md">No recent activity.</div>
            )}
            {activity.map((ev, i) => (
              <div key={ev.id || i} className="flex gap-md relative z-10">
                <div className={`w-8 h-8 rounded-full border-2 border-surface-container-lowest flex items-center justify-center shrink-0 ${i === 0 ? "bg-primary" : "bg-surface-container-highest"}`}>
                  <span className={`material-symbols-outlined text-[16px] ${i === 0 ? "text-on-primary" : "text-primary"}`}>{actionIcon(ev.action)}</span>
                </div>
                <div className="flex flex-col pt-xs">
                  <span className="font-body-md text-body-md font-bold">{ev.action || "Event"}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{ev.description || "—"}</span>
                  <span className="font-label-md text-label-md text-on-surface-variant/60 mt-xs uppercase">{relativeTime(ev.created_at || ev.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales Table */}
        <div className="col-span-1 md:col-span-12 bg-surface-container-lowest border border-outline-variant overflow-x-auto">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center">
            <span className="font-headline-md text-headline-md uppercase tracking-tight">Recent Sales</span>
            <button
              onClick={() => navigate("/sales-history")}
              className="font-label-md text-label-md text-primary uppercase tracking-widest border border-outline-variant px-md py-xs hover:bg-surface-container-low"
            >
              View All
            </button>
          </div>
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-[180px]">Material</th>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Qty Used</th>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Total (₱)</th>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-center w-[120px]">Status</th>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest max-w-[200px]">Remarks</th>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Created By</th>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-[140px]">Date</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface">
              {loading && (
                <tr>
                  <td colSpan={7} className="p-xl text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin align-middle mr-sm">refresh</span>
                    Loading sales...
                  </td>
                </tr>
              )}
              {!loading && recentSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-xl text-center text-on-surface-variant">
                    No sales recorded yet.
                  </td>
                </tr>
              )}
              {!loading &&
                recentSales.map((sale) => {
                  const materialName = sale.material_name || sale.material?.name || "Untitled material";
                  const createdBy = sale.created_by_name || sale.createdByName || "—";
                  return (
                    <tr key={sale.id} className="border-b border-outline-variant hover:bg-surface-container transition-colors">
                      <td className="p-md font-headline-md text-label-md font-bold truncate">{materialName}</td>
                      <td className="p-md text-right font-mono text-on-surface-variant tabular-nums">{sale.qty_used ?? "—"}</td>
                      <td className="p-md text-right font-mono text-primary font-bold tabular-nums">{peso(sale.total_amount)}</td>
                      <td className="p-md text-center">
                        <SaleStatusBadge status={sale.status} />
                      </td>
                      <td className="p-md truncate max-w-[200px] text-on-surface-variant" title={sale.remarks || ""}>{sale.remarks || "-"}</td>
                      <td className="p-md text-on-surface-variant">{createdBy}</td>
                      <td className="p-md font-mono text-on-surface-variant tabular-nums">{formatDateTime(sale.created_at || sale.createdAt)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

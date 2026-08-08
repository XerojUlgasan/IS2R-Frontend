import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useSalesReport } from "../hooks/useSalesReport";

const PERIODS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const TIMELINE_LABELS = {
  daily: "Last 30 Days",
  weekly: "Last 12 Weeks",
  monthly: "Last 12 Months",
  yearly: "Last 5 Years",
};

function peso(value) {
  const num = Number(value) || 0;
  return `₱${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function pesoCompact(value) {
  const num = Number(value) || 0;
  return `₱${new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(num)}`;
}

// Builds the SVG geometry for the revenue line from timeline points.
function buildChart(timeline) {
  const W = 1000;
  const TOP = 20;
  const BOTTOM = 280;
  const n = timeline.length;
  const max = Math.max(1, ...timeline.map((t) => Number(t.revenue) || 0));
  const points = timeline.map((t, i) => {
    const x = n > 1 ? (i / (n - 1)) * W : W / 2;
    const y = BOTTOM - ((Number(t.revenue) || 0) / max) * (BOTTOM - TOP);
    return { x, y, ...t };
  });
  return { points, polyline: points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") };
}

function SalesReports() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;

  const [period, setPeriod] = useState("daily");
  const { report, loading, error, refetch } = useSalesReport(businessId, period);

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  const kpis = report?.kpis || {};
  const timeline = report?.timeline || [];
  const segments = report?.segments || [];

  const { points, polyline } = buildChart(timeline);

  const revenueTrend = Number(kpis.revenueTrendPct);
  const hasRevenueTrend = !Number.isNaN(revenueTrend);
  const revenueUp = revenueTrend >= 0;

  const hasProfit = kpis.estimatedProfit !== undefined && kpis.estimatedProfit !== null;
  const hasMargin = kpis.profitMarginPct !== undefined && kpis.profitMarginPct !== null;

  // No workspace chosen yet.
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">bar_chart</span>
        <h2 className="font-headline-md text-headline-md text-primary">No workspace selected</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Choose a business to view its sales reports.
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
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-64px)] p-lg gap-lg font-body-md text-on-surface">
      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md pb-md border-b border-primary">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">Sales Analytics</h1>
          <p className="font-body-md text-on-surface-variant mt-xs">Revenue &amp; Profit Trajectory</p>
        </div>
        <div className="flex items-center border border-primary bg-surface p-xs gap-xs">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-md py-sm font-label-md uppercase tracking-widest border transition-colors ${
                period === p.value
                  ? "text-on-primary bg-primary border-primary hover:bg-surface-container-low hover:text-primary"
                  : "text-primary bg-surface border-transparent hover:border-primary"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-sm py-xl border border-primary bg-surface-bright text-on-surface-variant flex-1">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          <span className="font-body-md">Loading sales report...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && error.status !== 401 && (
        <div className="flex flex-col items-center justify-center gap-md py-xl border border-primary bg-surface-bright text-center flex-1">
          <span className="material-symbols-outlined text-[32px] text-error">error</span>
          <p className="font-body-md text-body-md text-on-surface">{error.message || "Something went wrong, try again."}</p>
          <button
            onClick={refetch}
            className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors flex items-center gap-sm"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Bento Grid Main Content */}
          <div className="grid grid-cols-12 gap-lg flex-1">
            {/* Large Chart Cell */}
            <div className="col-span-12 lg:col-span-9 border border-primary bg-surface-bright flex flex-col p-lg relative group transition-colors hover:bg-surface-container-lowest">
              <div className="absolute top-lg left-lg">
                <span className="font-headline-md text-headline-md text-primary block">Revenue Timeline</span>
                <span className="font-label-md text-on-surface-variant uppercase tracking-widest mt-xs block">
                  {TIMELINE_LABELS[period] || ""}
                </span>
              </div>
              <div className="flex-1 w-full h-full min-h-[400px] mt-xl pt-lg relative">
                {timeline.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-body-md">
                    No sales recorded for this period.
                  </div>
                ) : (
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
                    {/* Grid Lines */}
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50" />
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150" />
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="250" y2="250" />
                    {/* Data Line */}
                    <polyline className="text-primary" points={polyline} fill="none" stroke="currentColor" strokeWidth="3" />
                    {/* Data Points */}
                    {points.map((p, i) => (
                      <circle key={i} className="text-primary" cx={p.x} cy={p.y} r="4" fill="currentColor">
                        <title>{`${p.label || ""}: ${peso(p.revenue)}`}</title>
                      </circle>
                    ))}
                  </svg>
                )}
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-lg">
              {/* Total Revenue Stat */}
              <div className="flex-1 border border-primary bg-primary text-on-primary p-lg flex flex-col justify-between group relative overflow-hidden transition-all hover:bg-surface-bright hover:text-primary hover:border-primary min-h-[140px]">
                <span className="font-label-md uppercase tracking-widest border-b border-on-primary/30 pb-xs group-hover:border-primary/30">
                  Total Revenue
                </span>
                <div className="mt-xl">
                  <span className="font-display-lg text-display-lg block tabular-nums group-hover:scale-105 transition-transform origin-left">
                    {pesoCompact(kpis.totalRevenue)}
                  </span>
                  {hasRevenueTrend && (
                    <div className="flex items-center gap-xs mt-sm text-surface-container-lowest group-hover:text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">{revenueUp ? "arrow_upward" : "arrow_downward"}</span>
                      <span className="font-body-sm">{Math.abs(revenueTrend)}% vs last period</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Estimated Profit Stat */}
              <div className="flex-1 border border-primary bg-surface-bright p-lg flex flex-col justify-between group relative overflow-hidden transition-all hover:border-primary hover:bg-surface-container min-h-[140px]">
                <span className="font-label-md text-on-surface-variant uppercase tracking-widest border-b border-primary/30 pb-xs group-hover:text-primary">
                  Estimated Profit
                </span>
                <div className="mt-xl">
                  <span className="font-display-lg text-display-lg text-primary block tabular-nums group-hover:-translate-y-1 transition-transform">
                    {hasProfit ? pesoCompact(kpis.estimatedProfit) : "—"}
                  </span>
                  {hasMargin && (
                    <div className="flex items-center gap-xs mt-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      <span className="font-body-sm">Margin: {kpis.profitMarginPct}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Data Table */}
          <div className="mt-md border border-primary bg-surface-bright">
            <div className="p-md border-b border-primary bg-surface-container-low flex justify-between items-center">
              <span className="font-headline-md text-body-lg text-primary">Top Performing Materials</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-primary/30 bg-surface">
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider w-1/3">Material</th>
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Volume</th>
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Revenue</th>
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {segments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-xl text-center text-on-surface-variant font-body-md">No sales in this period.</td>
                    </tr>
                  )}
                  {segments.map((seg, i) => {
                    const growth = Number(seg.growthPct);
                    const hasGrowth = !Number.isNaN(growth);
                    const growthUp = growth >= 0;
                    return (
                      <tr key={seg.id || seg.name || i} className="border-b border-primary/10 hover:bg-surface-container-lowest transition-colors group">
                        <td className="p-md font-body-md font-bold text-primary flex items-center gap-sm">
                          <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform"></div>
                          {seg.name || "Untitled material"}
                        </td>
                        <td className="p-md font-body-sm text-on-surface-variant text-right tabular-nums">
                          {(Number(seg.volume) || 0).toLocaleString()} units
                        </td>
                        <td className="p-md font-body-md text-primary text-right tabular-nums">{peso(seg.revenue)}</td>
                        <td className={`p-md font-label-md text-right tabular-nums ${hasGrowth && !growthUp ? "text-error" : "text-primary"}`}>
                          {hasGrowth ? `${growthUp ? "+" : ""}${growth}%` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SalesReports;

import React, { useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useInventoryReport } from "../hooks/useInventoryReport";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const PERIODS = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

function peso(value) {
  const num = Number(value) || 0;
  return `₱${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function num(value) {
  return (Number(value) || 0).toLocaleString();
}

function statusPill(status) {
  const base = "inline-flex items-center px-sm py-xs font-label-md text-[10px] uppercase tracking-widest border";
  const s = String(status || "").toUpperCase();
  if (s === "OUT") return `${base} bg-error text-on-error border-error`;
  if (s === "CRITICAL") return `${base} border-error text-error`;
  return `${base} border-outline text-on-surface-variant`;
}

function MovementTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container-lowest border border-primary px-md py-sm flex flex-col gap-xs shadow-lg">
      <span className="font-label-md text-on-surface-variant uppercase tracking-widest">{label}</span>
      {payload.map((p) => (
        <span key={p.dataKey} className="font-body-sm" style={{ color: p.color }}>
          {p.name}: <span className="font-bold tabular-nums">{(Number(p.value) || 0).toLocaleString()}</span>
        </span>
      ))}
    </div>
  );
}

function InventoryReports() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;

  const [period, setPeriod] = React.useState("weekly");
  const { report, loading, error, refetch } = useInventoryReport(businessId, period);

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  const kpis = report?.kpis || {};
  const movement = report?.movement || [];
  const lowStock = report?.lowStock || [];
  const topConsumed = report?.topConsumed || [];
  const aging = report?.aging || [];

  const movementData = movement.map((m) => ({
    label: m.label,
    "Stocked In": Number(m.stockedIn) || 0,
    Consumed: Number(m.consumed) || 0,
  }));

  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">monitoring</span>
        <h2 className="font-headline-md text-headline-md text-primary">No workspace selected</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Choose a business to view its inventory reports.
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
          <h1 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">Inventory Analytics</h1>
          <p className="font-body-md text-on-surface-variant mt-xs">Stock Health &amp; Consumption</p>
        </div>
        <div className="flex flex-wrap items-center border border-primary bg-surface p-xs gap-xs w-full sm:w-auto">
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

      {loading && (
        <div className="flex items-center justify-center gap-sm py-xl border border-primary bg-surface-bright text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          <span className="font-body-md">Loading inventory report...</span>
        </div>
      )}

      {!loading && error && error.status !== 401 && (
        <div className="flex flex-col items-center justify-center gap-md py-xl border border-primary bg-surface-bright text-center">
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
          {/* KPI Cards */}
          <div className="grid grid-cols-12 gap-lg">
            <div className="col-span-12 sm:col-span-6 lg:col-span-4 border border-primary bg-surface-bright p-lg flex flex-col justify-between group transition-all hover:bg-surface-container min-h-[160px]">
              <span className="font-label-md text-on-surface-variant uppercase tracking-widest border-b border-primary/30 pb-xs group-hover:text-primary">
                Total Units On Hand
              </span>
              <div className="mt-lg">
                <span className="font-display-lg text-display-lg text-primary block tabular-nums">{num(kpis.unitsOnHand)}</span>
                <span className="font-body-sm text-on-surface-variant mt-sm block">across {num(kpis.activeMaterials)} active materials</span>
              </div>
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-4 border border-primary bg-surface-bright p-lg flex flex-col justify-between group transition-all hover:bg-surface-container min-h-[160px]">
              <span className="font-label-md text-on-surface-variant uppercase tracking-widest border-b border-primary/30 pb-xs group-hover:text-primary">
                Active Materials
              </span>
              <div className="mt-lg">
                <span className="font-display-lg text-display-lg text-primary block tabular-nums">{num(kpis.activeMaterials)}</span>
                <span className="font-body-sm text-on-surface-variant mt-sm block">{num(kpis.materialsAddedThisPeriod)} added this period</span>
              </div>
            </div>

            <div className="col-span-12 sm:col-span-6 lg:col-span-4 border border-primary bg-surface-bright p-lg flex flex-col justify-between group transition-all hover:bg-surface-container min-h-[160px]">
              <span className="font-label-md text-on-surface-variant uppercase tracking-widest border-b border-primary/30 pb-xs group-hover:text-primary">
                Low / Out Of Stock
              </span>
              <div className="mt-lg">
                <span className="font-display-lg text-display-lg text-error block tabular-nums">{num(kpis.lowStockCount)}</span>
                <div className="flex items-center gap-xs mt-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-error">warning</span>
                  <span className="font-body-sm">{num(kpis.criticalCount)} critical · {num(kpis.outCount)} out</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Movement Chart */}
          <div className="border border-primary bg-surface-bright flex flex-col p-md sm:p-lg">
            <div className="mb-lg">
              <span className="font-headline-md text-headline-md text-primary block">Stock Movement</span>
              <span className="font-label-md text-on-surface-variant uppercase tracking-widest mt-xs block">Stocked In vs Consumed</span>
            </div>
            {movement.length === 0 ? (
              <div className="min-h-[320px] flex items-center justify-center text-on-surface-variant font-body-md">
                No movement recorded for this period.
              </div>
            ) : (
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={movementData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barCategoryGap="30%" barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e2e2" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "#7e7576", fontFamily: "inherit" }}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e2e2" }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#7e7576", fontFamily: "inherit" }}
                      tickLine={false}
                      axisLine={false}
                      width={40}
                    />
                    <Tooltip content={<MovementTooltip />} cursor={{ fill: "#00000008" }} />
                    <Legend
                      iconType="square"
                      iconSize={10}
                      wrapperStyle={{ fontSize: 10, fontFamily: "inherit", textTransform: "uppercase", letterSpacing: "0.08em", paddingTop: 8 }}
                    />
                    <Bar dataKey="Stocked In" fill="#000000" radius={[2, 2, 0, 0]} maxBarSize={32} />
                    <Bar dataKey="Consumed" fill="#c6c6c6" radius={[2, 2, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Low-stock watchlist */}
          <div className="border border-primary bg-surface-bright">
            <div className="p-md border-b border-primary bg-surface-container-low flex justify-between items-center">
              <span className="font-headline-md text-body-lg text-primary">Low-Stock Watchlist</span>
              <span className="font-label-md text-on-surface-variant uppercase tracking-widest">Reorder soon</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b border-primary/30 bg-surface-container">
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider w-1/3">Material</th>
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Remaining</th>
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider">Unit</th>
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider">Last Stocked</th>
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-xl text-center text-on-surface-variant font-body-md">All materials are well-stocked.</td>
                    </tr>
                  )}
                  {lowStock.map((row, i) => (
                    <tr key={row.id || row.name || i} className="border-b border-primary/10 hover:bg-surface-container-lowest transition-colors">
                      <td className="p-md font-body-md font-bold text-primary">{row.name}</td>
                      <td className={`p-md text-right font-mono tabular-nums ${Number(row.remaining) === 0 ? "text-error" : "text-on-surface"}`}>
                        {num(row.remaining)}
                      </td>
                      <td className="p-md font-body-sm text-on-surface-variant">{row.unit || "—"}</td>
                      <td className="p-md font-mono text-on-surface-variant tabular-nums">{row.lastStocked || "—"}</td>
                      <td className="p-md text-right">
                        <span className={statusPill(row.status)}>{row.status || "LOW"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top consumed + Aging stock */}
          <div className="grid grid-cols-12 gap-lg">
            <div className="col-span-12 lg:col-span-6 border border-primary bg-surface-bright">
              <div className="p-md border-b border-primary bg-surface-container-low">
                <span className="font-headline-md text-body-lg text-primary">Top Consumed Materials</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[480px]">
                  <thead>
                    <tr className="border-b border-primary/30 bg-surface-container">
                      <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider">Material</th>
                      <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Consumed</th>
                      <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Remaining</th>
                      <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Sell-Through</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topConsumed.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-xl text-center text-on-surface-variant font-body-md">No consumption recorded.</td>
                      </tr>
                    )}
                    {topConsumed.map((row, i) => (
                      <tr key={row.id || row.name || i} className="border-b border-primary/10 hover:bg-surface-container-lowest transition-colors">
                        <td className="p-md font-body-md font-bold text-primary">{row.name}</td>
                        <td className="p-md text-right font-mono tabular-nums text-on-surface">{num(row.consumed)}</td>
                        <td className="p-md text-right font-mono tabular-nums text-on-surface-variant">{num(row.remaining)}</td>
                        <td className="p-md text-right font-label-md tabular-nums text-primary">{Number(row.sellThrough) || 0}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 border border-primary bg-surface-bright">
              <div className="p-md border-b border-primary bg-surface-container-low">
                <span className="font-headline-md text-body-lg text-primary">Aging / Slow-Moving Stock</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[480px]">
                  <thead>
                    <tr className="border-b border-primary/30 bg-surface-container">
                      <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider">Batch</th>
                      <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider">Material</th>
                      <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Age</th>
                      <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Tied-Up</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aging.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-xl text-center text-on-surface-variant font-body-md">No slow-moving stock.</td>
                      </tr>
                    )}
                    {aging.map((row, i) => (
                      <tr key={row.batch || i} className="border-b border-primary/10 hover:bg-surface-container-lowest transition-colors">
                        <td className="p-md font-mono text-on-surface-variant tabular-nums">{row.batch}</td>
                        <td className="p-md font-body-md font-bold text-primary">{row.name}</td>
                        <td className="p-md text-right font-mono tabular-nums text-on-surface">{num(row.ageDays)}d</td>
                        <td className="p-md text-right font-mono tabular-nums text-on-surface">{peso(row.tiedUp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InventoryReports;

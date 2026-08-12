import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useInventoryReport } from "../hooks/useInventoryReport";

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
  return `${base} border-outline text-on-surface-variant`; // LOW / default
}

function InventoryReports() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;

  const [period, setPeriod] = useState("weekly");
  const { report, loading, error, refetch } = useInventoryReport(businessId, period);

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  // Defensive reads — the page renders even if the backend omits a section.
  const kpis = report?.kpis || {};
  const movement = report?.movement || [];
  const statusSplit = report?.statusSplit || {};
  const typeDistribution = report?.typeDistribution || [];
  const lowStock = report?.lowStock || [];
  const topConsumed = report?.topConsumed || [];
  const aging = report?.aging || [];

  const maxMovement = Math.max(1, ...movement.flatMap((m) => [Number(m.stockedIn) || 0, Number(m.consumed) || 0]));

  const availablePct = Math.max(0, Math.min(100, Number(statusSplit.availablePct) || 0));
  const R = 42;
  const C = 2 * Math.PI * R;
  const availableDash = (availablePct / 100) * C;

  const valueTrend = Number(kpis.inventoryValueTrendPct);
  const hasTrend = !Number.isNaN(valueTrend);
  const trendUp = valueTrend >= 0;

  // No workspace chosen yet.
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center gap-sm py-xl border border-primary bg-surface-bright text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          <span className="font-body-md">Loading inventory report...</span>
        </div>
      )}

      {/* Error */}
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
            {/* Inventory value (inverted highlight) */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 border border-primary bg-primary text-on-primary p-md sm:p-lg flex flex-col justify-between group transition-all hover:bg-surface-bright hover:text-primary hover:border-primary min-h-[140px] sm:min-h-[160px]">
              <span className="font-label-md uppercase tracking-widest border-b border-on-primary/30 pb-xs group-hover:border-primary/30">
                Inventory Value On Hand
              </span>
              <div className="mt-lg">
                <span className="font-display-lg text-display-lg block tabular-nums">{peso(kpis.inventoryValue)}</span>
                {hasTrend && (
                  <div className="flex items-center gap-xs mt-sm text-surface-container-lowest group-hover:text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">{trendUp ? "arrow_upward" : "arrow_downward"}</span>
                    <span className="font-body-sm">{Math.abs(valueTrend)}% vs last period</span>
                  </div>
                )}
              </div>
            </div>

            {/* Units on hand */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 border border-primary bg-surface-bright p-lg flex flex-col justify-between group transition-all hover:bg-surface-container min-h-[160px]">
              <span className="font-label-md text-on-surface-variant uppercase tracking-widest border-b border-primary/30 pb-xs group-hover:text-primary">
                Total Units On Hand
              </span>
              <div className="mt-lg">
                <span className="font-display-lg text-display-lg text-primary block tabular-nums">{num(kpis.unitsOnHand)}</span>
                <span className="font-body-sm text-on-surface-variant mt-sm block">across {num(kpis.activeMaterials)} active materials</span>
              </div>
            </div>

            {/* Active materials */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 border border-primary bg-surface-bright p-lg flex flex-col justify-between group transition-all hover:bg-surface-container min-h-[160px]">
              <span className="font-label-md text-on-surface-variant uppercase tracking-widest border-b border-primary/30 pb-xs group-hover:text-primary">
                Active Materials
              </span>
              <div className="mt-lg">
                <span className="font-display-lg text-display-lg text-primary block tabular-nums">{num(kpis.activeMaterials)}</span>
                <span className="font-body-sm text-on-surface-variant mt-sm block">{num(kpis.materialsAddedThisPeriod)} added this period</span>
              </div>
            </div>

            {/* Low / out of stock */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 border border-primary bg-surface-bright p-lg flex flex-col justify-between group transition-all hover:bg-surface-container min-h-[160px]">
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

          {/* Main content: movement chart + side panels */}
          <div className="grid grid-cols-12 gap-lg">
            {/* Stock movement chart */}
            <div className="col-span-12 lg:col-span-8 border border-primary bg-surface-bright flex flex-col p-md sm:p-lg">
              <div className="flex flex-col gap-sm sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="font-headline-md text-headline-md text-primary block">Stock Movement</span>
                  <span className="font-label-md text-on-surface-variant uppercase tracking-widest mt-xs block">Stocked In vs Consumed</span>
                </div>
                <div className="flex flex-wrap items-center gap-sm sm:gap-md">
                  <div className="flex items-center gap-xs">
                    <span className="w-3 h-3 bg-primary inline-block"></span>
                    <span className="font-label-md text-on-surface-variant uppercase tracking-widest">In</span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <span className="w-3 h-3 border border-primary inline-block"></span>
                    <span className="font-label-md text-on-surface-variant uppercase tracking-widest">Consumed</span>
                  </div>
                </div>
              </div>

              {/* Grouped bar chart */}
              {movement.length === 0 ? (
                <div className="flex-1 min-h-[320px] flex items-center justify-center text-on-surface-variant font-body-md">
                  No movement recorded for this period.
                </div>
              ) : (
                <div className="flex-1 min-h-[320px] mt-xl flex items-end justify-between gap-md">
                  {movement.map((m, i) => (
                    <div key={m.label || i} className="flex-1 flex flex-col items-center gap-sm h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-xs h-full">
                        <div
                          className="w-1/2 bg-primary transition-all"
                          style={{ height: `${((Number(m.stockedIn) || 0) / maxMovement) * 100}%` }}
                          title={`Stocked in: ${num(m.stockedIn)}`}
                        ></div>
                        <div
                          className="w-1/2 border border-primary bg-surface transition-all"
                          style={{ height: `${((Number(m.consumed) || 0) / maxMovement) * 100}%` }}
                          title={`Consumed: ${num(m.consumed)}`}
                        ></div>
                      </div>
                      <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Side panels */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
              {/* Stock status donut */}
              <div className="border border-primary bg-surface-bright p-md sm:p-lg flex flex-col gap-md">
                <span className="font-headline-md text-body-lg text-primary">Stock Status</span>
                <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:gap-lg">
                  <svg viewBox="0 0 100 100" className="w-[104px] h-[104px] -rotate-90 shrink-0">
                    <circle cx="50" cy="50" r={R} fill="none" className="text-surface-container-high" stroke="currentColor" strokeWidth="12" />
                    <circle
                      cx="50"
                      cy="50"
                      r={R}
                      fill="none"
                      className="text-primary"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={`${availableDash} ${C - availableDash}`}
                    />
                  </svg>
                  <div className="flex flex-col gap-sm">
                    <div className="flex items-center gap-xs">
                      <span className="w-3 h-3 bg-primary inline-block"></span>
                      <span className="font-body-sm text-on-surface">Available <span className="tabular-nums font-bold">{availablePct}%</span></span>
                    </div>
                    <div className="flex items-center gap-xs">
                      <span className="w-3 h-3 bg-surface-container-high inline-block"></span>
                      <span className="font-body-sm text-on-surface-variant">Consumed <span className="tabular-nums font-bold">{100 - availablePct}%</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Material type distribution */}
              <div className="border border-primary bg-surface-bright p-md sm:p-lg flex flex-col gap-md flex-1">
                <span className="font-headline-md text-body-lg text-primary">Material Types</span>
                {typeDistribution.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-on-surface-variant font-body-sm py-lg">No materials yet.</div>
                ) : (
                  <div className="flex flex-col gap-md mt-xs">
                    {typeDistribution.map((t, i) => (
                      <div key={t.type || i} className="flex flex-col gap-xs">
                        <div className="flex justify-between items-baseline">
                          <span className="font-body-sm text-on-surface">{t.type || "Untyped"}</span>
                          <span className="font-body-sm text-on-surface-variant tabular-nums">{num(t.units)} · {Number(t.pct) || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-surface-container-high">
                          <div className="h-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, Number(t.pct) || 0))}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
            {/* Top consumed */}
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

            {/* Aging stock */}
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

import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useSalesReport } from "../hooks/useSalesReport";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

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

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container-lowest border border-primary px-md py-sm flex flex-col gap-xs shadow-lg">
      <span className="font-label-md text-on-surface-variant uppercase tracking-widest">
        {label}
      </span>
      <span className="font-headline-md text-headline-md text-primary font-bold tabular-nums">
        {peso(payload[0].value)}
      </span>
    </div>
  );
}

function RevenueChart({ timeline }) {
  if (timeline.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-body-md">
        No sales recorded for this period.
      </div>
    );
  }

  const data = timeline.map((t) => ({
    label: t.label,
    revenue: Number(t.revenue) || 0,
  }));
  // const maxVal = Math.max(...data.map((d) => d.revenue));
  const avgVal = data.reduce((s, d) => s + d.revenue, 0) / data.length;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#000000" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#000000" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e2e2e2"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "#7e7576", fontFamily: "inherit" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e2e2" }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v) => pesoCompact(v)}
          tick={{ fontSize: 10, fill: "#7e7576", fontFamily: "inherit" }}
          tickLine={false}
          axisLine={false}
          width={56}
        />
        <Tooltip
          content={<RevenueTooltip />}
          cursor={{ stroke: "#000000", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <ReferenceLine
          y={avgVal}
          stroke="#7e7576"
          strokeDasharray="4 4"
          strokeWidth={1}
          label={{
            value: "avg",
            position: "insideTopRight",
            fontSize: 10,
            fill: "#7e7576",
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#000000"
          strokeWidth={2.5}
          fill="url(#revenueGrad)"
          dot={false}
          activeDot={{
            r: 5,
            fill: "#000000",
            stroke: "#ffffff",
            strokeWidth: 2,
          }}
          isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SalesReports() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;

  const [period, setPeriod] = useState("daily");
  const { report, loading, error, refetch } = useSalesReport(
    businessId,
    period,
  );

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  const kpis = report?.kpis || {};
  const timeline = report?.timeline || [];
  const segments = report?.segments || [];

  const revenueTrend = Number(kpis.revenueTrendPct);
  const hasRevenueTrend = !Number.isNaN(revenueTrend);
  const revenueUp = revenueTrend >= 0;
  const totalRevenue = Number(kpis.totalRevenue) || 0;
  const sparkData = timeline.map((t) => ({ revenue: Number(t.revenue) || 0 }));
  const sparkMax = Math.max(1, ...sparkData.map((d) => d.revenue));

  // No workspace chosen yet.
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">
          bar_chart
        </span>
        <h2 className="font-headline-md text-headline-md text-primary">
          No workspace selected
        </h2>
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
          <h1 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">
            Sales Analytics
          </h1>
          <p className="font-body-md text-on-surface-variant mt-xs">
            Revenue &amp; Profit Trajectory
          </p>
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
        <div className="flex items-center justify-center gap-sm py-xl border border-primary bg-surface-bright text-on-surface-variant flex-1">
          <span className="material-symbols-outlined animate-spin">
            refresh
          </span>
          <span className="font-body-md">Loading sales report...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && error.status !== 401 && (
        <div className="flex flex-col items-center justify-center gap-md py-xl border border-primary bg-surface-bright text-center flex-1">
          <span className="material-symbols-outlined text-[32px] text-error">
            error
          </span>
          <p className="font-body-md text-body-md text-on-surface">
            {error.message || "Something went wrong, try again."}
          </p>
          <button
            onClick={refetch}
            className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors flex items-center gap-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              refresh
            </span>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Bento Grid Main Content */}
          <div className="grid grid-cols-12 gap-lg flex-1">
            {/* Large Chart Cell */}
            <div className="col-span-12 lg:col-span-9 border border-primary bg-surface-bright flex flex-col p-md sm:p-lg relative group transition-colors hover:bg-surface-container-lowest">
              <div className="absolute top-md left-md sm:top-lg sm:left-lg">
                <span className="font-headline-md text-headline-md text-primary block">
                  Revenue Timeline
                </span>
                <span className="font-label-md text-on-surface-variant uppercase tracking-widest mt-xs block">
                  {TIMELINE_LABELS[period] || ""}
                </span>
              </div>
              <div className="flex-1 w-full h-full min-h-[280px] sm:min-h-[400px] mt-16 sm:mt-xl pt-md sm:pt-lg relative">
                <RevenueChart timeline={timeline} />
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-lg">
              {/* Total Revenue Stat */}
              <div className="flex-1 border border-primary bg-primary text-on-primary p-md sm:p-lg flex flex-col justify-between group relative overflow-hidden min-h-[120px] sm:min-h-[140px]">
                <span className="font-label-md uppercase tracking-widest border-b border-on-primary/30 pb-xs">
                  Total Revenue
                </span>
                {/* Mini sparkline */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg
                    viewBox={`0 0 ${sparkData.length} 40`}
                    preserveAspectRatio="none"
                    className="w-full h-full"
                  >
                    <polyline
                      points={sparkData
                        .map(
                          (d, i) => `${i},${40 - (d.revenue / sparkMax) * 38}`,
                        )
                        .join(" ")}
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div className="mt-lg sm:mt-xl relative">
                  <span className="font-display-lg text-[1.35rem] sm:text-display-lg block tabular-nums">
                    {pesoCompact(totalRevenue)}
                  </span>
                  {hasRevenueTrend && (
                    <div className="flex items-center gap-xs mt-sm text-on-primary/70">
                      <span className="material-symbols-outlined text-[16px]">
                        {revenueUp ? "arrow_upward" : "arrow_downward"}
                      </span>
                      <span className="font-body-sm">
                        {Math.abs(revenueTrend)}% vs last period
                      </span>
                    </div>
                  )}
                  {!hasRevenueTrend && (
                    <span className="font-body-sm text-on-primary/50 mt-sm block">
                      No prior period to compare
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Data Table */}
          <div className="mt-md border border-primary bg-surface-bright">
            <div className="p-md border-b border-primary bg-surface-container-low flex justify-between items-center">
              <span className="font-headline-md text-body-lg text-primary">
                Top Performing Materials
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-primary/30 bg-surface">
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider w-1/3">
                      Material
                    </th>
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">
                      Volume
                    </th>
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">
                      Revenue
                    </th>
                    <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {segments.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-xl text-center text-on-surface-variant font-body-md"
                      >
                        No sales in this period.
                      </td>
                    </tr>
                  )}
                  {segments.map((seg, i) => {
                    const growth = Number(seg.growthPct);
                    const hasGrowth = !Number.isNaN(growth);
                    const growthUp = growth >= 0;
                    return (
                      <tr
                        key={seg.id || seg.name || i}
                        className="border-b border-primary/10 hover:bg-surface-container-lowest transition-colors group"
                      >
                        <td className="p-md font-body-md font-bold text-primary flex items-center gap-sm">
                          <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform"></div>
                          {seg.name || "Untitled material"}
                        </td>
                        <td className="p-md font-body-sm text-on-surface-variant text-right tabular-nums">
                          {(Number(seg.volume) || 0).toLocaleString()} units
                        </td>
                        <td className="p-md font-body-md text-primary text-right tabular-nums">
                          {peso(seg.revenue)}
                        </td>
                        <td
                          className={`p-md font-label-md text-right tabular-nums ${hasGrowth && !growthUp ? "text-error" : "text-primary"}`}
                        >
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

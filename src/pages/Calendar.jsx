import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useCalendarOverview, useCalendarDetail } from "../hooks/useCalendar";
import { exportCalendarExcel } from "../utils/exportCalendarExcel";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function peso(value) {
  const num = Number(value) || 0;
  return `₱${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function buildMonthGrid(year, month) {
  // Returns a 2D array of weeks → days (null for blanks).
  const first = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startDay = first.getDay(); // 0=Sun
  const weeks = [];
  let week = new Array(startDay).fill(null);
  for (let d = 1; d <= totalDays; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

// ─── Calendar Page ────────────────────────────────────────────────────────────

function Calendar() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;
  const businessName = activeBusiness?.name || "Business";

  const [view, setView] = useState("month"); // "month" | "year"
  const today = new Date();
  const [anchorYear, setAnchorYear] = useState(today.getFullYear());
  const [anchorMonth, setAnchorMonth] = useState(today.getMonth()); // 0-indexed

  // The ISO date string sent to the API for the overview.
  const anchorDate = useMemo(() => {
    if (view === "month") return `${anchorYear}-${String(anchorMonth + 1).padStart(2, "0")}-01`;
    return `${anchorYear}-01-01`;
  }, [view, anchorYear, anchorMonth]);

  const { data: overviewData, loading: overviewLoading } = useCalendarOverview(businessId, view, anchorDate);

  // Selected cell for detail panel.
  const [selectedDate, setSelectedDate] = useState(null); // ISO string
  const detailType = view === "month" ? "day" : "month";
  const { detail, loading: detailLoading } = useCalendarDetail(businessId, detailType, selectedDate);

  // Navigate months / years.
  const goPrev = () => {
    if (view === "month") {
      if (anchorMonth === 0) { setAnchorMonth(11); setAnchorYear((y) => y - 1); }
      else setAnchorMonth((m) => m - 1);
    } else {
      setAnchorYear((y) => y - 1);
    }
    setSelectedDate(null);
  };
  const goNext = () => {
    if (view === "month") {
      if (anchorMonth === 11) { setAnchorMonth(0); setAnchorYear((y) => y + 1); }
      else setAnchorMonth((m) => m + 1);
    } else {
      setAnchorYear((y) => y + 1);
    }
    setSelectedDate(null);
  };

  // Entries map keyed by day number (month view) or month index (year view).
  const entriesMap = useMemo(() => {
    const entries = overviewData?.entries || [];
    const map = {};
    entries.forEach((e) => { map[e.key] = e; });
    return map;
  }, [overviewData]);

  // Auth redirect.
  const goToLogin = useCallback(() => navigate("/login"), [navigate]);
  useEffect(() => {
    // detail or overview might 401
  }, [goToLogin]);

  // Excel export handler.
  const handleExport = () => {
    if (!detail) return;
    const fromDate = selectedDate || "";
    let toDate = fromDate;
    if (detailType === "month") {
      // month → last day
      const [y, m] = fromDate.split("-").map(Number);
      const last = new Date(y, m, 0).getDate();
      toDate = `${fromDate}-${last}`;
    }
    const dateLabel = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    exportCalendarExcel(detail, { businessName, dateLabel, fromDate, toDate });
  };

  // No workspace.
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">calendar_month</span>
        <h2 className="font-headline-md text-headline-md text-primary">No workspace selected</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Choose a business to view its sales calendar.</p>
        <Link to="/my-businesses" className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors">
          Select Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-full gap-lg">
      {/* Header */}
      <div className="flex flex-col gap-xs w-full">
        <div className="flex items-center gap-md">
          <button onClick={() => navigate("/dashboard")} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">arrow_back</button>
          <h1 className="font-display-lg text-display-lg text-on-surface uppercase">Sales Calendar</h1>
        </div>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Visual overview of sales performance. Click a day or month to see material-level details.
        </p>
      </div>

      {/* Toolbar: View toggle + Navigation */}
      <div className="flex items-center justify-between gap-md flex-wrap">
        <div className="flex items-center gap-sm">
          {/* View toggle */}
          <div className="flex border border-outline-variant">
            <button
              onClick={() => { setView("month"); setSelectedDate(null); }}
              className={`px-md py-sm font-label-md text-label-md uppercase tracking-widest transition-colors ${view === "month" ? "bg-primary text-on-primary" : "hover:bg-surface-container-low"}`}
            >This Month</button>
            <button
              onClick={() => { setView("year"); setSelectedDate(null); }}
              className={`px-md py-sm font-label-md text-label-md uppercase tracking-widest transition-colors ${view === "year" ? "bg-primary text-on-primary" : "hover:bg-surface-container-low"}`}
            >This Year</button>
          </div>
        </div>

        {/* Month/Year nav */}
        <div className="flex items-center gap-md">
          <button onClick={goPrev} className="material-symbols-outlined text-on-surface-variant hover:text-primary">chevron_left</button>
          <span className="font-headline-md text-headline-md text-primary min-w-[160px] text-center">
            {view === "month" ? `${MONTH_NAMES[anchorMonth]} ${anchorYear}` : `${anchorYear}`}
          </span>
          <button onClick={goNext} className="material-symbols-outlined text-on-surface-variant hover:text-primary">chevron_right</button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        {/* Calendar grid */}
        <div className="col-span-1 lg:col-span-8 bg-surface border border-outline-variant">
          {view === "month" ? (
            <MonthGrid
              year={anchorYear}
              month={anchorMonth}
              entriesMap={entriesMap}
              loading={overviewLoading}
              selectedDate={selectedDate}
              onSelectDay={(day) => {
                const iso = `${anchorYear}-${String(anchorMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                setSelectedDate(iso === selectedDate ? null : iso);
              }}
            />
          ) : (
            <YearGrid
              year={anchorYear}
              entriesMap={entriesMap}
              loading={overviewLoading}
              selectedDate={selectedDate}
              onSelectMonth={(monthIdx) => {
                const iso = `${anchorYear}-${String(monthIdx + 1).padStart(2, "0")}`;
                setSelectedDate(iso === selectedDate ? null : iso);
              }}
            />
          )}
        </div>

        {/* Detail panel */}
        <div className="col-span-1 lg:col-span-4 bg-surface-container-lowest border border-outline-variant flex flex-col">
          <DetailPanel
            detail={detail}
            loading={detailLoading}
            selectedDate={selectedDate}
            type={detailType}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Month Grid ───────────────────────────────────────────────────────────────

function MonthGrid({ year, month, entriesMap, loading, selectedDate, onSelectDay }) {
  const weeks = useMemo(() => buildMonthGrid(year, month), [year, month]);

  return (
    <div className="flex flex-col">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-low">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="p-sm text-center font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">{d}</div>
        ))}
      </div>
      {/* Weeks */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7 border-b border-outline-variant last:border-b-0">
          {week.map((day, di) => {
            if (!day) return <div key={di} className="p-md bg-surface-container-low/30"></div>;
            const entry = entriesMap[day];
            const pct = entry?.changePct;
            const hasPct = pct != null && !Number.isNaN(Number(pct));
            const isUp = Number(pct) >= 0;
            const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = selectedDate === iso;
            return (
              <button
                key={di}
                onClick={() => onSelectDay(day)}
                className={`p-md flex flex-col items-center gap-xs transition-colors cursor-pointer border-r border-outline-variant last:border-r-0 ${
                  isSelected ? "bg-primary/10 border-primary" : "hover:bg-surface-container-low"
                }`}
              >
                <span className={`font-body-md ${isSelected ? "text-primary font-bold" : "text-on-surface"}`}>{day}</span>
                {loading && <span className="font-label-md text-[10px] text-on-surface-variant">…</span>}
                {!loading && hasPct && (
                  <span className={`font-label-md text-[11px] font-bold tabular-nums ${isUp ? "text-green-700" : "text-red-600"}`}>
                    {isUp ? "+" : ""}{Number(pct).toFixed(1)}%
                  </span>
                )}
                {!loading && !hasPct && <span className="font-label-md text-[10px] text-on-surface-variant">—</span>}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Year Grid ────────────────────────────────────────────────────────────────

function YearGrid({ year, entriesMap, loading, selectedDate, onSelectMonth }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-px bg-outline-variant">
      {MONTH_NAMES.map((name, idx) => {
        const entry = entriesMap[idx + 1]; // backend keys months 1-12
        const pct = entry?.changePct;
        const hasPct = pct != null && !Number.isNaN(Number(pct));
        const isUp = Number(pct) >= 0;
        const iso = `${year}-${String(idx + 1).padStart(2, "0")}`;
        const isSelected = selectedDate === iso;
        return (
          <button
            key={idx}
            onClick={() => onSelectMonth(idx)}
            className={`bg-surface p-lg flex flex-col items-center gap-sm transition-colors cursor-pointer ${
              isSelected ? "bg-primary/10 ring-2 ring-primary ring-inset" : "hover:bg-surface-container-low"
            }`}
          >
            <span className={`font-headline-md text-headline-md ${isSelected ? "text-primary" : "text-on-surface"}`}>{name.slice(0, 3)}</span>
            {loading && <span className="font-label-md text-on-surface-variant">…</span>}
            {!loading && hasPct && (
              <span className={`font-label-md font-bold tabular-nums ${isUp ? "text-green-700" : "text-red-600"}`}>
                {isUp ? "+" : ""}{Number(pct).toFixed(1)}%
              </span>
            )}
            {!loading && !hasPct && <span className="font-label-md text-on-surface-variant">—</span>}
          </button>
        );
      })}
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({ detail, loading, selectedDate, type, onExport }) {
  if (!selectedDate) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-md p-lg text-center">
        <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">touch_app</span>
        <span className="font-body-md text-on-surface-variant">Click a {type === "day" ? "day" : "month"} to see details.</span>
      </div>
    );
  }

  if (loading && !detail) {
    return (
      <div className="flex-1 flex items-center justify-center p-lg">
        <span className="material-symbols-outlined animate-spin text-primary">refresh</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md uppercase tracking-tight">Detail</span>
          <span className="font-label-md text-label-md text-on-surface-variant">{selectedDate}</span>
        </div>
        <button
          onClick={onExport}
          disabled={!detail}
          className="flex items-center gap-xs px-md py-sm bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest hover:bg-surface hover:text-primary border border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          Export
        </button>
      </div>

      {/* Summary */}
      <div className="p-lg grid grid-cols-2 gap-md border-b border-outline-variant">
        <Stat label="Sales Amount" value={peso(detail?.totalSalesAmount)} />
        <Stat label="Sales Count" value={detail?.totalSalesCount ?? 0} />
        <Stat label="Expenses" value={peso(detail?.totalExpenses)} />
        <Stat label="Deleted Sales" value={detail?.deletedSalesCount ?? 0} error />
        <Stat label="Deleted Stocks" value={detail?.deletedStocksCount ?? 0} error />
      </div>
    </div>
  );
}

function Stat({ label, value, error }) {
  return (
    <div className="flex flex-col">
      <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-widest">{label}</span>
      <span className={`font-headline-md text-headline-md font-bold tabular-nums ${error ? "text-error" : "text-on-surface"}`}>{value}</span>
    </div>
  );
}

export default Calendar;

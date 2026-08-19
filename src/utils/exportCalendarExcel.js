import XLSX from "xlsx-js-style";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  BLACK:       "1B1B1F",
  WHITE:       "FFFFFF",
  SECTION_HDR: "D9D9D9",
  COL_HDR:     "2F4F4F",
  SUBTOTAL:    "DDEEFF",
  TOTAL:       "AACCEE",
  ALT:         "F7F9FC",
  BATCH:       "F0F0F0",
  PROFIT_BG:   "C6EFCE", PROFIT_FG: "276221",
  LOSS_BG:     "FFC7CE", LOSS_FG:   "9C0006",
  EVEN_BG:     "FFEB9C", EVEN_FG:   "9C6500",
  ERROR_FG:    "9C0006",
};

// ─── Style factories ──────────────────────────────────────────────────────────
const border = {
  top:    { style: "thin", color: { rgb: "C4C4C4" } },
  bottom: { style: "thin", color: { rgb: "C4C4C4" } },
  left:   { style: "thin", color: { rgb: "C4C4C4" } },
  right:  { style: "thin", color: { rgb: "C4C4C4" } },
};

function s(overrides = {}) {
  return {
    font:      { name: "Arial", sz: 10, ...overrides.font },
    alignment: { vertical: "center", ...overrides.alignment },
    border,
    ...(overrides.fill  ? { fill:   { fgColor: { rgb: overrides.fill } } }  : {}),
    ...(overrides.numFmt ? { numFmt: overrides.numFmt } : {}),
  };
}

const PESO = "₱#,##0.00";
const QTY  = "#,##0.##";
const INT  = "#,##0";

// Styles used throughout
const ST = {
  title:      s({ font: { name: "Arial", sz: 14, bold: true } }),
  subtitle:   s({ font: { name: "Arial", sz: 11, bold: true } }),
  meta:       s({ font: { name: "Arial", sz: 10 } }),
  sectionHdr: s({ font: { name: "Arial", sz: 12, bold: true }, fill: C.SECTION_HDR }),
  colHdr:     s({ font: { name: "Arial", sz: 10, bold: true, color: { rgb: C.WHITE } }, fill: C.COL_HDR, alignment: { horizontal: "center", vertical: "center" } }),
  label:      s({ font: { name: "Arial", sz: 10, bold: true } }),
  body:       s({}),
  bodyR:      s({ alignment: { horizontal: "right", vertical: "center" } }),
  bodyPeso:   s({ alignment: { horizontal: "right", vertical: "center" }, numFmt: PESO }),
  bodyQty:    s({ alignment: { horizontal: "right", vertical: "center" }, numFmt: QTY }),
  bodyInt:    s({ alignment: { horizontal: "right", vertical: "center" }, numFmt: INT }),
  bodyErr:    s({ font: { name: "Arial", sz: 10, color: { rgb: C.ERROR_FG } }, alignment: { horizontal: "right", vertical: "center" }, numFmt: INT }),
  altBody:    s({ fill: C.ALT }),
  altBodyR:   s({ fill: C.ALT, alignment: { horizontal: "right", vertical: "center" } }),
  altPeso:    s({ fill: C.ALT, alignment: { horizontal: "right", vertical: "center" }, numFmt: PESO }),
  altQty:     s({ fill: C.ALT, alignment: { horizontal: "right", vertical: "center" }, numFmt: QTY }),
  altInt:     s({ fill: C.ALT, alignment: { horizontal: "right", vertical: "center" }, numFmt: INT }),
  altErr:     s({ fill: C.ALT, font: { name: "Arial", sz: 10, color: { rgb: C.ERROR_FG } }, alignment: { horizontal: "right", vertical: "center" }, numFmt: INT }),
  subtotal:   s({ font: { name: "Arial", sz: 10, bold: true }, fill: C.SUBTOTAL, alignment: { horizontal: "right", vertical: "center" } }),
  subtotalL:  s({ font: { name: "Arial", sz: 10, bold: true }, fill: C.SUBTOTAL }),
  subtotalP:  s({ font: { name: "Arial", sz: 10, bold: true }, fill: C.SUBTOTAL, alignment: { horizontal: "right", vertical: "center" }, numFmt: PESO }),
  total:      s({ font: { name: "Arial", sz: 10, bold: true }, fill: C.TOTAL, alignment: { horizontal: "right", vertical: "center" } }),
  totalL:     s({ font: { name: "Arial", sz: 10, bold: true }, fill: C.TOTAL }),
  totalP:     s({ font: { name: "Arial", sz: 10, bold: true }, fill: C.TOTAL, alignment: { horizontal: "right", vertical: "center" }, numFmt: PESO }),
  batch:      s({ font: { name: "Arial", sz: 9, italic: true, color: { rgb: "555555" } }, fill: C.BATCH }),
  batchR:     s({ font: { name: "Arial", sz: 9, italic: true, color: { rgb: "555555" } }, fill: C.BATCH, alignment: { horizontal: "right", vertical: "center" } }),
  batchP:     s({ font: { name: "Arial", sz: 9, italic: true, color: { rgb: "555555" } }, fill: C.BATCH, alignment: { horizontal: "right", vertical: "center" }, numFmt: PESO }),
  batchQ:     s({ font: { name: "Arial", sz: 9, italic: true, color: { rgb: "555555" } }, fill: C.BATCH, alignment: { horizontal: "right", vertical: "center" }, numFmt: QTY }),
  profit:     s({ font: { name: "Arial", sz: 11, bold: true, color: { rgb: C.PROFIT_FG } }, fill: C.PROFIT_BG, alignment: { horizontal: "right", vertical: "center" }, numFmt: PESO }),
  profitL:    s({ font: { name: "Arial", sz: 11, bold: true, color: { rgb: C.PROFIT_FG } }, fill: C.PROFIT_BG }),
  loss:       s({ font: { name: "Arial", sz: 11, bold: true, color: { rgb: C.LOSS_FG } }, fill: C.LOSS_BG, alignment: { horizontal: "right", vertical: "center" }, numFmt: PESO }),
  lossL:      s({ font: { name: "Arial", sz: 11, bold: true, color: { rgb: C.LOSS_FG } }, fill: C.LOSS_BG }),
  even:       s({ font: { name: "Arial", sz: 11, bold: true, color: { rgb: C.EVEN_FG } }, fill: C.EVEN_BG, alignment: { horizontal: "right", vertical: "center" }, numFmt: PESO }),
  evenL:      s({ font: { name: "Arial", sz: 11, bold: true, color: { rgb: C.EVEN_FG } }, fill: C.EVEN_BG }),
  plRow:      s({ font: { name: "Arial", sz: 10, bold: true }, alignment: { horizontal: "right", vertical: "center" }, numFmt: PESO }),
  plRowL:     s({ font: { name: "Arial", sz: 10, bold: true } }),
  empty:      { v: "", t: "s", s: {} },
};

// ─── Cell helper ──────────────────────────────────────────────────────────────
function c(v, style) {
  const t = typeof v === "number" ? "n" : "s";
  return { v: v ?? 0, t, s: style };
}

function blank(style = {}) { return { v: "", t: "s", s: style }; }

// Fill a row to N columns with blank cells carrying the given style
function pad(row, n, style = {}) {
  while (row.length < n) row.push(blank(style));
  return row;
}

// ─── Spacer row ───────────────────────────────────────────────────────────────
function spacer(n) { return Array(n).fill(blank()); }

// ─── Section header row ───────────────────────────────────────────────────────
function sectionHeader(label, n) {
  return [c(label, ST.sectionHdr), ...Array(n - 1).fill(blank({ fill: { fgColor: { rgb: C.SECTION_HDR } } }))];
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function exportCalendarExcel(detail, meta = {}) {
  const {
    businessName = "Business",
    dateLabel = "",
    fromDate = "",
    toDate = "",
    periodType = "",
  } = meta;

  const N = 8;
  const rows = [];
  const merges = [];

  function mergeRow(r, c1 = 0, c2 = N - 1) {
    merges.push({ s: { r, c: c1 }, e: { r, c: c2 } });
  }

  rows.push(pad([c(businessName, ST.title)], N)); mergeRow(rows.length - 1);
  rows.push(pad([c("Sales Calendar Report", ST.subtitle)], N)); mergeRow(rows.length - 1);
  rows.push(pad([c(`Generated: ${dateLabel}`, ST.meta)], N)); mergeRow(rows.length - 1);
  rows.push(pad([c(`Period: ${fromDate} to ${toDate}`, ST.meta)], N)); mergeRow(rows.length - 1);
  rows.push(pad([c(`Period Type: ${periodType || (fromDate === toDate ? "Daily" : "Monthly")}`, ST.meta)], N)); mergeRow(rows.length - 1);
  rows.push(spacer(N));

  rows.push(sectionHeader("SUMMARY", N)); mergeRow(rows.length - 1);

  const summaryItems = [
    ["Total Revenue (₱)", Number(detail?.totalRevenue ?? detail?.profitLossSummary?.revenue ?? 0), true],
    ["Total Sales Count", Number(detail?.totalSalesCount ?? 0), false],
    ["Pending Sales Count", Number(detail?.pendingSalesCount ?? 0), false],
    ["Total Expenses (₱)", Number(detail?.totalExpenses ?? detail?.profitLossSummary?.totalExpenses ?? 0), true],
  ];

  summaryItems.forEach(([label, value, isPeso]) => {
    rows.push([
      c(label, ST.label),
      c(value, isPeso ? ST.bodyPeso : ST.bodyR),
      ...Array(N - 2).fill(blank()),
    ]);
    merges.push({ s: { r: rows.length - 1, c: 1 }, e: { r: rows.length - 1, c: N - 1 } });
  });

  rows.push(spacer(N));

  rows.push(sectionHeader("SALES BY MATERIAL", N)); mergeRow(rows.length - 1);
  rows.push(["Material", "Paid", "Pending", "Qty Consumed", "Sales Amount (₱)", "", "", ""].map((h) => c(h, ST.colHdr)));

  const salesByMaterial = detail?.salesByMaterial || [];
  let salesTotalPaid = 0;
  let salesTotalPending = 0;
  let salesTotalQty = 0;
  let salesTotalAmount = 0;

  salesByMaterial.forEach((item, index) => {
    const alt = index % 2 === 1;
    rows.push([
      c(item.name || "Untitled", alt ? ST.altBody : ST.body),
      c(item.paid ?? 0, alt ? ST.altInt : ST.bodyInt),
      c(item.pending ?? 0, alt ? ST.altInt : ST.bodyInt),
      c(item.qtyConsumed ?? 0, alt ? ST.altQty : ST.bodyQty),
      c(item.salesAmount ?? 0, alt ? ST.altPeso : ST.bodyPeso),
      blank(), blank(), blank(),
    ]);
    salesTotalPaid += item.paid ?? 0;
    salesTotalPending += item.pending ?? 0;
    salesTotalQty += item.qtyConsumed ?? 0;
    salesTotalAmount += item.salesAmount ?? 0;
  });

  if (salesByMaterial.length === 0) {
    rows.push(pad([c("No sales activity in this period.", ST.body)], N)); mergeRow(rows.length - 1);
  } else {
    rows.push([
      c("TOTAL", ST.totalL),
      c(salesTotalPaid, ST.total),
      c(salesTotalPending, ST.total),
      c(salesTotalQty, ST.total),
      c(salesTotalAmount, ST.totalP),
      blank(ST.totalL), blank(ST.totalL), blank(ST.totalL),
    ]);
  }

  rows.push(spacer(N));

  rows.push(sectionHeader("STOCK CONSUMPTION", N)); mergeRow(rows.length - 1);
  rows.push(["Material", "Total Consumed", "Sold Qty", "Scrap Qty", "Abandoned Qty", "Reject Qty", "Stock Added", "Remaining"].map((h) => c(h, ST.colHdr)));

  const stockConsumption = detail?.stockConsumption || [];
  let stockTotalConsumed = 0;
  let stockTotalSold = 0;
  let stockTotalScrap = 0;
  let stockTotalAbandoned = 0;
  let stockTotalReject = 0;
  let stockTotalAdded = 0;
  let stockTotalRemaining = 0;

  stockConsumption.forEach((item, index) => {
    const alt = index % 2 === 1;
    rows.push([
      c(item.name || "Untitled", alt ? ST.altBody : ST.body),
      c(item.totalConsumed ?? 0, alt ? ST.altQty : ST.bodyQty),
      c(item.soldQty ?? 0, alt ? ST.altQty : ST.bodyQty),
      c(item.scrapQty ?? 0, alt ? ST.altQty : ST.bodyQty),
      c(item.abandonedQty ?? 0, alt ? ST.altQty : ST.bodyQty),
      c(item.rejectQty ?? 0, alt ? ST.altQty : ST.bodyQty),
      c(item.stockAdded ?? 0, alt ? ST.altQty : ST.bodyQty),
      c(item.remainingStock ?? 0, alt ? ST.altQty : ST.bodyQty),
    ]);
    stockTotalConsumed += item.totalConsumed ?? 0;
    stockTotalSold += item.soldQty ?? 0;
    stockTotalScrap += item.scrapQty ?? 0;
    stockTotalAbandoned += item.abandonedQty ?? 0;
    stockTotalReject += item.rejectQty ?? 0;
    stockTotalAdded += item.stockAdded ?? 0;
    stockTotalRemaining += item.remainingStock ?? 0;
  });

  if (stockConsumption.length === 0) {
    rows.push(pad([c("No stock consumption in this period.", ST.body)], N)); mergeRow(rows.length - 1);
  } else {
    rows.push([
      c("TOTAL", ST.totalL),
      c(stockTotalConsumed, ST.total),
      c(stockTotalSold, ST.total),
      c(stockTotalScrap, ST.total),
      c(stockTotalAbandoned, ST.total),
      c(stockTotalReject, ST.total),
      c(stockTotalAdded, ST.total),
      c(stockTotalRemaining, ST.total),
    ]);
  }

  rows.push(spacer(N));

  rows.push(sectionHeader("EXPENSES", N)); mergeRow(rows.length - 1);
  rows.push(["Title", "Category", "Amount (₱)", "Remarks", "Linked Material", "", "", ""].map((h) => c(h, ST.colHdr)));

  const expenses = detail?.expenses || [];
  let expenseTotal = 0;

  expenses.forEach((item, index) => {
    const alt = index % 2 === 1;
    rows.push([
      c(item.title || "—", alt ? ST.altBody : ST.body),
      c(item.category || "—", alt ? ST.altBody : ST.body),
      c(item.amount ?? 0, alt ? ST.altPeso : ST.bodyPeso),
      c(item.remarks || "—", alt ? ST.altBody : ST.body),
      c(item.linkedMaterial || "—", alt ? ST.altBody : ST.body),
      blank(), blank(), blank(),
    ]);
    expenseTotal += item.amount ?? 0;
  });

  if (expenses.length === 0) {
    rows.push(pad([c("No expenses in this period.", ST.body)], N)); mergeRow(rows.length - 1);
  } else {
    rows.push([
      c("Total Expenses (₱)", ST.totalL),
      blank(ST.totalL),
      c(expenseTotal, ST.totalP),
      ...Array(N - 3).fill(blank(ST.totalL)),
    ]);
  }

  rows.push(spacer(N));

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!merges"] = merges;
  ws["!cols"] = [
    { wch: 30 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 18 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
  ];
  ws["!rows"] = [
    { hpt: 24 },
    { hpt: 18 },
    { hpt: 15 },
    { hpt: 15 },
    { hpt: 15 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

  const safeName = businessName.replace(/[^a-zA-Z0-9]/g, "_");
  const periodVal = fromDate || "report";
  XLSX.writeFile(wb, `IS2R_Report_${safeName}_${periodVal}.xlsx`);
}

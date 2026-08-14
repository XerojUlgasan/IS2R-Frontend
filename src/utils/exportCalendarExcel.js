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

/**
 * detail shape expected from the enhanced backend:
 * {
 *   totalSalesAmount, totalSalesCount, totalExpenses,
 *   pendingSalesCount, scrapCount, abandonedCount, rejectedCount,
 *   totalStockAdded, totalConsumed,
 *   deletedSalesCount, deletedStocksCount,
 *
 *   // Sales detail per material
 *   salesByMaterial: [{ materialId, name, paid, pending, scrap, abandoned, reject, salesAmount, deletedSales }]
 *
 *   // Stock consumption
 *   stockConsumption: [{
 *     materialId, name,
 *     totalConsumed, batchesConsumed, stockAdded, remainingStock,
 *     batches: [{ batchId, mfgPrice, qtyAdded, qtyDeducted, remainingStock, status }]
 *   }]
 *
 *   // Expenses
 *   generalExpenses: [{ category, count, totalAmount, remarks }]
 *   stockExpenses:   [{ materialName, batchId, category, amount, remarks }]
 *   totalExpenses
 *
 *   // P&L
 *   revenue, cogs, grossProfit, netProfitLoss
 * }
 */
export function exportCalendarExcel(detail, meta = {}) {
  const {
    businessName = "Business",
    dateLabel = "",
    fromDate = "",
    toDate = "",
    periodType = "",
  } = meta;

  const N = 8; // total columns
  const rows = [];
  const merges = [];

  function mergeRow(r, c1 = 0, c2 = N - 1) {
    merges.push({ s: { r, c: c1 }, e: { r, c: c2 } });
  }

  // ── 1. Report Header ───────────────────────────────────────────────────────
  rows.push(pad([c(businessName, ST.title)], N));           mergeRow(rows.length - 1);
  rows.push(pad([c("Sales Calendar Report", ST.subtitle)], N)); mergeRow(rows.length - 1);
  rows.push(pad([c(`Generated: ${dateLabel}`, ST.meta)], N));   mergeRow(rows.length - 1);
  rows.push(pad([c(`Period: ${fromDate} to ${toDate}`, ST.meta)], N)); mergeRow(rows.length - 1);
  rows.push(pad([c(`Period Type: ${periodType || (fromDate === toDate ? "Daily" : "Monthly")}`, ST.meta)], N)); mergeRow(rows.length - 1);
  rows.push(spacer(N));

  // ── 2. Summary Block ───────────────────────────────────────────────────────
  rows.push(sectionHeader("SUMMARY", N)); mergeRow(rows.length - 1);

  const summaryItems = [
    ["Total Revenue (₱)",    detail?.totalSalesAmount ?? 0, true],
    ["Total Sales Count",    detail?.totalSalesCount  ?? 0, false],
    ["Pending Sales Count",  detail?.pendingSalesCount ?? 0, false],
    ["Total Expenses (₱)",   detail?.totalExpenses    ?? 0, true],
    ["Net Profit / Loss (₱)", detail?.netProfitLoss   ?? 0, true],
  ];

  summaryItems.forEach(([label, value, isPeso]) => {
    const row = [
      c(label, ST.label),
      c(value, isPeso ? ST.bodyPeso : ST.bodyR),
      ...Array(N - 2).fill(blank()),
    ];
    merges.push({ s: { r: rows.length, c: 1 }, e: { r: rows.length, c: N - 1 } });
    rows.push(row);
  });

  rows.push(spacer(N));

  // ── 3. Sales Detail ────────────────────────────────────────────────────────
  rows.push(sectionHeader("SALES DETAIL", N)); mergeRow(rows.length - 1);

  const salesHdrs = ["Material", "PAID", "PENDING", "Qty Consumed", "Sales Amount (₱)", "", "", ""];
  rows.push(salesHdrs.map((h) => c(h, ST.colHdr)));

  const salesByMaterial = detail?.salesByMaterial || [];
  let sTotalPaid = 0, sTotalPending = 0, sTotalQty = 0, sTotalAmt = 0;

  salesByMaterial.forEach((m, i) => {
    const alt = i % 2 === 1;
    rows.push([
      c(m.name         || "Untitled", alt ? ST.altBody : ST.body),
      c(m.paid         ?? 0,          alt ? ST.altInt  : ST.bodyInt),
      c(m.pending      ?? 0,          alt ? ST.altInt  : ST.bodyInt),
      c(m.qtyConsumed  ?? 0,          alt ? ST.altQty  : ST.bodyQty),
      c(m.salesAmount  ?? 0,          alt ? ST.altPeso : ST.bodyPeso),
      blank(), blank(),
    ]);
    sTotalPaid    += m.paid        ?? 0;
    sTotalPending += m.pending     ?? 0;
    sTotalQty     += m.qtyConsumed ?? 0;
    sTotalAmt     += m.salesAmount ?? 0;
  });

  if (salesByMaterial.length === 0) {
    rows.push(pad([c("No data for this period.", ST.body)], N)); mergeRow(rows.length - 1);
  }

  rows.push([
    c("TOTAL", ST.totalL),
    c(sTotalPaid,    ST.total),
    c(sTotalPending, ST.total),
    c(sTotalQty,     ST.total),
    c(sTotalAmt,     ST.totalP),
    blank(ST.totalL), blank(ST.totalL),
  ]);

  rows.push(spacer(N));

  // ── 4. Stock Consumption ───────────────────────────────────────────────────
  rows.push(sectionHeader("STOCK CONSUMPTION", N)); mergeRow(rows.length - 1);

  const consHdrs = ["Material", "Total Qty Consumed", "Sold Qty", "Scrap Qty", "Abandoned Qty", "Reject Qty", "Stock Added (qty)", "Remaining Stock"];
  rows.push(consHdrs.map((h) => c(h, ST.colHdr)));

  const stockConsumption = detail?.stockConsumption || [];

  if (stockConsumption.length === 0) {
    rows.push(pad([c("No data for this period.", ST.body)], N)); mergeRow(rows.length - 1);
  }

  let cTotalConsumed = 0, cTotalSold = 0, cTotalAdded = 0, cTotalRemaining = 0, cTotalScrap = 0, cTotalAbandoned = 0, cTotalReject = 0;

  stockConsumption.forEach((m, i) => {
    const alt = i % 2 === 1;
    rows.push([
      c(m.name           || "Untitled", alt ? ST.altBody : ST.body),
      c(m.totalConsumed  ?? 0,          alt ? ST.altQty  : ST.bodyQty),
      c(m.soldQty        ?? 0,          alt ? ST.altQty  : ST.bodyQty),
      c(m.scrapQty       ?? 0,          alt ? ST.altQty  : ST.bodyQty),
      c(m.abandonedQty   ?? 0,          alt ? ST.altQty  : ST.bodyQty),
      c(m.rejectQty      ?? 0,          alt ? ST.altQty  : ST.bodyQty),
      c(m.stockAdded     ?? 0,          alt ? ST.altQty  : ST.bodyQty),
      c(m.remainingStock ?? 0,          alt ? ST.altQty  : ST.bodyQty),
    ]);
    cTotalConsumed  += m.totalConsumed  ?? 0;
    cTotalSold      += m.soldQty        ?? 0;
    cTotalAdded     += m.stockAdded     ?? 0;
    cTotalRemaining += m.remainingStock ?? 0;
    cTotalScrap     += m.scrapQty       ?? 0;
    cTotalAbandoned += m.abandonedQty   ?? 0;
    cTotalReject    += m.rejectQty      ?? 0;
  });

  if (stockConsumption.length > 0) {
    rows.push([
      c("TOTAL", ST.totalL),
      c(cTotalConsumed,  ST.total),
      c(cTotalSold,      ST.total),
      c(cTotalScrap,     ST.total),
      c(cTotalAbandoned, ST.total),
      c(cTotalReject,    ST.total),
      c(cTotalAdded,     ST.total),
      c(cTotalRemaining, ST.total),
    ]);
  }

  rows.push(spacer(N));

  // ── 5. Expenses ────────────────────────────────────────────────────────────
  rows.push(sectionHeader("EXPENSES", N)); mergeRow(rows.length - 1);

  // Single unified expenses table: title, category, amount, remarks, material (if stock-linked)
  const expHdrs = ["Title", "Category", "Amount (₱)", "Remarks", "Linked Material", "", "", ""];
  rows.push(expHdrs.map((h) => c(h, ST.colHdr)));

  // Merge both arrays — generalExpenses have no materialName, stockExpenses do
  const allExpenses = [
    ...(detail?.generalExpenses || []).map((e) => ({
      title:        e.title    || "—",
      category:     e.category || "—",
      amount:       e.amount   ?? e.totalAmount ?? 0,
      remarks:      e.remarks  || "—",
      materialName: "—",
    })),
    ...(detail?.stockExpenses || []).map((e) => ({
      title:        e.title        || "—",
      category:     e.category     || "—",
      amount:       e.amount       ?? 0,
      remarks:      e.remarks      || "—",
      materialName: e.materialName || "—",
    })),
  ];

  let expTotal = 0;

  if (allExpenses.length === 0) {
    rows.push(pad([c("No expenses for this period.", ST.body)], N)); mergeRow(rows.length - 1);
  }

  allExpenses.forEach((e, i) => {
    const alt = i % 2 === 1;
    rows.push([
      c(e.title,        alt ? ST.altBody : ST.body),
      c(e.category,     alt ? ST.altBody : ST.body),
      c(e.amount,       alt ? ST.altPeso : ST.bodyPeso),
      c(e.remarks,      alt ? ST.altBody : ST.body),
      c(e.materialName, alt ? ST.altBody : ST.body),
      blank(), blank(), blank(),
    ]);
    expTotal += e.amount;
  });

  const expGrandTotal = detail?.totalExpenses ?? expTotal;
  rows.push([
    c("Total Expenses (₱)", ST.totalL),
    blank(ST.totalL),
    c(expGrandTotal, ST.totalP),
    ...Array(N - 3).fill(blank(ST.totalL)),
  ]);

  rows.push(spacer(N));

  // ── 6. Profit / Loss Summary ───────────────────────────────────────────────
  rows.push(sectionHeader("PROFIT / LOSS SUMMARY", N)); mergeRow(rows.length - 1);

  const revenue  = detail?.revenue       ?? detail?.totalSalesAmount ?? 0;
  const totalExp = detail?.totalExpenses ?? 0;
  const net      = detail?.netProfitLoss ?? (revenue - totalExp);

  const plItems = [
    ["Revenue (PAID sales)", revenue],
    ["Total Expenses",       totalExp],
  ];

  plItems.forEach(([label, value]) => {
    rows.push([
      c(label, ST.plRowL),
      blank(),
      c(value, ST.plRow),
      ...Array(N - 3).fill(blank()),
    ]);
    merges.push({ s: { r: rows.length - 1, c: 0 }, e: { r: rows.length - 1, c: 1 } });
    merges.push({ s: { r: rows.length - 1, c: 2 }, e: { r: rows.length - 1, c: N - 1 } });
  });

  // Divider
  rows.push(pad([c("─────────────────────────────────────────", ST.meta)], N)); mergeRow(rows.length - 1);

  // Net result row
  let netLabelStyle, netValStyle;
  let netLabel;
  if (net > 0)       { netLabel = "NET PROFIT";  netLabelStyle = ST.profitL; netValStyle = ST.profit; }
  else if (net < 0)  { netLabel = "NET LOSS";    netLabelStyle = ST.lossL;   netValStyle = ST.loss;   }
  else               { netLabel = "BREAK EVEN";  netLabelStyle = ST.evenL;   netValStyle = ST.even;   }

  rows.push([
    c(netLabel, netLabelStyle),
    blank(netLabelStyle),
    c(net, netValStyle),
    ...Array(N - 3).fill(blank(netLabelStyle)),
  ]);
  merges.push({ s: { r: rows.length - 1, c: 0 }, e: { r: rows.length - 1, c: 1 } });
  merges.push({ s: { r: rows.length - 1, c: 2 }, e: { r: rows.length - 1, c: N - 1 } });

  // ── Build worksheet ────────────────────────────────────────────────────────
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!merges"] = merges;
  ws["!cols"] = [
    { wch: 30 }, // A – Material / Label
    { wch: 16 }, // B
    { wch: 18 }, // C
    { wch: 16 }, // D
    { wch: 16 }, // E
    { wch: 14 }, // F
    { wch: 18 }, // G
    { wch: 16 }, // H
  ];
  ws["!rows"] = [
    { hpt: 24 }, // title
    { hpt: 18 }, // subtitle
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

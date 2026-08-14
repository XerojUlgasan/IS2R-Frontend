import XLSX from "xlsx-js-style";

// ─── Style Definitions ────────────────────────────────────────────────────────

const FONT_BOLD = { bold: true, sz: 11 };
const FONT_TITLE = { bold: true, sz: 14, color: { rgb: "1B1B1F" } };
const FONT_SUBTITLE = { bold: true, sz: 11, color: { rgb: "44474E" } };
const FONT_HEADER = { bold: true, sz: 10, color: { rgb: "FFFFFF" } };
const FONT_BODY = { sz: 10 };
const FONT_TOTAL = { bold: true, sz: 10 };
const FONT_ERROR = { bold: true, sz: 10, color: { rgb: "BA1A1A" } };

const FILL_PRIMARY = { fgColor: { rgb: "1B1B1F" } }; // dark header
const FILL_LIGHT = { fgColor: { rgb: "F3F0F4" } };   // alternating rows
const FILL_SUMMARY = { fgColor: { rgb: "E8DEF8" } }; // summary section
const FILL_TOTAL = { fgColor: { rgb: "D6D6D6" } };   // total row

const BORDER_THIN = {
  top: { style: "thin", color: { rgb: "C4C4C4" } },
  bottom: { style: "thin", color: { rgb: "C4C4C4" } },
  left: { style: "thin", color: { rgb: "C4C4C4" } },
  right: { style: "thin", color: { rgb: "C4C4C4" } },
};

const ALIGN_CENTER = { horizontal: "center", vertical: "center" };
const ALIGN_RIGHT = { horizontal: "right", vertical: "center" };
const ALIGN_LEFT = { horizontal: "left", vertical: "center" };

const NUM_FMT_PESO = "₱#,##0.00";
const NUM_FMT_INT = "#,##0";

// ─── Helper ───────────────────────────────────────────────────────────────────

function cell(v, style = {}) {
  const t = typeof v === "number" ? "n" : "s";
  return { v, t, s: style };
}

// ─── Export Function ──────────────────────────────────────────────────────────

// Exports the calendar detail data as a styled Excel file.
// `detail` = the full detail response from the calendar/detail endpoint.
// `meta` = { businessName, dateLabel, fromDate, toDate }.
export function exportCalendarExcel(detail, meta = {}) {
  const { businessName = "Business", dateLabel = "", fromDate = "", toDate = "" } = meta;
  const materials = detail?.materials || [];

  const rows = [];

  // ── Title Section ─────────────────────────────────────────────────────────

  // Row 0: Title
  rows.push([
    cell(businessName, { font: FONT_TITLE, alignment: ALIGN_LEFT }),
    cell("", {}), cell("", {}), cell("", {}), cell("", {}),
    cell("", {}), cell("", {}), cell("", {}), cell("", {}),
  ]);

  // Row 1: Subtitle (report type)
  rows.push([
    cell("Sales Calendar Report", { font: FONT_SUBTITLE, alignment: ALIGN_LEFT }),
    cell("", {}), cell("", {}), cell("", {}), cell("", {}),
    cell("", {}), cell("", {}), cell("", {}), cell("", {}),
  ]);

  // Row 2: Date generated
  rows.push([
    cell(`Generated: ${dateLabel}`, { font: FONT_BODY, alignment: ALIGN_LEFT }),
    cell("", {}), cell("", {}), cell("", {}), cell("", {}),
    cell("", {}), cell("", {}), cell("", {}), cell("", {}),
  ]);

  // Row 3: Period
  rows.push([
    cell(`Period: ${fromDate} to ${toDate}`, { font: FONT_BODY, alignment: ALIGN_LEFT }),
    cell("", {}), cell("", {}), cell("", {}), cell("", {}),
    cell("", {}), cell("", {}), cell("", {}), cell("", {}),
  ]);

  // Row 4: Spacer
  rows.push([cell("", {}), cell("", {}), cell("", {}), cell("", {}), cell("", {}), cell("", {}), cell("", {}), cell("", {}), cell("", {})]);

  // ── Summary Section ───────────────────────────────────────────────────────

  const summaryStyle = { font: FONT_BOLD, fill: FILL_SUMMARY, border: BORDER_THIN, alignment: ALIGN_LEFT };
  const summaryValStyle = { font: FONT_BODY, fill: FILL_SUMMARY, border: BORDER_THIN, alignment: ALIGN_RIGHT };
  const summaryPesoStyle = { font: FONT_BOLD, fill: FILL_SUMMARY, border: BORDER_THIN, alignment: ALIGN_RIGHT, numFmt: NUM_FMT_PESO };

  rows.push([
    cell("SUMMARY", { font: FONT_BOLD, fill: FILL_SUMMARY, border: BORDER_THIN, alignment: ALIGN_LEFT }),
    cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
    cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
    cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
    cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
    cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
    cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
    cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
    cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
  ]);

  const summaryRows = [
    ["Total Sales Amount (₱)", detail?.totalSalesAmount ?? 0, true],
    ["Total Sales Count", detail?.totalSalesCount ?? 0, false],
    ["Total Stock Added", detail?.totalStockAdded ?? 0, false],
    ["Total Consumed", detail?.totalConsumed ?? 0, false],
    ["Total Scrap Qty", detail?.totalScrapQty ?? 0, false],
    ["Total Abandoned Qty", detail?.totalAbandonedQty ?? 0, false],
    ["Deleted Sales", detail?.deletedSalesCount ?? 0, false],
    ["Deleted Stocks", detail?.deletedStocksCount ?? 0, false],
  ];

  summaryRows.forEach(([label, value, isPeso]) => {
    rows.push([
      cell(label, summaryStyle),
      cell(value, isPeso ? summaryPesoStyle : summaryValStyle),
      cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
      cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
      cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
      cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
      cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
      cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
      cell("", { fill: FILL_SUMMARY, border: BORDER_THIN }),
    ]);
  });

  // Spacer
  rows.push([cell("", {}), cell("", {}), cell("", {}), cell("", {}), cell("", {}), cell("", {}), cell("", {}), cell("", {}), cell("", {})]);

  // ── Material Table ────────────────────────────────────────────────────────

  const headerStyle = { font: FONT_HEADER, fill: FILL_PRIMARY, border: BORDER_THIN, alignment: ALIGN_CENTER };

  const headers = ["Material", "Stock Added", "Consumed", "Sales Count", "Sales Amount (₱)", "Scrap Qty", "Abandoned Qty", "Deleted Sales", "Deleted Stocks"];
  rows.push(headers.map((h) => cell(h, headerStyle)));

  materials.forEach((m, i) => {
    const isAlt = i % 2 === 1;
    const bodyStyle = { font: FONT_BODY, border: BORDER_THIN, alignment: ALIGN_LEFT, ...(isAlt ? { fill: FILL_LIGHT } : {}) };
    const numStyle = { font: FONT_BODY, border: BORDER_THIN, alignment: ALIGN_RIGHT, numFmt: NUM_FMT_INT, ...(isAlt ? { fill: FILL_LIGHT } : {}) };
    const pesoStyle = { font: FONT_BODY, border: BORDER_THIN, alignment: ALIGN_RIGHT, numFmt: NUM_FMT_PESO, ...(isAlt ? { fill: FILL_LIGHT } : {}) };
    const warnStyle = { font: FONT_ERROR, border: BORDER_THIN, alignment: ALIGN_RIGHT, numFmt: "#,##0.##", ...(isAlt ? { fill: FILL_LIGHT } : {}) };
    const errStyle = { font: FONT_ERROR, border: BORDER_THIN, alignment: ALIGN_RIGHT, numFmt: NUM_FMT_INT, ...(isAlt ? { fill: FILL_LIGHT } : {}) };

    rows.push([
      cell(m.name || "Untitled", bodyStyle),
      cell(m.stockAdded ?? 0, numStyle),
      cell(m.consumed ?? 0, numStyle),
      cell(m.salesCount ?? 0, numStyle),
      cell(m.salesAmount ?? 0, pesoStyle),
      cell(m.scrapQty ?? 0, warnStyle),
      cell(m.abandonedQty ?? 0, warnStyle),
      cell(m.deletedSales ?? 0, errStyle),
      cell(m.deletedStocks ?? 0, errStyle),
    ]);
  });

  // ── Totals Row ────────────────────────────────────────────────────────────

  const totalStyle = { font: FONT_TOTAL, fill: FILL_TOTAL, border: BORDER_THIN, alignment: ALIGN_RIGHT };
  const totalDecStyle = { font: FONT_TOTAL, fill: FILL_TOTAL, border: BORDER_THIN, alignment: ALIGN_RIGHT, numFmt: "#,##0.##" };
  const totalPesoStyle = { ...totalStyle, numFmt: NUM_FMT_PESO };
  const totalLabelStyle = { font: FONT_TOTAL, fill: FILL_TOTAL, border: BORDER_THIN, alignment: ALIGN_LEFT };

  rows.push([
    cell("TOTAL", totalLabelStyle),
    cell(detail?.totalStockAdded ?? 0, totalStyle),
    cell(detail?.totalConsumed ?? 0, totalStyle),
    cell(detail?.totalSalesCount ?? 0, totalStyle),
    cell(detail?.totalSalesAmount ?? 0, totalPesoStyle),
    cell(detail?.totalScrapQty ?? 0, totalDecStyle),
    cell(detail?.totalAbandonedQty ?? 0, totalDecStyle),
    cell(detail?.deletedSalesCount ?? 0, totalStyle),
    cell(detail?.deletedStocksCount ?? 0, totalStyle),
  ]);

  // ── Build Workbook ────────────────────────────────────────────────────────

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws["!cols"] = [
    { wch: 28 }, // Material
    { wch: 14 }, // Stock Added
    { wch: 12 }, // Consumed
    { wch: 12 }, // Sales Count
    { wch: 18 }, // Sales Amount
    { wch: 10 }, // Scrap Qty
    { wch: 14 }, // Abandoned Qty
    { wch: 14 }, // Deleted Sales
    { wch: 14 }, // Deleted Stocks
  ];

  // Row heights for title area
  ws["!rows"] = [
    { hpt: 22 }, // title
    { hpt: 18 }, // subtitle
    { hpt: 15 }, // date
    { hpt: 15 }, // period
  ];

  // Merge title cells across all columns for visual impact
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Title row
    { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }, // Subtitle row
    { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } }, // Date row
    { s: { r: 3, c: 0 }, e: { r: 3, c: 8 } }, // Period row
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Calendar Report");

  // Trigger download.
  const safeName = businessName.replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `IS2R_Calendar_${safeName}_${fromDate || "report"}.xlsx`;
  XLSX.writeFile(wb, filename);
}

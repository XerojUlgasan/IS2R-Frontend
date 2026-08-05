import React from "react";

function SalesHistory() {
  return (
    <div className="flex flex-col w-full h-full p-lg gap-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md mb-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tighter uppercase mb-xs">Sales Ledger</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Historical record of material usage and associated charges. Review payment statuses and manage outstanding balances.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <button className="h-10 px-md bg-surface-container border border-primary flex items-center justify-center gap-xs text-primary font-label-md text-label-md uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
          <button className="h-10 px-md bg-primary flex items-center justify-center gap-xs text-on-primary font-label-md text-label-md uppercase tracking-widest hover:bg-surface-container hover:text-primary hover:border hover:border-primary transition-colors group relative overflow-hidden">
            <span className="relative z-10 flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Record Sale
            </span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
        {/* Active Filters Display */}
        <div className="col-span-1 md:col-span-3 flex flex-wrap items-center gap-sm p-sm bg-surface-container-low border border-primary/20">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase ml-xs">Active Filters:</span>
          <div className="flex items-center gap-xs px-sm py-xs bg-surface border border-outline-variant">
            <span className="font-label-md text-label-md text-primary">Status: Pending</span>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-error">close</span>
          </div>
          <div className="flex items-center gap-xs px-sm py-xs bg-surface border border-outline-variant">
            <span className="font-label-md text-label-md text-primary">Date: Oct 2023</span>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-error">close</span>
          </div>
          <button className="ml-auto font-label-md text-label-md text-error uppercase hover:underline p-xs">Clear All</button>
        </div>
        <div className="col-span-1 flex justify-end items-center px-sm text-on-surface-variant font-label-md text-label-md uppercase">
          Showing 45 results
        </div>
      </div>
      {/* Table Container (Bento Box style) */}
      <div className="bg-surface border border-primary flex-1 flex flex-col min-h-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container border-b border-primary">
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest w-[180px]">Material</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest text-right">Qty Used</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest text-right">Total (₱)</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest text-center w-[120px]">Status</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest max-w-[200px]">Remarks</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest">Created By</th>
                <th className="p-md font-label-md text-label-md text-primary uppercase tracking-widest w-[140px]">Date</th>
                <th className="p-md w-[80px]"></th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface">
              {/* Row 1 */}
              <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                <td className="p-md font-headline-md text-label-md font-bold truncate">Premium Gloss 300gsm</td>
                <td className="p-md text-right font-mono text-on-surface-variant">4,500 shts</td>
                <td className="p-md text-right font-mono text-primary font-bold">38,250.00</td>
                <td className="p-md text-center">
                  <span className="inline-block px-sm py-xs border border-primary text-primary font-label-md text-[10px] uppercase tracking-widest">Pending</span>
                </td>
                <td className="p-md truncate max-w-[200px] text-on-surface-variant" title="Rush order for Horizon Marketing campaign. Needs follow-up on PO processing.">
                  Rush order for Horizon Marketing...
                </td>
                <td className="p-md">
                  <div className="flex items-center gap-xs">
                    <div className="w-5 h-5 bg-tertiary text-on-tertiary flex items-center justify-center text-[10px] font-bold">JD</div>
                    <span>J. Doe</span>
                  </div>
                </td>
                <td className="p-md font-mono text-on-surface-variant">2023-10-24</td>
                <td className="p-md text-right">
                  <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-primary hover:bg-primary hover:text-on-primary transition-colors" title="Mark Paid">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-error hover:text-error transition-colors" title="Delete">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                <td className="p-md font-headline-md text-label-md font-bold truncate">Matte Sticker Paper A3</td>
                <td className="p-md text-right font-mono text-on-surface-variant">1,200 shts</td>
                <td className="p-md text-right font-mono text-primary font-bold">14,400.00</td>
                <td className="p-md text-center">
                  <span className="inline-block px-sm py-xs bg-primary text-on-primary font-label-md text-[10px] uppercase tracking-widest">Paid</span>
                </td>
                <td className="p-md truncate max-w-[200px] text-on-surface-variant">-</td>
                <td className="p-md">
                  <div className="flex items-center gap-xs">
                    <div className="w-5 h-5 bg-surface-tint text-on-primary flex items-center justify-center text-[10px] font-bold">AM</div>
                    <span>A. Miller</span>
                  </div>
                </td>
                <td className="p-md font-mono text-on-surface-variant">2023-10-23</td>
                <td className="p-md text-right">
                  <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-error hover:text-error transition-colors" title="Delete">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                <td className="p-md font-headline-md text-label-md font-bold truncate">Cyan Ink Cartridge HC</td>
                <td className="p-md text-right font-mono text-on-surface-variant">2 units</td>
                <td className="p-md text-right font-mono text-primary font-bold">8,500.00</td>
                <td className="p-md text-center">
                  <span className="inline-block px-sm py-xs border border-primary text-primary font-label-md text-[10px] uppercase tracking-widest">Pending</span>
                </td>
                <td className="p-md truncate max-w-[200px] text-on-surface-variant text-error">Invoice dispute regarding bulk discount.</td>
                <td className="p-md">
                  <div className="flex items-center gap-xs">
                    <div className="w-5 h-5 bg-surface-tint text-on-primary flex items-center justify-center text-[10px] font-bold">AM</div>
                    <span>A. Miller</span>
                  </div>
                </td>
                <td className="p-md font-mono text-on-surface-variant">2023-10-21</td>
                <td className="p-md text-right">
                  <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-primary hover:bg-primary hover:text-on-primary transition-colors" title="Mark Paid">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-error hover:text-error transition-colors" title="Delete">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
                <td className="p-md font-headline-md text-label-md font-bold truncate">Uncoated Bond 80gsm</td>
                <td className="p-md text-right font-mono text-on-surface-variant">10,000 shts</td>
                <td className="p-md text-right font-mono text-primary font-bold">12,000.00</td>
                <td className="p-md text-center">
                  <span className="inline-block px-sm py-xs bg-primary text-on-primary font-label-md text-[10px] uppercase tracking-widest">Paid</span>
                </td>
                <td className="p-md truncate max-w-[200px] text-on-surface-variant">Internal department re-stock.</td>
                <td className="p-md">
                  <div className="flex items-center gap-xs">
                    <div className="w-5 h-5 bg-tertiary text-on-tertiary flex items-center justify-center text-[10px] font-bold">JD</div>
                    <span>J. Doe</span>
                  </div>
                </td>
                <td className="p-md font-mono text-on-surface-variant">2023-10-18</td>
                <td className="p-md text-right">
                  <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 flex items-center justify-center border border-outline-variant hover:border-error hover:text-error transition-colors" title="Delete">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        <div className="mt-auto border-t border-primary p-md flex items-center justify-between bg-surface-container-lowest">
          <div className="font-label-md text-label-md text-on-surface-variant uppercase">Page 1 of 5</div>
          <div className="flex gap-xs">
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface-variant disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary font-label-md text-label-md">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant hover:border-primary hover:text-primary font-label-md text-label-md">2</button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant hover:border-primary hover:text-primary font-label-md text-label-md">3</button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant hover:border-primary hover:text-primary text-on-surface">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesHistory;

import React from "react";

function AuditLogs() {
  return (
    <div className="flex flex-col w-full h-full max-w-7xl mx-auto gap-lg">
      {/* Header Section */}
      <div className="flex items-end justify-between border-b border-primary pb-md mt-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tighter">Audit Logs</h2>
          <p className="font-body-md text-body-md text-surface-tint mt-xs">System-wide immutable record of critical events.</p>
        </div>
        {/* Controls */}
        <div className="flex items-center gap-md">
          <div className="relative flex items-center border border-primary bg-surface-container-lowest">
            <span className="material-symbols-outlined text-[18px] text-surface-tint pl-sm">search</span>
            <input
              className="bg-transparent border-none focus:outline-none focus:ring-0 font-body-sm text-body-sm text-primary py-sm px-sm w-64 placeholder:text-surface-tint"
              placeholder="Search events..."
              type="text"
            />
          </div>
          <button className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary hover:bg-surface-tint transition-colors">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            <span className="font-label-md text-label-md uppercase">Filter</span>
          </button>
          <button className="flex items-center gap-sm px-md py-sm border border-primary bg-surface text-primary hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span className="font-label-md text-label-md uppercase">Export</span>
          </button>
        </div>
      </div>
      {/* Active Filters Bar (Hidden by default, shown for context) */}
      <div className="flex items-center gap-sm py-sm">
        <span className="font-label-md text-label-md text-surface-tint uppercase tracking-widest mr-sm">Active Filters:</span>
        <div className="flex items-center gap-xs px-sm py-xs border border-primary bg-surface-container-low">
          <span className="font-label-md text-label-md text-primary">Type: SALE_CREATED</span>
          <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error">close</span>
        </div>
        <div className="flex items-center gap-xs px-sm py-xs border border-primary bg-surface-container-low">
          <span className="font-label-md text-label-md text-primary">Date: Last 7 Days</span>
          <span className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error">close</span>
        </div>
        <button className="font-label-md text-label-md text-surface-tint hover:text-primary uppercase underline ml-sm">Clear All</button>
      </div>
      {/* Data Table */}
      <div className="border border-primary bg-surface-container-lowest overflow-hidden flex-1 flex flex-col">
        <div className="grid grid-cols-12 gap-sm px-md py-sm bg-surface-container border-b border-primary items-center">
          <div className="col-span-3 font-label-md text-label-md text-primary uppercase tracking-tighter">Action / Type</div>
          <div className="col-span-5 font-label-md text-label-md text-primary uppercase tracking-tighter">Description</div>
          <div className="col-span-2 font-label-md text-label-md text-primary uppercase tracking-tighter">Actor</div>
          <div className="col-span-2 font-label-md text-label-md text-primary uppercase tracking-tighter text-right">Timestamp</div>
        </div>
        <div className="flex-1 overflow-y-auto bg-surface-bright flex flex-col divide-y divide-primary">
          {/* Row 1 */}
          <div className="grid grid-cols-12 gap-sm px-md py-md hover:bg-surface-container-low transition-colors items-start">
            <div className="col-span-3">
              <div className="inline-flex px-sm py-xs bg-primary text-on-primary font-label-md text-[10px] uppercase tracking-widest">SALE_CREATED</div>
              <div className="font-body-sm text-[12px] text-surface-tint mt-xs font-mono">ID: INV-8924A</div>
            </div>
            <div className="col-span-5">
              <p className="font-body-sm text-body-sm text-primary">Generated new commercial invoice for 50k run, 80lb Gloss Text.</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">Client: Acme Corp</p>
            </div>
            <div className="col-span-2">
              <p className="font-body-sm text-body-sm text-primary">Alex Miller</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">IP: 192.168.1.42</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="font-body-sm text-body-sm text-primary font-mono">2023-10-27 14:32:01</p>
            </div>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-sm px-md py-md hover:bg-surface-container-low transition-colors items-start">
            <div className="col-span-3">
              <div className="inline-flex px-sm py-xs border-2 border-primary bg-surface text-primary font-label-md text-[10px] uppercase tracking-widest">STOCK_UPDATED</div>
              <div className="font-body-sm text-[12px] text-surface-tint mt-xs font-mono">MAT-CYAN-04</div>
            </div>
            <div className="col-span-5">
              <p className="font-body-sm text-body-sm text-primary">Adjusted Cyan Ink drum inventory level.</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">Delta: -45kg | Final: 120kg</p>
            </div>
            <div className="col-span-2">
              <p className="font-body-sm text-body-sm text-primary">System</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">API_KEY_PRSS3</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="font-body-sm text-body-sm text-primary font-mono">2023-10-27 14:15:44</p>
            </div>
          </div>
          {/* Row 3 */}
          <div className="grid grid-cols-12 gap-sm px-md py-md hover:bg-surface-container-low transition-colors items-start">
            <div className="col-span-3">
              <div className="inline-flex px-sm py-xs bg-error text-on-error font-label-md text-[10px] uppercase tracking-widest">AUTH_FAILED</div>
              <div className="font-body-sm text-[12px] text-surface-tint mt-xs font-mono">USR-UNKN</div>
            </div>
            <div className="col-span-5">
              <p className="font-body-sm text-body-sm text-error font-bold">Invalid credentials provided during login attempt.</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">Target: admin@monolith.qc</p>
            </div>
            <div className="col-span-2">
              <p className="font-body-sm text-body-sm text-primary">Unknown</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">IP: 45.33.12.9</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="font-body-sm text-body-sm text-primary font-mono">2023-10-27 13:58:12</p>
            </div>
          </div>
          {/* Row 4 */}
          <div className="grid grid-cols-12 gap-sm px-md py-md hover:bg-surface-container-low transition-colors items-start">
            <div className="col-span-3">
              <div className="inline-flex px-sm py-xs border-2 border-primary bg-surface text-primary font-label-md text-[10px] uppercase tracking-widest">SETTINGS_MODIFIED</div>
              <div className="font-body-sm text-[12px] text-surface-tint mt-xs font-mono">CFG-TAX-RATE</div>
            </div>
            <div className="col-span-5">
              <p className="font-body-sm text-body-sm text-primary">Updated regional tax multiplier.</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">Old: 0.08 | New: 0.0825</p>
            </div>
            <div className="col-span-2">
              <p className="font-body-sm text-body-sm text-primary">Sarah Jenkins</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">IP: 192.168.1.15</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="font-body-sm text-body-sm text-primary font-mono">2023-10-27 11:20:05</p>
            </div>
          </div>
          {/* Row 5 */}
          <div className="grid grid-cols-12 gap-sm px-md py-md hover:bg-surface-container-low transition-colors items-start">
            <div className="col-span-3">
              <div className="inline-flex px-sm py-xs bg-primary text-on-primary font-label-md text-[10px] uppercase tracking-widest">PAYMENT_RCVD</div>
              <div className="font-body-sm text-[12px] text-surface-tint mt-xs font-mono">TX-99824X</div>
            </div>
            <div className="col-span-5">
              <p className="font-body-sm text-body-sm text-primary">Registered incoming wire transfer.</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">Amount: $14,500.00 | Ref: INV-8910</p>
            </div>
            <div className="col-span-2">
              <p className="font-body-sm text-body-sm text-primary">System</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">STRIPE_WEBHOOK</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="font-body-sm text-body-sm text-primary font-mono">2023-10-27 09:05:33</p>
            </div>
          </div>
          {/* Row 6 */}
          <div className="grid grid-cols-12 gap-sm px-md py-md hover:bg-surface-container-low transition-colors items-start">
            <div className="col-span-3">
              <div className="inline-flex px-sm py-xs bg-primary text-on-primary font-label-md text-[10px] uppercase tracking-widest">JOB_QUEUED</div>
              <div className="font-body-sm text-[12px] text-surface-tint mt-xs font-mono">JOB-K882</div>
            </div>
            <div className="col-span-5">
              <p className="font-body-sm text-body-sm text-primary">Sent layout file to Press 2 RIP server.</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">File: ACME_Brochure_Q4_FINAL_v2.pdf</p>
            </div>
            <div className="col-span-2">
              <p className="font-body-sm text-body-sm text-primary">Marcus T.</p>
              <p className="font-body-sm text-[12px] text-surface-tint mt-xs">IP: 192.168.1.102</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="font-body-sm text-body-sm text-primary font-mono">2023-10-26 16:45:11</p>
            </div>
          </div>
        </div>
        {/* Pagination Footer */}
        <div className="border-t border-primary bg-surface-container-lowest p-md flex items-center justify-between">
          <p className="font-body-sm text-surface-tint">Showing 1-6 of 2,841 events</p>
          <div className="flex items-center gap-xs">
            <button className="w-8 h-8 flex items-center justify-center border border-primary text-surface-tint hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary font-label-md">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-primary text-primary hover:bg-surface-container transition-colors font-label-md">2</button>
            <button className="w-8 h-8 flex items-center justify-center border border-primary text-primary hover:bg-surface-container transition-colors font-label-md">3</button>
            <span className="px-sm text-surface-tint">...</span>
            <button className="w-8 h-8 flex items-center justify-center border border-primary text-primary hover:bg-surface-container transition-colors font-label-md">47</button>
            <button className="w-8 h-8 flex items-center justify-center border border-primary text-primary hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLogs;

import React from "react";

function Dashboard() {
  return (
    <div className="flex flex-col w-full min-h-full gap-lg">
      {/* Dashboard Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full mb-lg">
        <div className="flex flex-col gap-xs">
          <h1 className="font-display-lg text-display-lg text-on-surface uppercase">Owner Overview</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            High-level snapshot of current financial and operational metrics.
          </p>
        </div>
        <div className="flex gap-md mt-md md:mt-0">
          <button className="bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest px-lg py-sm border border-primary hover:bg-surface-container-lowest hover:text-primary transition-colors duration-200">
            Generate Report
          </button>
        </div>
      </div>
      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-md w-full">
        {/* Today's Revenue (Large) */}
        <div className="col-span-1 md:col-span-8 bg-surface border border-outline-variant p-lg flex flex-col justify-between min-h-[300px] relative group overflow-hidden">
          <div className="flex justify-between items-start z-10 relative">
            <span className="font-headline-md text-headline-md text-primary tracking-tight uppercase">Today's Revenue</span>
            <span className="material-symbols-outlined text-primary text-[32px]">trending_up</span>
          </div>
          <div className="flex flex-col gap-xs z-10 relative mt-auto">
            <span className="font-display-lg text-[72px] leading-none font-extrabold text-primary tracking-tighter">
              ₱14,250.00
            </span>
            <div className="flex items-center gap-sm">
              <span className="px-sm py-xs bg-primary text-on-primary font-label-md text-label-md uppercase">
                +12% vs Yesterday
              </span>
            </div>
          </div>
          {/* Decorative geometric background element */}
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-surface-container-high rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700 ease-out"></div>
        </div>
        {/* Monthly Revenue */}
        <div className="col-span-1 md:col-span-4 bg-primary text-on-primary border border-primary p-lg flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-start">
            <span className="font-headline-md text-headline-md tracking-tight uppercase">Monthly Revenue</span>
            <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          </div>
          <div className="flex flex-col gap-xs mt-auto">
            <span className="font-headline-lg text-headline-lg font-bold">₱245,000.00</span>
            <div className="w-full bg-on-primary/20 h-1 mt-sm">
              <div className="bg-on-primary h-1 w-[75%]"></div>
            </div>
            <span className="font-label-md text-label-md text-on-primary/70 uppercase mt-xs tracking-widest">
              75% of Target
            </span>
          </div>
        </div>
        {/* Pending Payments & Inventory Value */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-md">
          {/* Pending Payments */}
          <div className="flex-1 bg-surface-container-lowest border border-outline-variant p-lg flex flex-col justify-between group hover:border-primary transition-colors cursor-pointer">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Pending Payments
              </span>
              <div className="w-8 h-8 rounded-full bg-error flex items-center justify-center">
                <span className="font-label-md text-label-md text-on-error">8</span>
              </div>
            </div>
            <div className="mt-md">
              <span className="font-headline-md text-headline-md text-primary">Requires Action</span>
            </div>
          </div>
          {/* Current Inventory Value */}
          <div className="flex-1 bg-surface-container-low border border-outline-variant p-lg flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                Est. Inventory Value
              </span>
              <span className="material-symbols-outlined text-on-surface-variant">inventory_2</span>
            </div>
            <div className="mt-md">
              <span className="font-headline-lg text-headline-lg text-primary">₱1.2M</span>
            </div>
          </div>
          {/* Fully Consumed Materials */}
          <div className="bg-surface-container-lowest border border-outline-variant p-lg flex justify-between items-center group hover:bg-primary hover:text-on-primary transition-colors duration-300">
            <span className="font-label-md text-label-md uppercase tracking-widest group-hover:text-on-primary">
              Fully Consumed
            </span>
            <span className="font-headline-md text-headline-md font-bold group-hover:text-on-primary">2</span>
          </div>
        </div>
        {/* Low Stock Materials Preview */}
        <div className="col-span-1 md:col-span-4 bg-surface border border-outline-variant flex flex-col">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <span className="font-headline-md text-headline-md uppercase tracking-tight">Low Stock</span>
            <span className="px-xs py-[2px] border border-primary text-primary font-label-md text-label-md uppercase">
              3 Items
            </span>
          </div>
          <div className="flex flex-col flex-1">
            {/* Item 1 */}
            <div className="flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 border border-outline-variant bg-surface-bright flex items-center justify-center">
                  <span className="font-label-md text-label-md">C</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-bold">Cyan Ink Tank</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Format: 5L</span>
                </div>
              </div>
              <span className="font-label-md text-label-md text-error">15%</span>
            </div>
            {/* Item 2 */}
            <div className="flex items-center justify-between p-md border-b border-outline-variant hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 border border-outline-variant bg-surface-bright flex items-center justify-center">
                  <span className="font-label-md text-label-md">M</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-bold">Magenta Ink Tank</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Format: 5L</span>
                </div>
              </div>
              <span className="font-label-md text-label-md text-error">18%</span>
            </div>
            {/* Item 3 */}
            <div className="flex items-center justify-between p-md hover:bg-surface-container-low transition-colors flex-1">
              <div className="flex items-center gap-md">
                <div className="w-10 h-10 border border-outline-variant bg-surface-bright flex items-center justify-center">
                  <span className="font-label-md text-label-md">P</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-bold">Glossy Paper A3</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Format: Ream</span>
                </div>
              </div>
              <span className="font-label-md text-label-md text-error">2 Reams</span>
            </div>
          </div>
        </div>
        {/* Recent Activity Feed */}
        <div className="col-span-1 md:col-span-4 bg-surface-container-lowest border border-outline-variant flex flex-col">
          <div className="p-lg border-b border-outline-variant">
            <span className="font-headline-md text-headline-md uppercase tracking-tight">Activity Log</span>
          </div>
          <div className="p-lg flex flex-col gap-lg relative">
            {/* Vertical Line */}
            <div className="absolute left-[39px] top-lg bottom-lg w-px bg-outline-variant"></div>
            {/* Event 1 */}
            <div className="flex gap-md relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary border-2 border-surface-container-lowest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] text-on-primary">add</span>
              </div>
              <div className="flex flex-col pt-xs">
                <span className="font-body-md text-body-md font-bold">Material Added</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Matte Canvas Roll 24"</span>
                <span className="font-label-md text-label-md text-on-surface-variant/60 mt-xs uppercase">10 mins ago</span>
              </div>
            </div>
            {/* Event 2 */}
            <div className="flex gap-md relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-surface-container-lowest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] text-primary">receipt_long</span>
              </div>
              <div className="flex flex-col pt-xs">
                <span className="font-body-md text-body-md font-bold">Sale Created</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Order #INV-4029 - ₱4,500</span>
                <span className="font-label-md text-label-md text-on-surface-variant/60 mt-xs uppercase">45 mins ago</span>
              </div>
            </div>
            {/* Event 3 */}
            <div className="flex gap-md relative z-10">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest border-2 border-surface-container-lowest flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              </div>
              <div className="flex flex-col pt-xs">
                <span className="font-body-md text-body-md font-bold">Payment Completed</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Order #INV-4022</span>
                <span className="font-label-md text-label-md text-on-surface-variant/60 mt-xs uppercase">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Sales Table */}
        <div className="col-span-1 md:col-span-12 bg-surface-container-lowest border border-outline-variant overflow-x-auto">
          <div className="p-lg border-b border-outline-variant flex justify-between items-center">
            <span className="font-headline-md text-headline-md uppercase tracking-tight">Recent Sales</span>
            <button className="font-label-md text-label-md text-primary uppercase tracking-widest border border-outline-variant px-md py-xs hover:bg-surface-container-low">
              View All
            </button>
          </div>
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-[120px]">Order ID</th>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Client</th>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Items</th>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Date</th>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Amount</th>
                <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md">
              <tr className="border-b border-outline-variant hover:bg-surface-container transition-colors group cursor-pointer">
                <td className="p-md font-bold">#INV-4029</td>
                <td className="p-md">Acme Corp</td>
                <td className="p-md text-on-surface-variant">500x Business Cards, 2x Posters</td>
                <td className="p-md text-on-surface-variant">Today, 14:30</td>
                <td className="p-md text-right font-bold">₱4,500.00</td>
                <td className="p-md text-right">
                  <span className="inline-block px-sm py-xs bg-primary text-on-primary font-label-md text-label-md uppercase">Paid</span>
                </td>
              </tr>
              <tr className="border-b border-outline-variant hover:bg-surface-container transition-colors group cursor-pointer">
                <td className="p-md font-bold">#INV-4028</td>
                <td className="p-md">Studio 42</td>
                <td className="p-md text-on-surface-variant">10x Fine Art Prints (A2)</td>
                <td className="p-md text-on-surface-variant">Today, 11:15</td>
                <td className="p-md text-right font-bold">₱8,200.00</td>
                <td className="p-md text-right">
                  <span className="inline-block px-sm py-xs border border-outline-variant text-on-surface font-label-md text-label-md uppercase">Pending</span>
                </td>
              </tr>
              <tr className="border-b border-outline-variant hover:bg-surface-container transition-colors group cursor-pointer">
                <td className="p-md font-bold">#INV-4027</td>
                <td className="p-md">Local Gallery</td>
                <td className="p-md text-on-surface-variant">Custom Canvas Wrap (36x48)</td>
                <td className="p-md text-on-surface-variant">Yesterday</td>
                <td className="p-md text-right font-bold">₱12,000.00</td>
                <td className="p-md text-right">
                  <span className="inline-block px-sm py-xs bg-primary text-on-primary font-label-md text-label-md uppercase">Paid</span>
                </td>
              </tr>
              <tr className="border-b border-outline-variant hover:bg-surface-container transition-colors group cursor-pointer">
                <td className="p-md font-bold">#INV-4026</td>
                <td className="p-md">Tech Startup Inc.</td>
                <td className="p-md text-on-surface-variant">1000x Flyers (A5)</td>
                <td className="p-md text-on-surface-variant">Yesterday</td>
                <td className="p-md text-right font-bold">₱3,500.00</td>
                <td className="p-md text-right">
                  <span className="inline-block px-sm py-xs border border-outline-variant text-on-surface font-label-md text-label-md uppercase">Pending</span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container transition-colors group cursor-pointer">
                <td className="p-md font-bold">#INV-4025</td>
                <td className="p-md">Independent Artist</td>
                <td className="p-md text-on-surface-variant">50x Zine Copies</td>
                <td className="p-md text-on-surface-variant">Oct 24, 2023</td>
                <td className="p-md text-right font-bold">₱6,000.00</td>
                <td className="p-md text-right">
                  <span className="inline-block px-sm py-xs bg-primary text-on-primary font-label-md text-label-md uppercase">Paid</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

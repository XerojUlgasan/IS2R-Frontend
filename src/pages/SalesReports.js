import React from "react";

function SalesReports() {
  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-64px)] p-lg gap-lg font-body-md text-on-surface">
      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md pb-md border-b border-primary">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">Sales Analytics</h1>
          <p className="font-body-md text-on-surface-variant mt-xs">Revenue &amp; Profit Trajectory</p>
        </div>
        <div className="flex items-center border border-primary bg-surface p-xs gap-xs">
          <button className="px-md py-sm font-label-md uppercase tracking-widest text-on-primary bg-primary border border-primary transition-colors hover:bg-surface-container-low hover:text-primary">
            Daily
          </button>
          <button className="px-md py-sm font-label-md uppercase tracking-widest text-primary bg-surface border border-transparent transition-colors hover:border-primary">
            Weekly
          </button>
          <button className="px-md py-sm font-label-md uppercase tracking-widest text-primary bg-surface border border-transparent transition-colors hover:border-primary">
            Monthly
          </button>
          <button className="px-md py-sm font-label-md uppercase tracking-widest text-primary bg-surface border border-transparent transition-colors hover:border-primary">
            Yearly
          </button>
        </div>
      </div>
      {/* Bento Grid Main Content */}
      <div className="grid grid-cols-12 gap-lg flex-1">
        {/* Large Chart Cell */}
        <div className="col-span-12 lg:col-span-9 border border-primary bg-surface-bright flex flex-col p-lg relative group transition-colors hover:bg-surface-container-lowest">
          <div className="absolute top-lg left-lg">
            <span className="font-headline-md text-headline-md text-primary block">Revenue Timeline</span>
            <span className="font-label-md text-on-surface-variant uppercase tracking-widest mt-xs block">Last 30 Days</span>
          </div>
          <div className="flex-1 w-full h-full min-h-[400px] mt-xl pt-lg relative">
            {/* SVG Line Chart Mockup */}
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
              {/* Grid Lines */}
              <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50"></line>
              <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150"></line>
              <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1="250" y2="250"></line>
              {/* Data Line */}
              <path
                className="text-primary"
                d="M0,250 C100,220 200,280 300,200 C400,120 500,180 600,100 C700,20 800,80 900,40 L1000,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              ></path>
              {/* Data Points */}
              <circle className="text-surface-bright" cx="300" cy="200" fill="currentColor" r="4" stroke="currentColor" strokeWidth="2"></circle>
              <circle className="text-surface-bright" cx="600" cy="100" fill="currentColor" r="4" stroke="currentColor" strokeWidth="2"></circle>
              <circle className="text-surface-bright" cx="900" cy="40" fill="currentColor" r="4" stroke="currentColor" strokeWidth="2"></circle>
            </svg>
          </div>
        </div>
        {/* Stats Sidebar */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-lg">
          {/* Total Revenue Stat */}
          <div className="flex-1 border border-primary bg-primary text-on-primary p-lg flex flex-col justify-between group relative overflow-hidden transition-all hover:bg-surface-bright hover:text-primary hover:border-primary">
            <span className="font-label-md uppercase tracking-widest border-b border-on-primary/30 pb-xs group-hover:border-primary/30">
              Total Revenue
            </span>
            <div className="mt-xl">
              <span className="font-display-lg text-display-lg block group-hover:scale-105 transition-transform origin-left">$142.5K</span>
              <div className="flex items-center gap-xs mt-sm text-surface-container-lowest group-hover:text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                <span className="font-body-sm">12.4% vs last period</span>
              </div>
            </div>
          </div>
          {/* Estimated Profit Stat */}
          <div className="flex-1 border border-primary bg-surface-bright p-lg flex flex-col justify-between group relative overflow-hidden transition-all hover:border-primary hover:bg-surface-container">
            <span className="font-label-md text-on-surface-variant uppercase tracking-widest border-b border-primary/30 pb-xs group-hover:text-primary">
              Estimated Profit
            </span>
            <div className="mt-xl">
              <span className="font-display-lg text-display-lg text-primary block group-hover:-translate-y-1 transition-transform">$38.2K</span>
              <div className="flex items-center gap-xs mt-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span className="font-body-sm">Margin: 26.8%</span>
              </div>
            </div>
          </div>
          {/* Action Button */}
          <button className="w-full p-md border border-primary bg-surface-bright font-label-md uppercase tracking-widest text-primary flex items-center justify-between group hover:bg-primary hover:text-on-primary transition-colors">
            <span>Export Report</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">download</span>
          </button>
        </div>
      </div>
      {/* Bottom Data Table */}
      <div className="mt-md border border-primary bg-surface-bright">
        <div className="p-md border-b border-primary bg-surface-container-low flex justify-between items-center">
          <span className="font-headline-md text-body-lg text-primary">Top Performing Segments</span>
          <span className="material-symbols-outlined text-primary cursor-pointer hover:rotate-90 transition-transform">more_horiz</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-primary/30 bg-surface">
                <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider w-1/3">Category</th>
                <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Volume</th>
                <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Revenue</th>
                <th className="p-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Growth</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-primary/10 hover:bg-surface-container-lowest transition-colors group">
                <td className="p-md font-body-md font-bold text-primary flex items-center gap-sm">
                  <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform"></div>
                  Large Format Print
                </td>
                <td className="p-md font-body-sm text-on-surface-variant text-right">1,204 units</td>
                <td className="p-md font-body-md text-primary text-right">$64,200</td>
                <td className="p-md font-label-md text-primary text-right">+8.2%</td>
              </tr>
              <tr className="border-b border-primary/10 hover:bg-surface-container-lowest transition-colors group">
                <td className="p-md font-body-md font-bold text-primary flex items-center gap-sm">
                  <div className="w-2 h-2 bg-primary/60 rounded-full group-hover:scale-150 transition-transform"></div>
                  Commercial Binding
                </td>
                <td className="p-md font-body-sm text-on-surface-variant text-right">850 units</td>
                <td className="p-md font-body-md text-primary text-right">$42,800</td>
                <td className="p-md font-label-md text-primary text-right">+3.1%</td>
              </tr>
              <tr className="hover:bg-surface-container-lowest transition-colors group">
                <td className="p-md font-body-md font-bold text-primary flex items-center gap-sm">
                  <div className="w-2 h-2 bg-primary/30 rounded-full group-hover:scale-150 transition-transform"></div>
                  Digital Short-Run
                </td>
                <td className="p-md font-body-sm text-on-surface-variant text-right">3,420 units</td>
                <td className="p-md font-body-md text-primary text-right">$35,500</td>
                <td className="p-md font-label-md text-primary text-right">-1.4%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SalesReports;

import React from "react";

function Materials() {
  return (
    <div className="flex flex-col w-full h-full gap-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-md">
        <div className="flex flex-col">
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tighter">Materials Inventory</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-xs">
            Manage raw printing materials, monitor stock levels, and track manufacturing costs across your active catalog.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-md w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              className="w-full h-10 pl-xl pr-sm bg-surface border border-outline font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-none placeholder:text-on-surface-variant"
              placeholder="Search materials..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-sm shrink-0">
            <button className="h-10 px-md flex items-center justify-center gap-sm border border-outline bg-surface text-on-surface hover:bg-surface-container-highest transition-colors font-label-md text-label-md uppercase tracking-widest whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
            <button className="h-10 px-md flex items-center justify-center gap-sm bg-primary text-on-primary hover:bg-primary/90 transition-colors font-label-md text-label-md uppercase tracking-widest whitespace-nowrap border-none">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Material
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-sm mb-lg border-b border-outline overflow-x-auto pb-px">
        <button className="px-md py-sm border-b-2 border-primary font-label-md text-label-md text-primary uppercase tracking-widest whitespace-nowrap">
          All Materials (124)
        </button>
        <button className="px-md py-sm border-b-2 border-transparent hover:border-outline text-on-surface-variant font-label-md text-label-md uppercase tracking-widest whitespace-nowrap transition-colors">
          Low Stock (8)
        </button>
        <button className="px-md py-sm border-b-2 border-transparent hover:border-outline text-on-surface-variant font-label-md text-label-md uppercase tracking-widest whitespace-nowrap transition-colors">
          Consumed (12)
        </button>
      </div>
      <div className="w-full overflow-x-auto border border-outline bg-surface-container-lowest">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline">
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-12"></th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-1/4">Name</th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Type (Size/PCS)</th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Unit</th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Quantity</th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Mfg Price (₱)</th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Status</th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Last Stocked</th>
              <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline">
            <tr className="hover:bg-surface-container transition-colors group cursor-pointer border-b border-outline">
              <td className="py-md px-md">
                <input className="w-4 h-4 border-outline rounded-none text-primary focus:ring-primary bg-surface-container-lowest" type="checkbox" />
              </td>
              <td className="py-md px-md">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 bg-surface-container flex items-center justify-center border border-outline shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">layers</span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface font-bold">Premium Matte Canvas Roll</span>
                </div>
              </td>
              <td className="py-md px-md font-body-sm text-body-sm text-on-surface">Roll (44" x 40ft)</td>
              <td className="py-md px-md font-body-sm text-body-sm text-on-surface text-right">Roll</td>
              <td className="py-md px-md font-body-md text-body-md text-on-surface font-bold text-right">12</td>
              <td className="py-md px-md font-body-md text-body-md text-on-surface font-mono text-right">4,250.00</td>
              <td className="py-md px-md">
                <span className="inline-flex items-center px-sm py-xs bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest">Active</span>
              </td>
              <td className="py-md px-md font-body-sm text-body-sm text-on-surface-variant">Oct 12, 2023</td>
              <td className="py-md px-md text-right">
                <div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-xs hover:bg-surface-container-highest transition-colors text-on-surface-variant" title="Replenish Stock">
                    <span className="material-symbols-outlined text-[18px]">add_box</span>
                  </button>
                  <button className="p-xs hover:bg-surface-container-highest transition-colors text-on-surface-variant" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-surface-container transition-colors group cursor-pointer border-b border-outline">
              <td className="py-md px-md">
                <input className="w-4 h-4 border-outline rounded-none text-primary focus:ring-primary bg-surface-container-lowest" type="checkbox" />
              </td>
              <td className="py-md px-md">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 bg-surface-container flex items-center justify-center border border-outline shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">water_drop</span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface font-bold">UltraChrome Pro10 Ink - Cyan</span>
                </div>
              </td>
              <td className="py-md px-md font-body-sm text-body-sm text-on-surface">Cartridge (200ml)</td>
              <td className="py-md px-md font-body-sm text-body-sm text-on-surface text-right">PCS</td>
              <td className="py-md px-md font-body-md text-body-md text-on-surface font-bold text-right text-error">2</td>
              <td className="py-md px-md font-body-md text-body-md text-on-surface font-mono text-right">3,100.00</td>
              <td className="py-md px-md">
                <span className="inline-flex items-center px-sm py-xs border border-outline text-on-surface font-label-md text-label-md uppercase tracking-widest">Active</span>
              </td>
              <td className="py-md px-md font-body-sm text-body-sm text-on-surface-variant">Sep 28, 2023</td>
              <td className="py-md px-md text-right">
                <div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-xs hover:bg-surface-container-highest transition-colors text-on-surface-variant" title="Replenish Stock">
                    <span className="material-symbols-outlined text-[18px]">add_box</span>
                  </button>
                  <button className="p-xs hover:bg-surface-container-highest transition-colors text-on-surface-variant" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-surface-container transition-colors group cursor-pointer border-b border-outline">
              <td className="py-md px-md">
                <input className="w-4 h-4 border-outline rounded-none text-primary focus:ring-primary bg-surface-container-lowest" type="checkbox" />
              </td>
              <td className="py-md px-md">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 bg-surface-container flex items-center justify-center border border-outline shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-[20px]">sticky_note_2</span>
                  </div>
                  <span className="font-body-md text-body-md text-on-surface font-bold opacity-50">Vinyl Sticker Paper (Glossy)</span>
                </div>
              </td>
              <td className="py-md px-md font-body-sm text-body-sm text-on-surface opacity-50">Sheet (A3+ / 50pcs)</td>
              <td className="py-md px-md font-body-sm text-body-sm text-on-surface text-right opacity-50">Pack</td>
              <td className="py-md px-md font-body-md text-body-md text-on-surface font-bold text-right opacity-50">0</td>
              <td className="py-md px-md font-body-md text-body-md text-on-surface font-mono text-right opacity-50">850.00</td>
              <td className="py-md px-md">
                <span className="inline-flex items-center px-sm py-xs border border-outline-variant bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase tracking-widest">Consumed</span>
              </td>
              <td className="py-md px-md font-body-sm text-body-sm text-on-surface-variant opacity-50">Aug 15, 2023</td>
              <td className="py-md px-md text-right">
                <div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-xs hover:bg-surface-container-highest transition-colors text-on-surface-variant" title="Replenish Stock">
                    <span className="material-symbols-outlined text-[18px]">add_box</span>
                  </button>
                  <button className="p-xs hover:bg-surface-container-highest transition-colors text-on-surface-variant" title="Edit">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between py-md border-t border-outline">
        <p className="font-body-sm text-body-sm text-on-surface-variant">Showing 1-3 of 124 materials</p>
        <div className="flex gap-xs">
          <button
            className="w-8 h-8 flex items-center justify-center border border-outline hover:bg-surface-container text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-outline bg-primary text-on-primary font-body-sm">1</button>
          <button className="w-8 h-8 flex items-center justify-center border border-outline hover:bg-surface-container text-on-surface font-body-sm">2</button>
          <button className="w-8 h-8 flex items-center justify-center border border-outline hover:bg-surface-container text-on-surface font-body-sm">3</button>
          <button className="w-8 h-8 flex items-center justify-center border border-outline hover:bg-surface-container text-on-surface">
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
      {/* Example Empty State (Hidden by default, shown here for completeness) */}
      <div className="hidden flex-col items-center justify-center py-xl px-lg border border-outline bg-surface-container-lowest text-center my-lg">
        <div className="w-16 h-16 bg-surface-container rounded-none flex items-center justify-center border border-outline mb-md">
          <span className="material-symbols-outlined text-[32px] text-on-surface-variant">inventory_2</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-primary mb-sm">No Materials Yet</h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-lg max-w-md">
          Your inventory is currently empty. Add your first material to start tracking stock levels and manufacturing costs.
        </p>
        <button className="h-12 px-lg flex items-center justify-center gap-sm bg-primary text-on-primary hover:bg-primary/90 transition-colors font-label-md text-label-md uppercase tracking-widest border-none">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Your First Material
        </button>
      </div>
    </div>
  );
}

export default Materials;

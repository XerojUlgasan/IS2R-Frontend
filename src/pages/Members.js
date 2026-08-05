import React from "react";

function Members() {
  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-64px)] relative">
      <div className="flex justify-between items-end mb-lg relative z-10">
        <div className="flex flex-col gap-xs">
          <span className="font-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-sm">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            Administration
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight relative inline-block group">
            Team Members
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-xs">
            Manage access control, roles, and administrative privileges for the IS²R system.
          </p>
        </div>
        <button className="group flex items-center gap-sm bg-primary text-on-primary px-lg py-sm font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-lowest hover:text-primary border border-primary transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden">
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Invite User
        </button>
      </div>
      <div className="grid grid-cols-12 gap-lg mb-lg">
        <div className="col-span-12 md:col-span-4 bg-surface-container border border-surface-variant p-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-md">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Active Users</span>
            <span className="material-symbols-outlined text-primary">groups</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface flex items-baseline gap-sm">
            12 <span className="font-body-sm text-body-sm text-on-surface-variant">/ 50 seats</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-surface-container border border-surface-variant p-lg relative overflow-hidden group">
          <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-md">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Pending Invites</span>
            <span className="material-symbols-outlined text-primary">mail</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">3</div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-surface-container border border-surface-variant p-lg relative overflow-hidden group">
          <div className="absolute right-10 bottom-10 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-md">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">System Health</span>
            <span className="material-symbols-outlined text-primary">monitoring</span>
          </div>
          <div className="flex items-center gap-sm mt-md">
            <div className="flex-1 h-1 bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-primary w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
            </div>
            <span className="font-label-md text-label-md text-primary uppercase">Optimal</span>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-surface-container border border-surface-variant flex flex-col relative z-10 shadow-lg">
        <div className="px-lg py-md border-b border-surface-variant flex items-center justify-between bg-surface-bright/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                className="pl-10 pr-4 py-2 bg-background border border-surface-variant text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all"
                placeholder="Search members..."
                type="text"
              />
            </div>
            <div className="h-6 w-px bg-surface-variant"></div>
            <div className="flex gap-sm">
              <button className="px-sm py-1 font-label-md text-label-md text-on-surface bg-surface-variant uppercase tracking-wider">All</button>
              <button className="px-sm py-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 uppercase tracking-wider transition-colors">Owners</button>
              <button className="px-sm py-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 uppercase tracking-wider transition-colors">Staff</button>
            </div>
          </div>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">filter_list</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-variant">
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-1/4">User</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-1/4">Contact</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-1/6">Role</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-1/6">Joined</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right w-1/12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              <tr className="group hover:bg-surface-bright/50 transition-colors">
                <td className="px-lg py-md">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center font-headline-md text-headline-md text-on-primary">A</div>
                    <div>
                      <div className="font-body-md text-body-md text-on-surface font-medium">Alex Miller</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">System Administrator</div>
                    </div>
                  </div>
                </td>
                <td className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant font-mono">alex@monolith.print</td>
                <td className="px-lg py-md">
                  <span className="inline-flex items-center px-2 py-1 bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider">Owner</span>
                </td>
                <td className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">Oct 12, 2023</td>
                <td className="px-lg py-md text-right">
                  <div className="flex justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors" title="Change Role">
                      <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="group hover:bg-surface-bright/50 transition-colors">
                <td className="px-lg py-md">
                  <div className="flex items-center gap-md">
                    <img
                      className="w-10 h-10 object-cover grayscale border border-surface-variant"
                      alt="Sarah Jenkins"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK_xMg2vsv_Ln98sfDyZstV11W2sOgcM4b45XcvSI0KEAqmlK2v_Sp5bmEf4arOcNyZFnVQ0BM3kIjf1NYja9ldo1an7re8izVEsTSCBEas_zWzghRki1bSJ91PTsTFPpd---DaXsOkkiowzgfSpxZ6J0_o3V7XMojPQ1xURM2ajD6V5tJR44fMvVZ7Zbz54E_Of1nP5teCIdV9ewwPYtFTp4s7jXur5KAPa9VntcRabBaHuchFevm"
                    />
                    <div>
                      <div className="font-body-md text-body-md text-on-surface font-medium">Sarah Jenkins</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Press Operator</div>
                    </div>
                  </div>
                </td>
                <td className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant font-mono">s.jenkins@monolith.print</td>
                <td className="px-lg py-md">
                  <span className="inline-flex items-center px-2 py-1 bg-surface-container-lowest border border-surface-variant text-on-surface font-label-md text-label-md uppercase tracking-wider">Staff</span>
                </td>
                <td className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">Nov 04, 2023</td>
                <td className="px-lg py-md text-right">
                  <div className="flex justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors" title="Change Role">
                      <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                    </button>
                    <button className="p-1 hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" title="Remove Member">
                      <span className="material-symbols-outlined text-[20px]">person_remove</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="group hover:bg-surface-bright/50 transition-colors">
                <td className="px-lg py-md">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 bg-surface-variant border border-outline-variant flex items-center justify-center font-headline-md text-headline-md text-on-surface">M</div>
                    <div>
                      <div className="font-body-md text-body-md text-on-surface font-medium">Marcus Chen</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Quality Control</div>
                    </div>
                  </div>
                </td>
                <td className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant font-mono">m.chen@monolith.print</td>
                <td className="px-lg py-md">
                  <span className="inline-flex items-center px-2 py-1 bg-surface-container-lowest border border-surface-variant text-on-surface font-label-md text-label-md uppercase tracking-wider">Staff</span>
                </td>
                <td className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">Jan 15, 2024</td>
                <td className="px-lg py-md text-right">
                  <div className="flex justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors" title="Change Role">
                      <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                    </button>
                    <button className="p-1 hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" title="Remove Member">
                      <span className="material-symbols-outlined text-[20px]">person_remove</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="group hover:bg-surface-bright/50 transition-colors">
                <td className="px-lg py-md">
                  <div className="flex items-center gap-md">
                    <img
                      className="w-10 h-10 object-cover grayscale border border-surface-variant"
                      alt="David Ross"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFvQZhNgnlqmlAFjivRrSMsdRzYPhOdQKjoCndovJV3NUQdzhlRci4mcFkcU8jtHK_4Zztzgz4I7OapNkgbSepd3IfLE1TwABSRDntU1SQ7yWEz5houD1Gg9_7IRuhNLTluSTnkxf301TjavF98948l8IR5QOoB9wviq-127G75zCVVxNNVKA6WsUwnfYmXcxwfwWDCedvd9a2iDCQmOZNjdwXrsnSFp9PI_uKA6sapxDZfEcHqxyN"
                    />
                    <div>
                      <div className="font-body-md text-body-md text-on-surface font-medium">David Ross</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Investor Relations</div>
                    </div>
                  </div>
                </td>
                <td className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant font-mono">d.ross@invest.group</td>
                <td className="px-lg py-md">
                  <span className="inline-flex items-center px-2 py-1 bg-surface-container-lowest border border-outline text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">Shareholder</span>
                </td>
                <td className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">Feb 02, 2024</td>
                <td className="px-lg py-md text-right">
                  <div className="flex justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors" title="Change Role">
                      <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                    </button>
                    <button className="p-1 hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" title="Remove Member">
                      <span className="material-symbols-outlined text-[20px]">person_remove</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Empty State Example (Hidden by default, shown for illustration) */}
        <div className="hidden flex-1 flex-col items-center justify-center p-xl text-center bg-surface-container-low border-t border-surface-variant">
          <div className="w-24 h-24 mb-lg relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
            <div className="absolute inset-2 bg-surface-variant rounded-full flex items-center justify-center border border-outline-variant">
              <span className="material-symbols-outlined text-[40px] text-on-surface-variant">group_off</span>
            </div>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">No members found</h3>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-lg">
            Try adjusting your filters or invite new team members to collaborate.
          </p>
          <button className="bg-primary text-on-primary px-lg py-md font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-lowest hover:text-primary border border-primary transition-colors shadow-sm">
            Clear Filters
          </button>
        </div>
        <div className="p-md border-t border-surface-variant bg-surface-bright flex items-center justify-between mt-auto">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Showing 4 of 12 users</span>
          <div className="flex gap-xs">
            <button className="w-8 h-8 flex items-center justify-center border border-surface-variant text-on-surface-variant hover:bg-surface-variant transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-primary bg-primary text-on-primary font-label-md text-label-md">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-surface-variant text-on-surface hover:bg-surface-variant transition-colors font-label-md text-label-md">2</button>
            <button className="w-8 h-8 flex items-center justify-center border border-surface-variant text-on-surface hover:bg-surface-variant transition-colors font-label-md text-label-md">3</button>
            <button className="w-8 h-8 flex items-center justify-center border border-surface-variant text-on-surface hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
      {/* Decorative background elements */}
      <div className="fixed top-20 right-10 w-[40vw] h-[40vw] bg-gradient-to-br from-surface-variant/20 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-multiply"></div>
      <div className="fixed bottom-0 left-72 w-full h-1/3 bg-gradient-to-t from-background to-transparent -z-10 pointer-events-none"></div>
    </div>
  );
}

export default Members;

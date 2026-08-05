import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AppLayout() {
  return (
    <div className="bg-background font-body-md text-on-surface">
      <Sidebar />
      <div className="pl-72 w-full min-h-screen flex flex-col">
        <header className="sticky top-0 h-16 bg-background/80 backdrop-blur-md z-40 border-b border-outline-variant flex items-center justify-between px-xl">
          <div className="flex items-center gap-md text-on-surface-variant italic font-body-sm uppercase tracking-widest">
            SYSTEM_ROOT // TERMINAL_ACTIVE
          </div>
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-sm px-md py-xs border border-outline-variant bg-surface-container-lowest">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
              <span className="text-label-md text-on-surface-variant uppercase tracking-tighter">Cmd + K</span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">notifications</span>
          </div>
        </header>
        <main className="flex-1 bg-background p-xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;

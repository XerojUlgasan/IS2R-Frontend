import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="min-h-screen flex flex-col transition-all duration-300 md:pl-72">
        <header className="sticky top-0 h-16 bg-background/80 backdrop-blur-md z-40 border-b border-outline-variant flex items-center justify-between px-4 sm:px-6 lg:px-xl">
          <div className="flex items-center gap-sm text-on-surface-variant italic font-body-sm uppercase tracking-widest">
            <button
              type="button"
              aria-label="Open navigation"
              className="md:hidden flex h-11 w-11 items-center justify-center border border-outline-variant bg-surface-container-lowest text-on-surface-variant"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
            <span className="hidden sm:inline">{/* Developed By: Xeroj */}</span>
          </div>
          <div className="flex items-center gap-sm sm:gap-lg">
            <div className="hidden sm:flex items-center gap-sm px-md py-xs border border-outline-variant bg-surface-container-lowest min-h-[44px]">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
              <span className="text-label-md text-on-surface-variant uppercase tracking-tighter">Cmd + K</span>
            </div>
            <span className="flex h-11 w-11 items-center justify-center material-symbols-outlined text-on-surface-variant cursor-pointer">
              notifications
            </span>
          </div>
        </header>
        <main className="flex-1 bg-background p-4 sm:p-6 lg:p-xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;

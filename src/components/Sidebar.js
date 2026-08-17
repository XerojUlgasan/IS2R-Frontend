import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { getCurrentUser } from "../api/user.api";

// Navigation groups mirror the original design's sidebar structure exactly.
const NAV_GROUPS = [
  {
    label: null,
    items: [{ to: "/dashboard", icon: "dashboard", text: "Dashboard" }],
  },
  {
    label: "Insights",
    items: [
      { to: "/sales-calendar", icon: "calendar_month", text: "Sales Calendar" },
      { to: "/sales-reports", icon: "bar_chart", text: "Sales Reports" },
      { to: "/inventory-reports", icon: "monitoring", text: "Inventory Reports" },
    ],
  },
  {
    label: "Inventory",
    items: [
      { to: "/inventory-materials", icon: "inventory_2", text: "Materials" },
      { to: "/inventory-stocks", icon: "package_2", text: "Stocks" },
    ],
  },
  {
    label: "Finance",
    items: [
      { to: "/sales-history", icon: "history", text: "Sales History" },
      { to: "/expenses", icon: "payments", text: "Expenses" },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/members", icon: "group", text: "Members" },
      { to: "/audit-logs", icon: "receipt_long", text: "Audit Logs" },
      { to: "/business-settings", icon: "settings", text: "Business Settings" },
    ],
  },
];

const ACTIVE_CLASSES = "bg-primary text-on-primary";
const INACTIVE_CLASSES = "hover:bg-surface-container-highest";

function Sidebar({ isOpen = true, onClose }) {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessName = activeBusiness?.name || "No workspace selected";
  const role = activeBusiness?.role || "";

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then((u) => setFullName(u.user_metadata?.full_name || u.email || ""))
      .catch(() => {});
  }, []);

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col border-r border-outline-variant bg-surface-container transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col gap-sm border-b border-outline-variant bg-surface-bright p-lg">
        <div className="flex items-center gap-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-primary">
            {activeBusiness?.logo_img_loc ? (
              <img
                className="h-full w-full object-cover"
                alt={`${businessName} logo`}
                src={activeBusiness.logo_img_loc}
              />
            ) : (
              <span className="material-symbols-outlined text-on-primary">token</span>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="truncate font-headline-md text-label-md uppercase tracking-widest text-primary">IS²R</h1>
            <p className="truncate font-body-sm text-on-surface-variant">{businessName}</p>
          </div>
          <div className="flex items-center gap-sm">
            <button
              type="button"
              aria-label="Close navigation"
              className="flex h-11 w-11 items-center justify-center border border-outline-variant bg-surface-container-lowest text-on-surface-variant md:hidden"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <Link to="/my-businesses" title="Switch business" onClick={onClose}>
              <span className="material-symbols-outlined cursor-pointer text-on-surface-variant">unfold_more</span>
            </Link>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-lg px-md flex flex-col gap-xs">
        {NAV_GROUPS.map((group, gi) => (
          <React.Fragment key={gi}>
            {group.label && (
              <div className="mt-md mb-xs px-md font-label-md text-on-tertiary-fixed-variant uppercase tracking-tighter">
                {group.label}
              </div>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex min-h-[44px] items-center gap-md px-md py-sm transition-colors ${
                    isActive ? ACTIVE_CLASSES : INACTIVE_CLASSES
                  }`
                }
                aria-current={undefined}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-body-md">{item.text}</span>
              </NavLink>
            ))}
          </React.Fragment>
        ))}
      </nav>
      <div className="mt-auto border-t border-outline-variant bg-surface-container-low p-lg">
        <div className="flex items-center gap-md">
          <button
            type="button"
            title="Personal settings"
            onClick={() => { navigate("/personal-settings"); onClose?.(); }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px] text-on-primary">person</span>
          </button>
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-body-sm font-bold text-on-surface">{fullName || "—"}</p>
            <p className="truncate font-label-md text-on-surface-variant capitalize">{role || "—"}</p>
          </div>
          <Link to="/login" title="Log out" onClick={onClose}>
            <span className="material-symbols-outlined text-on-surface-variant">logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

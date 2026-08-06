import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";

// Navigation groups mirror the original design's sidebar structure exactly.
const NAV_GROUPS = [
  {
    label: null,
    items: [{ to: "/dashboard", icon: "dashboard", text: "Dashboard" }],
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
      { to: "/pending-payments", icon: "payments", text: "Pending Payments" },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/sales-reports", icon: "bar_chart", text: "Sales Reports" },
      { to: "/inventory-reports", icon: "monitoring", text: "Inventory Reports" },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/members", icon: "group", text: "Members" },
      { to: "/invitations", icon: "mail", text: "Invitations" },
      { to: "/audit-logs", icon: "receipt_long", text: "Audit Logs" },
      { to: "/business-settings", icon: "settings", text: "Business Settings" },
    ],
  },
];

const ACTIVE_CLASSES = "bg-primary text-on-primary";
const INACTIVE_CLASSES = "hover:bg-surface-container-highest";

function Sidebar() {
  const { activeBusiness } = useActiveBusiness();
  const businessName = activeBusiness?.name || "No workspace selected";

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container border-r border-outline-variant flex flex-col z-50 transition-all duration-300">
      <div className="p-lg flex flex-col gap-sm border-b border-outline-variant bg-surface-bright">
        <div className="flex items-center gap-md">
          <div className="w-10 h-10 bg-primary flex items-center justify-center overflow-hidden shrink-0">
            {activeBusiness?.logo_img_loc ? (
              <img
                className="w-full h-full object-cover"
                alt={`${businessName} logo`}
                src={activeBusiness.logo_img_loc}
              />
            ) : (
              <span className="material-symbols-outlined text-on-primary">token</span>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="font-headline-md text-label-md uppercase tracking-widest text-primary truncate">IS²R</h1>
            <p className="font-body-sm text-on-surface-variant truncate">{businessName}</p>
          </div>
          <Link to="/my-businesses" title="Switch business">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">unfold_more</span>
          </Link>
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
                className={({ isActive }) =>
                  `group flex items-center gap-md px-md py-sm transition-colors ${
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
      <div className="mt-auto border-t border-outline-variant p-lg bg-surface-container-low">
        <div className="flex items-center gap-md">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-body-sm font-bold text-on-surface truncate">Alex Miller</p>
            <p className="font-label-md text-on-surface-variant truncate">Admin</p>
          </div>
          <Link to="/login" title="Log out">
            <span className="material-symbols-outlined text-on-surface-variant">logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

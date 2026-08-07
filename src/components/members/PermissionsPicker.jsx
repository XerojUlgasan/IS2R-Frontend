import React from "react";
import { PERMISSION_GROUPS } from "../../constants/memberPermissions";

// Grouped allowed-action checkboxes (Materials / Stocks / Sales / Members).
// Controlled: `value` is an array of enabled permission keys; `onChange` gets
// the next array. Shared by the Configure and Invite member modals.
function PermissionsPicker({ value, onChange }) {
  const selected = new Set(value);

  const toggle = (key) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onChange(Array.from(next));
  };

  const toggleGroup = (group, enable) => {
    const next = new Set(selected);
    group.permissions.forEach((p) => (enable ? next.add(p.key) : next.delete(p.key)));
    onChange(Array.from(next));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      {PERMISSION_GROUPS.map((group) => {
        const allOn = group.permissions.every((p) => selected.has(p.key));
        return (
          <div key={group.label} className="border border-outline-variant bg-surface-container flex flex-col">
            <div className="flex items-center justify-between px-md py-sm border-b border-outline-variant bg-surface-container-low">
              <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface">{group.label}</span>
              <button
                type="button"
                onClick={() => toggleGroup(group, !allOn)}
                className="font-label-md text-[10px] uppercase tracking-widest text-primary hover:underline"
              >
                {allOn ? "Clear" : "Select all"}
              </button>
            </div>
            <div className="flex flex-col p-md gap-sm">
              {group.permissions.map((perm) => (
                <label key={perm.key} className="flex items-center gap-sm cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-none border-outline text-primary focus:ring-primary bg-surface-container-lowest"
                    checked={selected.has(perm.key)}
                    onChange={() => toggle(perm.key)}
                  />
                  <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                    {perm.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PermissionsPicker;

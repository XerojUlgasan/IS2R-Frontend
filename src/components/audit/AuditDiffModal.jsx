import React from "react";

// Collects all keys from both objects.
function allKeys(prev, next) {
  return [...new Set([...Object.keys(prev || {}), ...Object.keys(next || {})])];
}

function formatVal(v) {
  if (v === null || v === undefined) return <span className="text-surface-tint italic">null</span>;
  if (typeof v === "object") return <span className="font-mono text-[11px]">{JSON.stringify(v)}</span>;
  return <span className="font-mono text-[11px]">{String(v)}</span>;
}

function DiffRow({ label, prev, next, isDelete }) {
  const changed = !isDelete && JSON.stringify(prev) !== JSON.stringify(next);
  const removed = isDelete;

  const rowBg = removed
    ? "bg-error-container/30"
    : changed
    ? "bg-tertiary-container/20"
    : "";

  return (
    <tr className={`border-b border-outline-variant/40 ${rowBg}`}>
      <td className="px-sm py-xs font-label-md text-label-md text-on-surface-variant uppercase tracking-wide w-[30%] align-top">
        {label}
      </td>
      <td className={`px-sm py-xs align-top w-[35%] ${removed || changed ? "text-error" : "text-on-surface"}`}>
        {formatVal(prev)}
      </td>
      {!isDelete && (
        <td className={`px-sm py-xs align-top w-[35%] ${changed ? "text-tertiary" : "text-on-surface"}`}>
          {formatVal(next)}
        </td>
      )}
    </tr>
  );
}

function AuditDiffModal({ log, onClose }) {
  const prev = log.previous_object || {};
  const next = log.new_object;
  const isDelete = next === null || next === undefined;
  const keys = allKeys(prev, next);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-sm sm:p-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface-container-lowest border-2 border-primary flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-md border-b border-primary">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary uppercase tracking-tight">
              Object Diff
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              {log.description || "—"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
            type="button"
          >
            close
          </button>
        </div>

        {/* Column headers */}
        <div className={`grid text-[10px] font-label-md uppercase tracking-widest text-on-surface-variant px-sm py-xs bg-surface-container border-b border-outline-variant ${isDelete ? "grid-cols-2" : "grid-cols-3"}`}>
          <span className="w-[30%]">Field</span>
          <span className={isDelete ? "" : "w-[35%]"}>
            {isDelete ? "Deleted Object" : "Before"}
          </span>
          {!isDelete && <span>After</span>}
        </div>

        {/* Rows */}
        <div className="overflow-y-auto flex-1">
          {keys.length === 0 ? (
            <p className="p-md font-body-sm text-on-surface-variant">No data available.</p>
          ) : (
            <table className="w-full border-collapse">
              <tbody>
                {keys.map((k) => (
                  <DiffRow
                    key={k}
                    label={k}
                    prev={prev[k]}
                    next={isDelete ? undefined : next[k]}
                    isDelete={isDelete}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-md px-md py-sm border-t border-outline-variant bg-surface-container text-[10px] font-label-md text-on-surface-variant uppercase tracking-wide">
          {isDelete ? (
            <span className="flex items-center gap-xs">
              <span className="w-3 h-3 bg-error-container/60 border border-error inline-block" />
              Deleted
            </span>
          ) : (
            <>
              <span className="flex items-center gap-xs">
                <span className="w-3 h-3 bg-tertiary-container/40 border border-tertiary inline-block" />
                Changed
              </span>
              <span className="flex items-center gap-xs">
                <span className="w-3 h-3 bg-surface-container border border-outline-variant inline-block" />
                Unchanged
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditDiffModal;

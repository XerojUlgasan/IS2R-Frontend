import React, { useState, useRef, useEffect } from "react";
import { useMaterialSearch } from "../../hooks/useMaterialSearch";

// Searchable material picker. Types-to-search (debounced + cached) and, on
// selection, reports the chosen material so callers can store its id.
// Props:
//   businessId  - scope for the search
//   value       - selected material { id, name } | null
//   onChange    - (material | null) => void
//   placeholder - input placeholder
function MaterialSearchSelect({ businessId, value, onChange, placeholder = "Search materials..." }) {
  const { query, setQuery, results, loading, error } = useMaterialSearch(businessId);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (material) => {
    onChange(material);
    setQuery("");
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setOpen(true);
  };

  const fieldClass =
    "w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all";

  return (
    <div className="relative" ref={containerRef}>
      {/* Selected chip, or the search input */}
      {value ? (
        <div className="flex items-center justify-between bg-surface-container border border-primary p-md">
          <span className="font-body-md text-body-md text-on-surface truncate">{value.name || "Untitled material"}</span>
          <button
            type="button"
            onClick={handleClear}
            className="material-symbols-outlined text-[18px] text-on-surface-variant hover:text-error transition-colors"
            aria-label="Clear selection"
          >
            close
          </button>
        </div>
      ) : (
        <div className="relative">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            className={`${fieldClass} pl-xl`}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
        </div>
      )}

      {/* Results dropdown */}
      {open && !value && query.trim() && (
        <div className="absolute z-10 left-0 right-0 mt-xs bg-surface-container-lowest border border-primary max-h-56 overflow-y-auto">
          {loading && (
            <div className="flex items-center gap-sm p-md font-body-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
              Searching...
            </div>
          )}
          {!loading && error && (
            <div className="p-md font-body-sm text-body-sm text-error">Search failed. Try again.</div>
          )}
          {!loading && !error && results.length === 0 && (
            <div className="p-md font-body-sm text-body-sm text-on-surface-variant">No materials found.</div>
          )}
          {!loading &&
            !error &&
            results.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelect(m)}
                className="w-full text-left p-md font-body-sm text-body-sm text-on-surface hover:bg-surface-container-high border-b border-outline-variant last:border-b-0 flex items-center justify-between gap-md"
              >
                <span className="truncate font-bold">{m.name || "Untitled material"}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default MaterialSearchSelect;

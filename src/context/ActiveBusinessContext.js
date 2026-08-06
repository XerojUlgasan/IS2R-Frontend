import React, { createContext, useContext, useState, useCallback } from "react";

// Holds the currently selected business (id, name, logo, role) app-wide and
// persists it so a page refresh keeps the chosen workspace.
const ActiveBusinessContext = createContext(null);
const STORAGE_KEY = "active_business";

export function ActiveBusinessProvider({ children }) {
  const [activeBusiness, setActive] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Sets (or clears) the active business and mirrors it to localStorage.
  const setActiveBusiness = useCallback((business) => {
    setActive(business);
    if (business) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(business));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const clearActiveBusiness = useCallback(() => setActiveBusiness(null), [setActiveBusiness]);

  return (
    <ActiveBusinessContext.Provider value={{ activeBusiness, setActiveBusiness, clearActiveBusiness }}>
      {children}
    </ActiveBusinessContext.Provider>
  );
}

// Access the active business and its setters.
export function useActiveBusiness() {
  const ctx = useContext(ActiveBusinessContext);
  if (!ctx) {
    throw new Error("useActiveBusiness must be used within an ActiveBusinessProvider");
  }
  return ctx;
}

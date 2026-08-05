import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import AppLayout from "./components/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MyBusinesses from "./pages/MyBusinesses";
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import SalesHistory from "./pages/SalesHistory";
import SalesReports from "./pages/SalesReports";
import Members from "./pages/Members";
import AuditLogs from "./pages/AuditLogs";
import BusinessSettings from "./pages/BusinessSettings";
import ComingSoon from "./pages/ComingSoon";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / standalone pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-businesses" element={<MyBusinesses />} />

        {/* Authenticated app shell (sidebar + header) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory-materials" element={<Materials />} />
          <Route path="/sales-history" element={<SalesHistory />} />
          <Route path="/sales-reports" element={<SalesReports />} />
          <Route path="/members" element={<Members />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/business-settings" element={<BusinessSettings />} />
          <Route path="/pending-payments" element={<ComingSoon title="Pending Payments" />} />
          <Route path="/inventory-reports" element={<ComingSoon title="Inventory Reports" />} />
          <Route path="/invitations" element={<ComingSoon title="Invitations" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

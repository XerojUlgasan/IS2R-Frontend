import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinesses } from "../hooks/useBusinesses";
import BusinessList from "../components/BusinessList";
import CreateBusinessForm from "../components/CreateBusinessForm";

// Composes the workspace switcher: the business list plus the create-business flow.
function WorkspacesPage() {
  const navigate = useNavigate();
  const { businesses, loading, error, refetch, addBusiness } = useBusinesses();
  const [showCreate, setShowCreate] = useState(false);

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  // Missing/invalid auth on the initial load -> back to login.
  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  // Selecting a workspace sets the active business, then enters the app.
  const handleSelect = (business) => {
    localStorage.setItem("active_business_id", business.id);
    navigate("/dashboard");
  };

  // A freshly created business is prepended and becomes selectable immediately.
  const handleCreated = (business) => {
    addBusiness(business);
    setShowCreate(false);
  };

  return (
    <main className="w-full min-h-screen bg-surface flex items-center justify-center font-body-md">
      <div className="w-full max-w-5xl mx-auto flex flex-col p-lg gap-margin bg-background text-on-background min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col gap-xs mb-md">
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Select Business</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[80%]">
            Choose a workspace to continue or start a new operation.
          </p>
        </div>

        <BusinessList
          businesses={businesses}
          loading={loading}
          error={error}
          onRetry={refetch}
          onSelect={handleSelect}
          onCreate={() => setShowCreate(true)}
        />

        {/* Decorative Structural Element */}
        <div className="mt-auto pt-margin border-t border-outline-variant flex justify-between items-end opacity-50 select-none">
          <div className="font-label-md text-label-md text-on-surface-variant tracking-[0.2em] uppercase">SYS.IS²R.V1</div>
          <div className="flex gap-xs">
            <div className="w-[8px] h-[8px] bg-primary"></div>
            <div className="w-[8px] h-[8px] border border-primary"></div>
            <div className="w-[8px] h-[8px] border border-primary"></div>
          </div>
        </div>
      </div>

      {showCreate && (
        <CreateBusinessForm
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
          onUnauthorized={goToLogin}
        />
      )}
    </main>
  );
}

export default WorkspacesPage;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinesses } from "../hooks/useBusinesses";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import BusinessList from "../components/BusinessList";
import CreateBusinessForm from "../components/CreateBusinessForm";
import InvitationsModal from "../components/InvitationsModal";
import { acceptInvite, declineInvite } from "../api/business.api";

// Composes the workspace switcher: the business list plus the create-business flow.
function WorkspacesPage() {
  const navigate = useNavigate();
  const { businesses, loading, error, refetch, addBusiness, removeBusiness } = useBusinesses();
  const { setActiveBusiness } = useActiveBusiness();
  const [showCreate, setShowCreate] = useState(false);
  const [showInvitations, setShowInvitations] = useState(false);

  // Pending memberships are invitations (shown in the Invitations modal), not
  // selectable workspaces. Everything else stays in the business selection list.
  const invitations = businesses.filter((b) => b.status === "pending");
  const activeBusinesses = businesses.filter((b) => b.status !== "pending");

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  // Missing/invalid auth on the initial load -> back to login.
  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  // Selecting a workspace stores the chosen business (id, name, logo, role) for
  // use across the app, then enters the app.
  const handleSelect = (business) => {
    setActiveBusiness({
      id: business.id,
      name: business.name,
      logo_img_loc: business.logo_img_loc,
      role: business.role,
      actions: business.actions || [],
    });
    navigate("/dashboard");
  };

  // A freshly created business is prepended and becomes selectable immediately.
  const handleCreated = (business) => {
    addBusiness(business);
    setShowCreate(false);
  };

  // Accepting an invite joins the business, then routes straight into it using
  // the role returned by the backend. A 409 means "already accepted" — treat it
  // as success and enter anyway. Other errors bubble up to the row's UI.
  const handleAcceptInvite = async (invite) => {
    try {
      const result = await acceptInvite(invite.id);
      setActiveBusiness({
        id: invite.id,
        name: invite.name,
        logo_img_loc: invite.logo_img_loc,
        role: result?.membership?.role || invite.role,
        actions: result?.membership?.actions || invite.actions || [],
      });
      setShowInvitations(false);
      navigate("/dashboard");
    } catch (err) {
      if (err.status === 401) {
        goToLogin();
        return;
      }
      if (err.status === 409) {
        // Already a member — enter the business and refresh the list.
        setActiveBusiness({
          id: invite.id,
          name: invite.name,
          logo_img_loc: invite.logo_img_loc,
          role: invite.role,
          actions: invite.actions || [],
        });
        setShowInvitations(false);
        navigate("/dashboard");
        return;
      }
      throw err;
    }
  };

  // Declining removes the invitation from the list. Auth errors route to login;
  // other errors bubble up to the row's UI.
  const handleDeclineInvite = async (invite) => {
    try {
      await declineInvite(invite.id);
      removeBusiness(invite.id);
    } catch (err) {
      if (err.status === 401) {
        goToLogin();
        return;
      }
      throw err;
    }
  };

  return (
    <main className="w-full min-h-screen bg-surface flex items-center justify-center font-body-md">
      <div className="w-full max-w-5xl mx-auto flex flex-col p-lg gap-margin bg-background text-on-background min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col gap-xs mb-md">
          <div className="flex items-start justify-between gap-md">
            <div className="flex flex-col gap-xs">
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Select Business</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[80%]">
                Choose a workspace to continue or start a new operation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowInvitations(true)}
              className="relative shrink-0 border-2 border-primary p-sm text-primary hover:bg-primary hover:text-on-primary transition-colors"
              aria-label={`Open invitations${invitations.length ? ` (${invitations.length} pending)` : ""}`}
              title="Invitations"
            >
              <svg
                className="w-[24px] h-[24px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {invitations.length > 0 && (
                <span className="absolute -top-[10px] -right-[10px] min-w-[20px] h-[20px] px-[4px] flex items-center justify-center bg-primary text-on-primary font-label-sm text-label-sm border-2 border-background">
                  {invitations.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <BusinessList
          businesses={activeBusinesses}
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

      {showInvitations && (
        <InvitationsModal
          onClose={() => setShowInvitations(false)}
          invitations={invitations}
          onAccept={handleAcceptInvite}
          onDecline={handleDeclineInvite}
        />
      )}
    </main>
  );
}

export default WorkspacesPage;

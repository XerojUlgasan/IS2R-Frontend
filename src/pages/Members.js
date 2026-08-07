import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useMembers } from "../hooks/useMembers";
import { inviteMember, updateMemberPermissions, removeMember } from "../api/member.api";
import { supabase } from "../lib/supabaseClient";
import RemoveMemberModal from "../components/members/RemoveMemberModal";
import ConfigureActionsModal from "../components/members/ConfigureActionsModal";
import InviteUserModal from "../components/members/InviteUserModal";

// Role badge styling: Owner is high-contrast, others use outline variants.
function roleBadgeClass(role) {
  switch (role) {
    case "Owner":
      return "bg-primary text-on-primary";
    case "Shareholder":
      return "bg-surface-container-lowest border border-outline text-on-surface-variant";
    default:
      return "bg-surface-container-lowest border border-surface-variant text-on-surface";
  }
}

// Inline status pill shown beside the member's name. Accepted members show no
// badge; only pending and deactivated are surfaced.
function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  if (s === "pending") {
    return (
      <span className="inline-flex items-center px-xs py-[2px] border border-outline text-on-surface-variant font-label-md text-[10px] uppercase tracking-widest">
        Pending
      </span>
    );
  }
  if (s === "deactivated") {
    return (
      <span className="inline-flex items-center px-xs py-[2px] border border-error text-error font-label-md text-[10px] uppercase tracking-widest">
        Deactivated
      </span>
    );
  }
  return null;
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value; // already-formatted strings pass through
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function displayName(member) {
  // The backend may return the userId (uuid) as `name` until display names are
  // populated; fall back to the email's local part in that case.
  if (member.name && !UUID_RE.test(member.name)) return member.name;
  if (member.email) return member.email.split("@")[0];
  return "Unknown";
}

function Members() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;

  const { members, loading, error, refetch } = useMembers(businessId);

  // Team management (invite / configure / remove) is owner-only on the backend.
  const isOwner = String(activeBusiness?.role || "").toUpperCase() === "OWNER";

  const [removeTarget, setRemoveTarget] = useState(null);
  const [configureTarget, setConfigureTarget] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  // Resolve the signed-in user so we can hide "configure" on their own row.
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setCurrentUserId(data?.user?.id ?? null);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  const pendingInvites = members.filter((m) => String(m.status).toLowerCase() === "pending").length;

  // Remove a member, then refresh. Throws non-401 errors so the modal shows them.
  const handleRemove = async (member) => {
    try {
      await removeMember(businessId, member.id);
      setRemoveTarget(null);
      refetch();
    } catch (err) {
      if (err && err.status === 401) return goToLogin();
      throw err;
    }
  };

  // Persist a member's allowed actions, then refresh.
  const handleSavePermissions = async (member, permissions) => {
    try {
      await updateMemberPermissions(businessId, member.id, permissions);
      setConfigureTarget(null);
      refetch();
    } catch (err) {
      if (err && err.status === 401) return goToLogin();
      throw err;
    }
  };

  // Send an invite, then refresh.
  const handleInvite = async ({ email, role, permissions }) => {
    try {
      await inviteMember(businessId, { email, role, permissions });
      setShowInvite(false);
      refetch();
    } catch (err) {
      if (err && err.status === 401) return goToLogin();
      throw err;
    }
  };

  // No workspace chosen yet.
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">group</span>
        <h2 className="font-headline-md text-headline-md text-primary">No workspace selected</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Choose a business to manage its members.
        </p>
        <Link
          to="/my-businesses"
          className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors"
        >
          Select Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full min-h-[calc(100vh-64px)] relative">
      <div className="flex justify-between items-end mb-lg relative z-10">
        <div className="flex flex-col gap-xs">
          <span className="font-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-sm">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            Administration
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight relative inline-block group">
            Team Members
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-xs">
            Manage access control, roles, and administrative privileges for the IS²R system.
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowInvite(true)}
            className="group flex items-center gap-sm bg-primary text-on-primary px-lg py-sm font-label-md text-label-md uppercase tracking-wider hover:bg-surface-container-lowest hover:text-primary border border-primary transition-all duration-300 shadow-md hover:shadow-xl relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Invite User
          </button>
        )}
      </div>
      <div className="grid grid-cols-12 gap-lg mb-lg">
        <div className="col-span-12 md:col-span-6 bg-surface-container border border-surface-variant p-lg relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-md">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Total Users</span>
            <span className="material-symbols-outlined text-primary">groups</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">{members.length}</div>
        </div>
        <div className="col-span-12 md:col-span-6 bg-surface-container border border-surface-variant p-lg relative overflow-hidden group">
          <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-primary/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center justify-between mb-md">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Pending Invites</span>
            <span className="material-symbols-outlined text-primary">mail</span>
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">{pendingInvites}</div>
        </div>
      </div>
      <div className="flex-1 bg-surface-container border border-surface-variant flex flex-col relative z-10 shadow-lg">
        <div className="px-lg py-md border-b border-surface-variant flex items-center justify-between bg-surface-bright/50 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input
                className="pl-10 pr-4 py-2 bg-background border border-surface-variant text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all"
                placeholder="Search members..."
                type="text"
              />
            </div>
            <div className="h-6 w-px bg-surface-variant"></div>
            <div className="flex gap-sm">
              <button className="px-sm py-1 font-label-md text-label-md text-on-surface bg-surface-variant uppercase tracking-wider">All</button>
              <button className="px-sm py-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 uppercase tracking-wider transition-colors">Owners</button>
              <button className="px-sm py-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 uppercase tracking-wider transition-colors">Staff</button>
            </div>
          </div>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">filter_list</button>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-sm py-xl text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin">refresh</span>
            <span className="font-body-md">Loading members...</span>
          </div>
        )}

        {!loading && error && error.status === 403 && (
          <div className="flex flex-col items-center justify-center gap-md py-xl text-center">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">lock</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Access restricted</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              {error.message || "You don't have permission to view members for this workspace."}
            </p>
          </div>
        )}

        {!loading && error && error.status !== 401 && error.status !== 403 && (
          <div className="flex flex-col items-center justify-center gap-md py-xl text-center">
            <span className="material-symbols-outlined text-[32px] text-error">error</span>
            <p className="font-body-md text-on-surface">Something went wrong, try again.</p>
            <button
              onClick={refetch}
              className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors flex items-center gap-sm"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && members.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-xl text-center bg-surface-container-low border-t border-surface-variant">
            <div className="w-24 h-24 mb-lg relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
              <div className="absolute inset-2 bg-surface-variant rounded-full flex items-center justify-center border border-outline-variant">
                <span className="material-symbols-outlined text-[40px] text-on-surface-variant">group_off</span>
              </div>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">No members found</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-lg">
              Invite new team members to collaborate.
            </p>
          </div>
        )}

        {!loading && !error && members.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-variant">
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-1/3">User</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-1/4">Email</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-1/6">Role</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-1/6">Accepted At</th>
                  <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right w-1/12">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {members.map((member) => {
                  const name = displayName(member);
                  const deactivated = String(member.status).toLowerCase() === "deactivated";
                  const avatarClass =
                    member.role === "Owner"
                      ? "bg-primary text-on-primary"
                      : "bg-surface-variant border border-outline-variant text-on-surface";
                  return (
                    <tr key={member.id} className="group hover:bg-surface-bright/50 transition-colors">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-md">
                          {member.avatar_url ? (
                            <img className={`w-10 h-10 object-cover grayscale border border-surface-variant ${deactivated ? "opacity-50" : ""}`} alt={name} src={member.avatar_url} />
                          ) : (
                            <div className={`w-10 h-10 flex items-center justify-center font-headline-md text-headline-md ${avatarClass} ${deactivated ? "opacity-50" : ""}`}>
                              {name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-sm">
                              <span className={`font-body-md text-body-md text-on-surface font-medium ${deactivated ? "opacity-50" : ""}`}>
                                {name}
                              </span>
                              <StatusBadge status={member.status} />
                            </div>
                            {member.subtitle && (
                              <div className="font-body-sm text-body-sm text-on-surface-variant">{member.subtitle}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant font-mono">{member.email}</td>
                      <td className="px-lg py-md">
                        <span className={`inline-flex items-center px-2 py-1 font-label-md text-label-md uppercase tracking-wider ${roleBadgeClass(member.role)}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">{formatDate(member.acceptedAt)}</td>
                      <td className="px-lg py-md text-right">
                        <div className="flex justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {isOwner && member.userId !== currentUserId && (
                            <button
                              onClick={() => setConfigureTarget(member)}
                              className="p-1 hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-colors"
                              title="Configure allowed actions"
                            >
                              <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                            </button>
                          )}
                          {isOwner && member.role !== "Owner" && (
                            <button
                              onClick={() => setRemoveTarget(member)}
                              className="p-1 hover:bg-error-container text-on-surface-variant hover:text-error transition-colors"
                              title="Remove Member"
                            >
                              <span className="material-symbols-outlined text-[20px]">person_remove</span>
                            </button>
                          )}
                          {!isOwner && <span className="font-body-sm text-body-sm text-on-surface-variant">—</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-md border-t border-surface-variant bg-surface-bright flex items-center justify-between mt-auto">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {loading ? "Loading..." : `Showing ${members.length} user${members.length === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>
      {/* Decorative background elements */}
      <div className="fixed top-20 right-10 w-[40vw] h-[40vw] bg-gradient-to-br from-surface-variant/20 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none mix-blend-multiply"></div>
      <div className="fixed bottom-0 left-72 w-full h-1/3 bg-gradient-to-t from-background to-transparent -z-10 pointer-events-none"></div>

      {removeTarget && (
        <RemoveMemberModal member={{ ...removeTarget, name: displayName(removeTarget) }} onClose={() => setRemoveTarget(null)} onConfirm={handleRemove} />
      )}
      {configureTarget && (
        <ConfigureActionsModal
          member={{ ...configureTarget, name: displayName(configureTarget) }}
          onClose={() => setConfigureTarget(null)}
          onSave={handleSavePermissions}
        />
      )}
      {showInvite && <InviteUserModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
    </div>
  );
}

export default Members;

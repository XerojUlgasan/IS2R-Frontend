import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateFullName, updatePassword } from "../api/user.api";

function PersonalSettings() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Name form
  const [fullName, setFullName] = useState("");
  const [nameSubmitting, setNameSubmitting] = useState(false);
  const [nameSuccess, setNameSuccess] = useState("");
  const [nameError, setNameError] = useState("");

  // Password form
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [pwSubmitting, setPwSubmitting] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  const loadUser = useCallback(async () => {
    try {
      const u = await getCurrentUser();
      setUser(u);
      setFullName(u.user_metadata?.full_name || "");
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    setNameError("");
    setNameSuccess("");

    if (!fullName.trim()) {
      setNameError("Full name is required.");
      return;
    }

    setNameSubmitting(true);
    try {
      const updated = await updateFullName(fullName.trim());
      setUser(updated);
      setNameSuccess("Name updated successfully.");
    } catch (err) {
      setNameError(err.message || "Failed to update name.");
    } finally {
      setNameSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!passwords.newPassword) {
      setPwError("New password is required.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError("Passwords do not match.");
      return;
    }

    setPwSubmitting(true);
    try {
      await updatePassword(passwords.newPassword);
      setPwSuccess("Password updated successfully.");
      setPasswords({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err.message || "Failed to update password.");
    } finally {
      setPwSubmitting(false);
    }
  };

  const fieldClass =
    "w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all";
  const labelClass = "font-label-md text-label-md uppercase tracking-widest text-on-surface-variant";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-[32px]">refresh</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-lg max-w-2xl">
      {/* Header */}
      <div className="flex flex-col gap-xs mb-md">
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase tracking-tighter">Personal Settings</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage your account name and password.
        </p>
      </div>

      {/* Account Info (read-only) */}
      <div className="border border-outline-variant bg-surface-container-lowest p-lg flex flex-col gap-md">
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">Account</h2>
        <div className="flex flex-col gap-xs">
          <span className={labelClass}>Email</span>
          <input className={`${fieldClass} opacity-60 cursor-not-allowed`} type="text" value={user?.email || ""} disabled />
        </div>
      </div>

      {/* Update Full Name */}
      <form onSubmit={handleNameSubmit} className="border border-outline-variant bg-surface-container-lowest p-lg flex flex-col gap-md">
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">Full Name</h2>
        <div className="flex flex-col gap-xs">
          <label className={labelClass} htmlFor="fullName">
            Name <span className="text-error">*</span>
          </label>
          <input
            className={fieldClass}
            id="fullName"
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {nameError && (
          <div className="border border-error bg-error-container text-on-error-container p-sm font-body-sm text-body-sm flex items-start gap-sm">
            <span className="material-symbols-outlined text-[18px] text-error">error</span>
            <span>{nameError}</span>
          </div>
        )}
        {nameSuccess && (
          <div className="border border-primary bg-surface-container text-primary p-sm font-body-sm text-body-sm flex items-start gap-sm">
            <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            <span>{nameSuccess}</span>
          </div>
        )}

        <div className="flex justify-end pt-md border-t border-outline-variant">
          <button
            type="submit"
            disabled={nameSubmitting}
            className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface-container-lowest hover:text-primary transition-colors flex items-center gap-sm disabled:opacity-60 disabled:pointer-events-none"
          >
            {nameSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">check</span>
                Update Name
              </>
            )}
          </button>
        </div>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordSubmit} className="border border-outline-variant bg-surface-container-lowest p-lg flex flex-col gap-md">
        <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-tight">Change Password</h2>
        <div className="flex flex-col gap-xs">
          <label className={labelClass} htmlFor="newPassword">
            New Password <span className="text-error">*</span>
          </label>
          <input
            className={fieldClass}
            id="newPassword"
            type="password"
            placeholder="At least 6 characters"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-xs">
          <label className={labelClass} htmlFor="confirmPassword">
            Confirm Password <span className="text-error">*</span>
          </label>
          <input
            className={fieldClass}
            id="confirmPassword"
            type="password"
            placeholder="Re-enter new password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
          />
        </div>

        {pwError && (
          <div className="border border-error bg-error-container text-on-error-container p-sm font-body-sm text-body-sm flex items-start gap-sm">
            <span className="material-symbols-outlined text-[18px] text-error">error</span>
            <span>{pwError}</span>
          </div>
        )}
        {pwSuccess && (
          <div className="border border-primary bg-surface-container text-primary p-sm font-body-sm text-body-sm flex items-start gap-sm">
            <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            <span>{pwSuccess}</span>
          </div>
        )}

        <div className="flex justify-end pt-md border-t border-outline-variant">
          <button
            type="submit"
            disabled={pwSubmitting}
            className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface-container-lowest hover:text-primary transition-colors flex items-center gap-sm disabled:opacity-60 disabled:pointer-events-none"
          >
            {pwSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                Updating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock</span>
                Change Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PersonalSettings;

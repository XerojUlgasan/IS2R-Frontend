import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { usePermissions } from "../hooks/usePermissions";
import { useBusinessSettings } from "../hooks/useBusinessSettings";
import { updateBusinessSettings, uploadBusinessLogo } from "../api/business.api";

const EMPTY_FORM = { name: "", description: "", contact_number: "", address: "" };
const MAX_LOGO_BYTES = 2 * 1024 * 1024; // 2MB

function BusinessSettings() {
  const navigate = useNavigate();
  const { activeBusiness, setActiveBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;
  const { isOwner } = usePermissions();
  const { settings, loading, error } = useBusinessSettings(businessId);

  const [form, setForm] = useState(EMPTY_FORM);
  const [logoLoc, setLogoLoc] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  // Prefill the form once settings load.
  useEffect(() => {
    if (settings) {
      setForm({
        name: settings.name || "",
        description: settings.description || "",
        contact_number: settings.contact_number || "",
        address: settings.address || "",
      });
      setLogoLoc(settings.logo_img_loc || null);
    }
  }, [settings]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setSaved(false);
  };

  const handleLogoClick = () => {
    if (!isOwner || uploadingLogo) return;
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    setSaveError(null);
    if (!file.type.startsWith("image/")) {
      setSaveError(new Error("Logo must be an image file (SVG, PNG, or JPG)."));
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setSaveError(new Error("Logo must be 2MB or smaller."));
      return;
    }

    setUploadingLogo(true);
    try {
      const data = await uploadBusinessLogo(businessId, file);
      setLogoLoc(data.logo_img_loc || null);
      setSaved(false);
    } catch (err) {
      if (err && err.status === 401) return goToLogin();
      setSaveError(err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOwner || !businessId) return;

    setSaveError(null);
    setSaved(false);
    if (!form.name.trim()) {
      setSaveError(new Error("Business name is required."));
      return;
    }

    setSaving(true);
    try {
      const data = await updateBusinessSettings(businessId, {
        name: form.name.trim(),
        description: form.description.trim() || null,
        contact_number: form.contact_number.trim() || null,
        address: form.address.trim() || null,
        logo_img_loc: logoLoc || null,
      });
      const next = data.settings || data;
      // Keep the sidebar/switcher in sync with the new name + logo.
      setActiveBusiness({
        ...activeBusiness,
        name: next?.name ?? form.name.trim(),
        logo_img_loc: next?.logo_img_loc ?? logoLoc ?? null,
      });
      setSaved(true);
    } catch (err) {
      if (err && err.status === 401) return goToLogin();
      setSaveError(err);
    } finally {
      setSaving(false);
    }
  };

  const fieldClass =
    "w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed";
  const labelClass = "font-label-md text-label-md uppercase tracking-widest text-on-surface-variant";

  // No workspace chosen yet.
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">settings</span>
        <h2 className="font-headline-md text-headline-md text-primary">No workspace selected</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Choose a business to view and edit its settings.
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
    <div className="flex flex-col w-full h-full justify-center items-center p-xl gap-xl">
      <div className="flex flex-col w-full max-w-2xl gap-lg">
        <div className="flex flex-col gap-xs">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Business Settings</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Update your business details and branding.</p>
        </div>

        {!isOwner && !loading && (
          <div className="flex items-center gap-sm border border-outline-variant bg-surface-container p-md font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            Only the business owner can edit these settings. You have read-only access.
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-sm py-xl border border-outline-variant bg-surface-container-lowest text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin">refresh</span>
            <span className="font-body-md">Loading settings...</span>
          </div>
        )}

        {!loading && error && error.status !== 401 && (
          <div className="flex flex-col items-center justify-center gap-md py-xl border border-outline bg-surface-container-lowest text-center">
            <span className="material-symbols-outlined text-[32px] text-error">error</span>
            <p className="font-body-md text-body-md text-on-surface">{error.message || "Something went wrong, try again."}</p>
          </div>
        )}

        {!loading && !error && (
          <form className="flex flex-col gap-xl w-full border border-outline-variant p-xl bg-surface-container-lowest" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-md">
              <h3 className="font-headline-md text-label-md uppercase tracking-widest text-on-surface">General Information</h3>
              <div className="flex flex-col gap-lg">
                <div className="flex flex-col gap-xs">
                  <label className={labelClass} htmlFor="name">
                    Business Name
                  </label>
                  <input className={fieldClass} id="name" type="text" value={form.name} onChange={handleChange} disabled={!isOwner} />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className={labelClass} htmlFor="description">
                    Description
                  </label>
                  <textarea
                    className={`${fieldClass} resize-none`}
                    id="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    disabled={!isOwner}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-md">
              <h3 className="font-headline-md text-label-md uppercase tracking-widest text-on-surface">Contact &amp; Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="flex flex-col gap-xs">
                  <label className={labelClass} htmlFor="contact_number">
                    Phone Number
                  </label>
                  <input className={fieldClass} id="contact_number" type="tel" value={form.contact_number} onChange={handleChange} disabled={!isOwner} />
                </div>
                <div className="flex flex-col gap-xs md:col-span-2">
                  <label className={labelClass} htmlFor="address">
                    Address
                  </label>
                  <input className={fieldClass} id="address" type="text" value={form.address} onChange={handleChange} disabled={!isOwner} />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-md">
              <h3 className="font-headline-md text-label-md uppercase tracking-widest text-on-surface">Branding</h3>
              <div className="flex flex-col gap-lg">
                <div className="flex flex-col gap-xs">
                  <label className={labelClass}>Logo</label>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                  <div
                    onClick={handleLogoClick}
                    className={`flex items-center gap-lg border border-outline-variant border-dashed p-xl bg-surface-container transition-colors group ${
                      isOwner ? "hover:bg-surface-container-highest cursor-pointer" : "opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="w-16 h-16 bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                      {uploadingLogo ? (
                        <span className="material-symbols-outlined text-on-primary text-[28px] animate-spin">refresh</span>
                      ) : logoLoc ? (
                        <img className="w-full h-full object-cover" alt="Business logo" src={logoLoc} />
                      ) : (
                        <span className="material-symbols-outlined text-on-primary text-[32px]">upload</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-xs">
                      <p className="font-body-md text-body-md text-on-surface font-bold">
                        {uploadingLogo ? "Uploading..." : logoLoc ? "Replace logo" : "Upload new logo"}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">SVG, PNG, or JPG (Max 2MB). Ideal size 512x512px.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {saveError && (
              <div className="border border-error bg-error-container text-on-error-container p-sm font-body-sm text-body-sm flex items-start gap-sm">
                <span className="material-symbols-outlined text-[18px] text-error">error</span>
                <span>{saveError.message}</span>
              </div>
            )}
            {saved && (
              <div className="border border-primary bg-surface-container text-primary p-sm font-body-sm text-body-sm flex items-start gap-sm">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Settings saved.</span>
              </div>
            )}

            <div className="flex justify-end pt-lg border-t border-outline-variant mt-lg">
              <button
                className="bg-primary text-on-primary px-xl py-md font-label-md text-label-md uppercase tracking-widest hover:bg-white hover:text-primary hover:border-primary hover:border transition-all flex items-center gap-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:text-on-primary"
                type="submit"
                disabled={!isOwner || saving || uploadingLogo}
                title={isOwner ? "Save Changes" : "Only the business owner can edit settings"}
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default BusinessSettings;

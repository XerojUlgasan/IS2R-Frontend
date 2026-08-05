import React, { useState } from "react";

function BusinessSettings() {
  // Controlled form values, initialized to the source design's defaults.
  const [form, setForm] = useState({
    businessName: "IS²R Printing",
    description: "High-precision commercial printing services.",
    phone: "+1 (555) 019-2834",
    address: "100 Printworks Way, Industrial District",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Persisting settings would hook into an API here.
  };

  return (
    <div className="flex flex-col w-full h-full justify-center items-center p-xl gap-xl">
      <div className="flex flex-col w-full max-w-2xl gap-lg">
        <div className="flex flex-col gap-xs">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Business Settings</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Update your business details and branding.</p>
        </div>
        <form className="flex flex-col gap-xl w-full border border-outline-variant p-xl bg-surface-container-lowest" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-md">
            <h3 className="font-headline-md text-label-md uppercase tracking-widest text-on-surface">General Information</h3>
            <div className="flex flex-col gap-lg">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant" htmlFor="businessName">
                  Business Name
                </label>
                <input
                  className="w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all"
                  id="businessName"
                  type="text"
                  value={form.businessName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all resize-none"
                  id="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-md">
            <h3 className="font-headline-md text-label-md uppercase tracking-widest text-on-surface">Contact &amp; Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  className="w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all"
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-xs md:col-span-2">
                <label className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant" htmlFor="address">
                  Address
                </label>
                <input
                  className="w-full bg-surface-container border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:border-2 transition-all"
                  id="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-md">
            <h3 className="font-headline-md text-label-md uppercase tracking-widest text-on-surface">Branding</h3>
            <div className="flex flex-col gap-lg">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Logo</label>
                <div className="flex items-center gap-lg border border-outline-variant border-dashed p-xl bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer group">
                  <div className="w-16 h-16 bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-on-primary text-[32px]">upload</span>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <p className="font-body-md text-body-md text-on-surface font-bold">Upload new logo</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">SVG, PNG, or JPG (Max 2MB). Ideal size 512x512px.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-lg border-t border-outline-variant mt-lg">
            <button
              className="bg-primary text-on-primary px-xl py-md font-label-md text-label-md uppercase tracking-widest hover:bg-white hover:text-primary hover:border-primary hover:border transition-all"
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BusinessSettings;

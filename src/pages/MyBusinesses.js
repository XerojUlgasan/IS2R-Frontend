import React from "react";
import { useNavigate } from "react-router-dom";

function MyBusinesses() {
  const navigate = useNavigate();
  const selectWorkspace = () => navigate("/dashboard");

  return (
    <main className="w-full max-w-lg mx-auto bg-surface min-h-screen flex items-center justify-center font-body-md">
      <div className="flex flex-col w-full h-full p-lg gap-margin bg-background text-on-background font-body-md">
        {/* Header Section */}
        <div className="flex flex-col gap-xs mb-md">
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Select Business</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[80%]">
            Choose a workspace to continue or start a new operation.
          </p>
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg auto-rows-fr">
          {/* Business Card 1 */}
          <div className="group relative flex flex-col justify-between p-lg bg-surface-container border border-outline-variant hover:border-primary transition-colors duration-200 cursor-pointer min-h-[200px]">
            <div className="absolute top-lg right-lg">
              <span className="inline-flex items-center justify-center px-sm py-xs bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest">
                Admin
              </span>
            </div>
            <div className="flex items-start gap-md mb-xl">
              <div className="w-xl h-xl bg-surface-container-highest border border-outline flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-primary transition-colors duration-200">
                <img
                  className="w-full h-full object-cover mix-blend-multiply group-hover:invert transition-all duration-200"
                  alt="Apex IS²R logo"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADWl6NDHU-eRJ-f6Ed1V5sfEcB66uGjMFJIAVOTY_L3VMt8ZRAgwHrSwKrTn8n-u2FSk60YepUtfb03fjAGtJPDDTU-LFT67gE6ZIae3tcrqNX9yf-2-wX8tI_4ProjEKbWGYqasMiAn_JQ0uyFhUSMba0iwmnV92zDuVuMoOu91dkyvRSgKiIKXzhRQIb0pNLdL0dmB0XVCX99QwMgw15N-v1W3yeyPhtrMYoQKQBd5-7n4QgOFmU"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="font-headline-md text-headline-md text-primary truncate">Apex IS²R</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Commercial Offset Printing</p>
              </div>
            </div>
            <button
              onClick={selectWorkspace}
              className="w-full py-md px-lg bg-surface border border-primary text-primary font-label-md text-label-md uppercase tracking-wider group-hover:bg-primary group-hover:text-on-primary transition-colors duration-200 flex items-center justify-between"
            >
              <span>Select Workspace</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
          {/* Business Card 2 */}
          <div className="group relative flex flex-col justify-between p-lg bg-surface-container border border-outline-variant hover:border-primary transition-colors duration-200 cursor-pointer min-h-[200px]">
            <div className="absolute top-lg right-lg">
              <span className="inline-flex items-center justify-center px-sm py-xs bg-surface-container-highest border border-primary text-primary font-label-md text-label-md uppercase tracking-widest">
                Press Op
              </span>
            </div>
            <div className="flex items-start gap-md mb-xl">
              <div className="w-xl h-xl bg-surface-container-highest border border-outline flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-primary transition-colors duration-200">
                <img
                  className="w-full h-full object-cover mix-blend-multiply group-hover:invert transition-all duration-200"
                  alt="Nexus IS²R logo"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO8bcRNO6uP3OxCF76pdAp6etQ9NCU9mm1Ew6kCrtHAZ8T5pi_EaOeYcyqYMLIkbxcMvC-reGTejEaNLY9eJPBxoG3R_hwnl5RzR0NNqOPBXU6VaVyzpD1jf1ZuMvp26Ck_DzXavSgubDnWHmc_s-73LwnMg7OzE_qql_LtxtxC0w96eT3LMcnma-TmmZAjC7Wi8A_P03LZvprToro8ATXgjbWKUfUkxu3kE1ZJhRY7tNwnkBF6N7i"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="font-headline-md text-headline-md text-primary truncate">Nexus IS²R</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Large Format &amp; Signage</p>
              </div>
            </div>
            <button
              onClick={selectWorkspace}
              className="w-full py-md px-lg bg-surface border border-primary text-primary font-label-md text-label-md uppercase tracking-wider group-hover:bg-primary group-hover:text-on-primary transition-colors duration-200 flex items-center justify-between"
            >
              <span>Select Workspace</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
          {/* Business Card 3 */}
          <div className="group relative flex flex-col justify-between p-lg bg-surface-container border border-outline-variant hover:border-primary transition-colors duration-200 cursor-pointer min-h-[200px]">
            <div className="absolute top-lg right-lg">
              <span className="inline-flex items-center justify-center px-sm py-xs bg-surface-container-highest border border-primary text-primary font-label-md text-label-md uppercase tracking-widest">
                Manager
              </span>
            </div>
            <div className="flex items-start gap-md mb-xl">
              <div className="w-xl h-xl bg-surface-container-highest border border-outline flex items-center justify-center shrink-0 overflow-hidden group-hover:bg-primary transition-colors duration-200">
                <span className="font-display-lg text-[24px] text-primary group-hover:text-on-primary transition-colors duration-200">
                  O
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="font-headline-md text-headline-md text-primary truncate">Onyx IS²R</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Finishing &amp; Fulfillment</p>
              </div>
            </div>
            <button
              onClick={selectWorkspace}
              className="w-full py-md px-lg bg-surface border border-primary text-primary font-label-md text-label-md uppercase tracking-wider group-hover:bg-primary group-hover:text-on-primary transition-colors duration-200 flex items-center justify-between"
            >
              <span>Select Workspace</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
          {/* Create New Business Card */}
          <div className="group flex flex-col justify-center items-center p-lg bg-surface border-2 border-dashed border-outline hover:border-primary hover:bg-surface-container-low transition-all duration-200 cursor-pointer min-h-[200px]">
            <div className="w-[48px] h-[48px] bg-surface border border-primary flex items-center justify-center mb-md group-hover:bg-primary transition-colors duration-200">
              <span className="material-symbols-outlined text-[24px] text-primary group-hover:text-on-primary transition-colors duration-200">
                add
              </span>
            </div>
            <h2 className="font-headline-md text-headline-md text-primary text-center">Create New</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-xs">
              Setup a new production facility
            </p>
          </div>
        </div>
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
    </main>
  );
}

export default MyBusinesses;

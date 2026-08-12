import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="bg-surface font-body-md text-on-surface">
      <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-surface">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-margin">
          <div className="flex items-center gap-md">
            <img
              alt="Monolith Inventory Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZdODKCNETi4iKme5jRoH90aGr8t7X9Wr6u9ZDOuR7OcU5f0FXpj7w7dAI5XQ9NK-ehz-uvShxeK1dH5dW0rw8Fpu4Gzd-KJUiu7mY8widAvRtA7nE8wLtNmSh9O8KGcp5nRwdK67mX0iAEbE2fE8LmyXxSAUMIifE-hcH40oOqV4UeR9jpAOds-kt8oy0jRx0SxniPfO5MK8-gnAuCn7d2wKVBdaSWVt8zi1GyT7lzLUycTQF1ycO"
            />
            <span className="font-headline-md text-headline-md">
              IS<sup>2</sup>R
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-xl">
            <a
              className="text-label-md uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Features
            </a>
            <a
              className="text-label-md uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              Pricing
            </a>
            <a
              className="text-label-md uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
              href="#"
            >
              About
            </a>
          </nav>
          <div className="flex items-center gap-md">
            <Link
              className="px-md py-sm text-label-md uppercase font-bold border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="px-md py-sm text-label-md uppercase font-bold bg-primary text-on-primary hover:bg-on-surface-variant transition-all"
              to="/login"
            >
              Get Started
            </Link>
            <div className="ml-md w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>
      <main className="w-full bg-surface pt-20">
        <div className="flex w-full flex-col text-on-surface">
          <section className="relative mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col items-center justify-center px-4 pb-margin pt-xl sm:px-6 lg:px-margin">
            <div className="text-center max-w-4xl flex flex-col items-center z-10 relative">
              <div className="inline-block border border-primary px-sm py-xs text-label-md uppercase tracking-widest mb-lg bg-surface relative z-10">
                Monolith v2.0 is live
              </div>
              <h1 className="font-display-lg text-display-lg text-primary mb-md tracking-tight leading-tight">
                Inventory Control for the Modern IS<sup>2</sup>R Shop.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-xl">
                Streamline your materials, track every sale, and grow your business with a system built for precision.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-md relative z-10">
                <Link
                  className="px-lg py-md bg-primary text-on-primary font-label-md uppercase tracking-widest hover:bg-on-surface-variant transition-colors"
                  to="/login"
                >
                  Start Your Free Trial
                </Link>
                <a
                  className="px-lg py-md border border-primary text-primary font-label-md uppercase tracking-widest hover:bg-surface-variant transition-colors"
                  href="#"
                >
                  View Demo
                </a>
              </div>
            </div>
            <div className="mt-xl w-full max-w-5xl mx-auto relative group">
              <div className="absolute inset-0 bg-primary opacity-5 blur-3xl transform group-hover:scale-105 transition-transform duration-1000"></div>
              <div className="relative border border-outline-variant bg-surface-container-lowest p-sm shadow-xl rounded-none transform transition-transform duration-700 hover:-translate-y-2">
                <img
                  alt="Monolith Dashboard Mockup"
                  className="w-full h-auto border border-outline-variant object-cover object-top grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbOeLaImiYt1H9KGQlPPEKTf42Q4FaHNQMHVYzZXkWTQ5Xsu3evinFXAB4joA1aj1UOHXF6SkLak-SW03kXT1mHRJ-0z_ynjsVO5MrEFmw_d5aN42Q0CWIykpYz1E3zq_12WUcW_9js5nNv49vqdj-3xAu5xAIegaWQeSwJxz_aQ1dzZj4r_Qfs2JA175w17Mb4T36MgndfQSeguhRlvjpK2VATv2fG8RxQRpgVlo7SctIyOB00HwT"
                />
              </div>
            </div>
          </section>
          <section className="py-margin px-margin max-w-7xl mx-auto w-full border-t border-outline-variant">
            <div className="mb-xl text-center">
              <h2 className="font-headline-lg text-headline-lg text-primary">Engineered for Precision</h2>
              <p className="font-body-md text-on-surface-variant mt-sm">
                A unified architecture for every aspect of print production.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {/* Feature 1: Large Panel */}
              <div className="md:col-span-8 border border-outline-variant bg-surface p-lg group hover:bg-surface-container-low transition-colors duration-300 flex flex-col justify-between min-h-[320px]">
                <div>
                  <span className="font-headline-lg text-headline-md text-primary mb-sm block">01</span>
                  <h3 className="font-headline-md text-headline-md text-primary mb-sm">Multi-Tenant Management</h3>
                  <p className="font-body-md text-on-surface-variant max-w-md">
                    Easily switch between different print facilities. Centralize your operations while maintaining
                    distinct data siloes for each location.
                  </p>
                </div>
                <div className="mt-lg border-t border-outline-variant pt-md flex justify-between items-end">
                  <div className="flex gap-sm">
                    <div className="w-12 h-12 border border-outline-variant flex items-center justify-center bg-surface-container-highest">
                      <span className="material-symbols-outlined">factory</span>
                    </div>
                    <div className="w-12 h-12 border border-outline-variant flex items-center justify-center bg-surface-container-lowest">
                      <span className="material-symbols-outlined">storefront</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
              {/* Feature 2: Tall Panel */}
              <div className="md:col-span-4 border border-outline-variant bg-surface p-lg group hover:border-primary transition-colors duration-300 flex flex-col justify-between min-h-[320px]">
                <div>
                  <span className="font-headline-lg text-headline-md text-primary mb-sm block">02</span>
                  <h3 className="font-headline-md text-headline-md text-primary mb-sm">Real-time Stock</h3>
                  <p className="font-body-md text-on-surface-variant">
                    Automatic deduction on every sale. Never run out of critical substrates or inks mid-run.
                  </p>
                </div>
                <div className="mt-lg">
                  <div className="border border-outline-variant p-sm flex items-center justify-between mb-xs bg-surface-container-lowest">
                    <span className="font-label-md text-on-surface uppercase">Gloss Text 80lb</span>
                    <span className="font-body-sm text-error font-bold">12 reams (Low)</span>
                  </div>
                  <div className="border border-outline-variant p-sm flex items-center justify-between bg-surface-container-lowest">
                    <span className="font-label-md text-on-surface uppercase">Cyan Ink</span>
                    <span className="font-body-sm text-primary">45 liters</span>
                  </div>
                </div>
              </div>
              {/* Feature 3: Medium Panel */}
              <div className="md:col-span-5 border border-outline-variant bg-surface p-lg group hover:bg-surface-container-low transition-colors duration-300 flex flex-col justify-between min-h-[280px]">
                <div>
                  <span className="font-headline-lg text-headline-md text-primary mb-sm block">03</span>
                  <h3 className="font-headline-md text-headline-md text-primary mb-sm">Role-Based Access</h3>
                  <p className="font-body-md text-on-surface-variant">
                    Custom views for Owners, Staff, and Shareholders. Limit exposure of sensitive data.
                  </p>
                </div>
                <div className="flex gap-xs mt-lg flex-wrap">
                  <span className="bg-primary text-on-primary px-sm py-xs font-label-md uppercase">Admin</span>
                  <span className="border border-outline-variant px-sm py-xs font-label-md uppercase">Press Op</span>
                  <span className="border border-outline-variant px-sm py-xs font-label-md uppercase">Manager</span>
                </div>
              </div>
              {/* Feature 4: Wide Panel */}
              <div className="md:col-span-7 border border-outline-variant bg-primary text-on-primary p-lg group hover:bg-inverse-surface transition-colors duration-300 flex flex-col justify-between min-h-[280px]">
                <div>
                  <span className="font-headline-lg text-headline-md text-surface-variant mb-sm block opacity-50">04</span>
                  <h3 className="font-headline-md text-headline-md mb-sm">Financial Analytics</h3>
                  <p className="font-body-md text-surface-variant max-w-md">
                    Deep insights into revenue and manufacturing costs. Track job profitability down to the peso.
                  </p>
                </div>
                <div className="mt-lg flex items-end justify-between">
                  <div className="text-display-lg font-display-lg">₱1.2M</div>
                  <div className="flex flex-col items-end">
                    <span className="font-label-md uppercase text-surface-variant">Monthly Gross</span>
                    <span className="text-surface-variant flex items-center gap-xs font-body-sm">
                      <span className="material-symbols-outlined text-sm">trending_up</span> +14.2%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-margin px-margin max-w-7xl mx-auto w-full border-t border-outline-variant flex flex-col items-center">
            <p className="font-label-md text-on-surface-variant uppercase tracking-widest mb-lg text-center">
              Trusted by high-volume facilities
            </p>
            <div className="flex flex-wrap justify-center items-center gap-xl opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="font-headline-lg text-headline-md">LITHOPRESS</div>
              <div className="font-headline-lg text-headline-md">CMYK.CO</div>
              <div className="font-headline-lg text-headline-md">BINDERYWORKS</div>
              <div className="font-headline-lg text-headline-md">APEX PRINT</div>
            </div>
          </section>
          <section className="py-xl px-margin border-t border-outline-variant bg-surface-container-lowest mt-margin w-full text-center flex flex-col items-center justify-center min-h-[40vh]">
            <h2 className="font-display-lg text-display-lg text-primary mb-md max-w-3xl">
              Ready to modernize your operations?
            </h2>
            <p className="font-body-lg text-on-surface-variant mb-xl">
              Join the facilities that have cut waste by 30% and increased margin visibility.
            </p>
            <Link
              className="px-xl py-lg bg-primary text-on-primary font-label-md uppercase tracking-widest text-lg hover:bg-on-surface-variant transition-colors shadow-lg"
              to="/login"
            >
              Get Started Now
            </Link>
          </section>
        </div>
      </main>
      <footer className="w-full bg-surface border-t border-outline-variant py-xl">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex flex-col md:flex-row justify-between items-center gap-lg">
            <div className="flex items-center gap-sm">
              <img
                alt="Monolith"
                className="h-6 w-auto grayscale opacity-50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuADn84wJY72M75gQ2HsGHfJ1_NuzXIgOTiPzT2CLZbPlWakFcFDkNuSdq1VMK9wbC5beakRQgadZcykZzgp_7f2rUyqoP-EzVS5A6Qt-FmazNwPHSwwMQh83XoOHJBcdxfaHE4BEuwpyDM7k2wLn8NfHekmEunvLR-MSAbKYBtJydOQ5Q0lxy8MG4dlM9LaqgYNz9Xi1po8B6bZIhUx8HukBBNOKWvM9-LpIAyK1_GJT5NymsZ6lkgW"
              />
              <span className="font-headline-md text-body-md text-on-surface-variant opacity-50">
                IS<sup>2</sup>R Inventory
              </span>
            </div>
            <nav className="flex gap-lg">
              <a className="text-label-md uppercase text-on-surface-variant hover:text-primary transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="text-label-md uppercase text-on-surface-variant hover:text-primary transition-colors" href="#">
                Terms of Service
              </a>
              <a className="text-label-md uppercase text-on-surface-variant hover:text-primary transition-colors" href="#">
                Contact
              </a>
            </nav>
            <p className="text-label-md text-on-surface-variant">© 2024 IS<sup>2</sup>R Inventory. Built for scale.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

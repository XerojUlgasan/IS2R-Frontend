import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function Register() {
  const navigate = useNavigate();
  // Auth states: idle -> registering -> created (then redirect).
  const [status, setStatus] = useState("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== "idle") return;
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("registering");

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setStatus("idle");
      return;
    }

    setStatus("created");
    // Route to login once the account has been provisioned.
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  const buttonBg = status === "created" ? "bg-surface-container-lowest" : "bg-primary";
  const buttonText = status === "created" ? "text-primary" : "text-on-primary";
  const buttonLock = status === "registering" ? "opacity-80 pointer-events-none" : "";

  return (
    <main className="w-full max-w-lg mx-auto bg-surface min-h-screen flex items-center justify-center font-body-md">
      <div className="flex flex-col w-full h-full min-h-[calc(100vh-2rem)] bg-background justify-center items-center">
        <div className="w-full max-w-sm p-lg">
          {/* Branding */}
          <div className="mb-xl flex flex-col items-center justify-center">
            <div className="w-[64px] h-[64px] bg-primary flex items-center justify-center mb-md">
              <span
                className="text-on-primary font-display-lg text-display-lg leading-none tracking-tighter"
                style={{ fontSize: "40px", marginTop: "-4px" }}
              >
                IS²R
              </span>
            </div>
            <h1 className="font-display-lg text-headline-md text-on-background uppercase tracking-wider text-center">
              IS²R
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-widest mt-xs">
              Request Clearance
            </p>
          </div>
          {/* Form Container */}
          <div className="bg-surface-container border border-outline-variant p-lg rounded-none">
            <form className="flex flex-col gap-md" id="registerForm" onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="flex flex-col gap-xs relative group">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="name">
                  Full Name
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline text-on-background font-body-md text-body-md p-md rounded-none focus:outline-none focus:border-primary focus:border-2 transition-all duration-100 placeholder:text-on-surface-variant/50"
                  id="name"
                  name="name"
                  placeholder="Jane Operator"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* Email Input */}
              <div className="flex flex-col gap-xs relative group mt-sm">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline text-on-background font-body-md text-body-md p-md rounded-none focus:outline-none focus:border-primary focus:border-2 transition-all duration-100 placeholder:text-on-surface-variant/50"
                  id="email"
                  name="email"
                  placeholder="operator@monolith.sys"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Password Input */}
              <div className="flex flex-col gap-xs relative group mt-sm">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline text-on-background font-body-md text-body-md p-md rounded-none focus:outline-none focus:border-primary focus:border-2 transition-all duration-100 placeholder:text-on-surface-variant/50"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* Confirm Password Input */}
              <div className="flex flex-col gap-xs relative group mt-sm">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline text-on-background font-body-md text-body-md p-md rounded-none focus:outline-none focus:border-primary focus:border-2 transition-all duration-100 placeholder:text-on-surface-variant/50"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {/* Error Message */}
              {error && (
                <div className="border border-error bg-error-container text-on-error-container p-sm font-body-sm text-body-sm flex items-start gap-sm">
                  <span className="material-symbols-outlined text-[18px] text-error">error</span>
                  <span>{error}</span>
                </div>
              )}
              {/* Submit Button */}
              <button
                className={`w-full ${buttonBg} ${buttonText} ${buttonLock} font-label-md text-body-md uppercase p-md mt-lg rounded-none hover:bg-surface-container-lowest hover:text-primary hover:border hover:border-primary border border-primary transition-colors duration-150 flex items-center justify-center gap-sm group`}
                type="submit"
              >
                {status === "idle" && (
                  <>
                    Create Account
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </>
                )}
                {status === "registering" && (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span className="ml-sm">Provisioning...</span>
                  </>
                )}
                {status === "created" && (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    <span className="ml-sm">Account Created</span>
                  </>
                )}
              </button>
            </form>
          </div>
          {/* Login Link */}
          <div className="mt-lg text-center border-t border-outline-variant pt-lg">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Already have an account?{" "}
              <Link
                className="text-primary font-label-md uppercase underline ml-xs hover:text-on-background transition-colors"
                to="/login"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
        {/* Decorative technical marks */}
        <div className="absolute top-lg left-lg hidden md:block">
          <div className="font-label-md text-[10px] text-on-surface-variant uppercase opacity-50 tracking-widest leading-loose">
            SEQ: 092-B<br />
            TGT: MNL-SYS<br />
            STATUS: ENROLL
          </div>
        </div>
        <div className="absolute bottom-lg right-lg hidden md:block">
          <div className="w-16 h-16 border-r border-b border-outline-variant"></div>
        </div>
        <div className="absolute top-lg right-lg hidden md:block">
          <div className="w-16 h-16 border-r border-t border-outline-variant"></div>
        </div>
        <div className="absolute bottom-lg left-lg hidden md:block">
          <div className="w-16 h-16 border-l border-b border-outline-variant"></div>
        </div>
      </div>
    </main>
  );
}

export default Register;

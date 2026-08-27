"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ==========================================
  // EMAIL / PASSWORD LOGIN
  // ==========================================

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  }

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  async function handleGoogleLogin() {
    try {
      setError("");
      setGoogleLoading(true);

      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("GOOGLE LOGIN ERROR:", error);

      setError(
        "Unable to login with Google."
      );

      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full bg-white p-4 rounded-lg max-w-md">


      <div className="mb-8 mt-5 text-center">


        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Login to continue to ClassShare
        </p>

      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

  

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading || loading}
        className="group flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >

        {googleLoading ? (
          <Loader2
            size={20}
            className="animate-spin"
          />
        ) : (
          <GoogleIcon />
        )}

        <span>
          {googleLoading
            ? "Connecting..."
            : "Continue with Google"}
        </span>

      </button>


      <div className="my-7 flex items-center gap-4">

        <div className="h-px flex-1 bg-gray-200" />

        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          Or continue with email
        </span>

        <div className="h-px flex-1 bg-gray-200" />

      </div>


      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* EMAIL */}

        <div>

          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Email address
          </label>

          <div className="relative">

            <Mail
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 disabled:bg-gray-100"
            />

          </div>

        </div>

        {/* PASSWORD */}

        <div>

          <div className="mb-2 flex items-center justify-between">

            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <button
              type="button"
              className="text-xs font-medium text-gray-500 transition hover:text-black"
              onClick={() => {
                // Add forgot-password flow later
                alert(
                  "Password reset will be available soon."
                );
              }}
            >
              Forgot password?
            </button>

          </div>

          <div className="relative">

            <Lock
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 disabled:bg-gray-100"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>

          </div>

        </div>

        {/* ======================================
            LOGIN BUTTON
        ====================================== */}

        <button
          type="submit"
          disabled={
            loading ||
            googleLoading
          }
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >

          {loading ? (
            <>
              <Loader2
                size={19}
                className="animate-spin"
              />

              <span>
                Logging in...
              </span>
            </>
          ) : (
            <>
              <span>
                Login to ClassShare
              </span>

              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </>
          )}

        </button>

      </form>

      {/* ======================================
          REGISTER
      ====================================== */}

      <p className="mt-7 text-center text-sm text-gray-500">

        Don't have an account?{" "}

        <Link
          href="/register"
          className="font-semibold text-black underline-offset-4 hover:underline"
        >
          Create one
        </Link>

      </p>

      {/* ======================================
          FOOTER
      ====================================== */}

      <p className="mt-8 text-center text-xs leading-relaxed text-gray-400">
        By continuing, you agree to the
        ClassShare Terms of Service and
        Privacy Policy.
      </p>

    </div>
  );
}


// ==========================================
// GOOGLE ICON
// ==========================================

function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
      />

      <path
        fill="#34A853"
        d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
      />

      <path
        fill="#FBBC05"
        d="M6.54 13.58A5.86 5.86 0 0 1 6.23 12c0-.55.1-1.09.31-1.58V7.89H3.3A9.5 9.5 0 0 0 2.5 12c0 1.48.35 2.88.8 4.11l3.24-2.53Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.39c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.47 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.11 9.46 6.39 12 6.39Z"
      />
    </svg>
  );
}
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] =
    useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setMessage("");
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Unable to create account."
        );

        setLoading(false);
        return;
      }

      /*
       * Account successfully created.
       *
       * We can either:
       * 1. Redirect to login
       * 2. Automatically login
       *
       * We are doing automatic login here.
       */

      const loginResult = await signIn(
        "credentials",
        {
          email: form.email,
          password: form.password,
          redirect: false,
        }
      );

      if (loginResult?.error) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  // ==========================================
  // GOOGLE REGISTER / LOGIN
  // ==========================================

  const handleGoogle = async () => {
    try {
      setMessage("");
      setGoogleLoading(true);

      await signIn("google", {
        callbackUrl: "/dashboard",
      });

    } catch (error) {
      console.error(
        "GOOGLE ERROR:",
        error
      );

      setMessage(
        "Unable to continue with Google."
      );

      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center rounded-lg mt-10 mb-10 bg-gray-50 px-4 py-10">

      <div className="w-full max-w-md">

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <button
            type="button"
            onClick={handleGoogle}
            disabled={
              loading ||
              googleLoading
            }
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >

            {googleLoading ? (
              <Loader2
                size={19}
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

            <span className="whitespace-nowrap text-xs font-medium uppercase tracking-wider text-gray-400">
              Or use email
            </span>

            <div className="h-px flex-1 bg-gray-200" />

          </div>

          {message && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NAME */}

            <div>

              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full name
              </label>

              <div className="relative">

                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Rajiv talwar"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 disabled:bg-gray-100"
                />

              </div>

            </div>

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
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 disabled:bg-gray-100"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

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
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
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

              <p className="mt-2 text-xs text-gray-400">
                Use at least 6 characters.
              </p>

            </div>

            {/* ROLE */}

            <div>

              <label
                htmlFor="role"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                I am a
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10 disabled:bg-gray-100"
              >
                <option value="student">
                  Student
                </option>

                <option value="teacher">
                  Teacher
                </option>
              </select>

            </div>

            {/* SUBMIT */}

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
                    Creating account...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Create ClassShare Account
                  </span>

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </>
              )}

            </button>

          </form>

          <p className="mt-7 text-center text-sm text-gray-500">

            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-black underline-offset-4 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-gray-400">
          By creating an account, you agree to
          the ClassShare Terms of Service and
          Privacy Policy.
        </p>

      </div>

    </main>
  );
}

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
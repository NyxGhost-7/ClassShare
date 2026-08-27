"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        
        {/* LOGO */}

        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-3"
        >
      

          <div className="text-left">
            <p className="text-lg font-black tracking-tight text-white">
              Class
              <span className="bg-gradient-to-r from-indigo-100 via-green-200 to-pink-400 bg-clip-text text-transparent">
                Share
              </span>
            </p>

            <p className="text-[10px] font-medium tracking-[0.2em] text-slate-500">
              LEARN TOGETHER
            </p>
          </div>
        </button>

        {/* DASHBOARD BUTTON */}

        <button
          onClick={() => router.push("/dashboard")}
          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <LayoutDashboard size={17} />

          <span className="hidden sm:inline">
            Dashboard
          </span>

          <ArrowRight
            size={15}
            className="hidden transition group-hover:translate-x-1 sm:block"
          />
        </button>
      </div>
    </nav>
  );
}
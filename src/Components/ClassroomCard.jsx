"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  ArrowRight,
  Lock,
  Globe2,
} from "lucide-react";

export default function ClassroomCard({ classroom }) {
  const router = useRouter();

  const isPrivate = classroom.privacy === "private";

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-2xl">

      {/* ================= HOVER GLOW ================= */}

      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-[70px] transition duration-500 group-hover:bg-indigo-500/20" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-purple-500/5 blur-[70px]" />

      {/* ================= TOP ================= */}

      <div className="relative flex items-start justify-between gap-4">

        {/* ICON */}

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-indigo-300 transition-all duration-300 group-hover:scale-105 group-hover:bg-indigo-500/10 group-hover:text-indigo-200">
          <BookOpen size={25} />
        </div>

        {/* PRIVACY */}

        <div
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${
            isPrivate
              ? "border-amber-400/10 bg-amber-400/5 text-amber-300"
              : "border-green-400/10 bg-green-400/5 text-green-300"
          }`}
        >
          {isPrivate ? (
            <Lock size={12} />
          ) : (
            <Globe2 size={12} />
          )}

          {isPrivate ? "Private" : "Public"}
        </div>
      </div>

      {/* ================= CLASSROOM INFO ================= */}

      <div className="relative mt-6">

        <h3 className="truncate text-xl font-bold text-white">
          {classroom.name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-slate-400">
          {classroom.description ||
            "No description available for this classroom."}
        </p>

      </div>

      {/* ================= META ================= */}

      <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4">

        {/* MEMBERS */}

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users size={15} />

          <span>
            {classroom.members?.length || 0}{" "}
            {classroom.members?.length === 1
              ? "Member"
              : "Members"}
          </span>
        </div>

        {/* CODE */}

        {classroom.code && (
          <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs font-semibold tracking-wider text-slate-400">
            {classroom.code}
          </div>
        )}

      </div>

      {/* ================= BUTTON ================= */}

      <button
        onClick={() =>
          router.push(
            `/classroom/${classroom._id}`
          )
        }
        className="group/button relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white py-3 text-sm font-bold text-black transition-all duration-300 hover:bg-slate-200"
      >
        <span>
          Open Classroom
        </span>

        <ArrowRight
          size={17}
          className="transition-transform duration-300 group-hover/button:translate-x-1"
        />
      </button>

    </div>
  );
}
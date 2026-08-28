"use client";

import { useRouter } from "next/navigation";
import { BookOpen,Users,ArrowRight,Lock,Globe2,Hash,} from "lucide-react";

export default function ClassroomCard({ classroom }) {
  const router = useRouter();

  const isPrivate =
    classroom.privacy === "private";

  const memberCount =
    classroom.members?.length || 0;

  const openClassroom = () => {
    router.push(
      `/classroom/${classroom._id}`
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-lg  bg-black p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-2xl">


      <div className="relative flex items-start justify-between gap-4">

        <div
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${
            isPrivate
              ? "border-amber-400/10 bg-amber-400/5 text-red-600"
              : "border-green-400/10 bg-green-400/5 text-green-300"
          }`}
        >
          {isPrivate ? (
            <Lock size={12} />
          ) : (
            <Globe2 size={12} />
          )}

          {isPrivate
            ? "Private"
            : "Public"}
        </div>
      </div>

      {/* CLASSROOM INFO */}

      <div className="relative mt-6">

        <h3 className="truncate text-xl font-bold text-white">
          {classroom.name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-slate-400">
          {classroom.description ||
            "No description available for this classroom."}
        </p>

      </div>

      {/* INFO */}

      <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4">

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users size={15} />

          <span>
            {memberCount}{" "}
            {memberCount === 1
              ? "Member"
              : "Members"}
          </span>
        </div>

        {/* SHOW CODE ONLY FOR PRIVATE CLASS */}

        {isPrivate && classroom.code && (
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-400/10 bg-amber-400/5 px-2.5 py-1.5 font-mono text-xs font-semibold tracking-wider text-amber-300">
            <Hash size={12} />

            {classroom.code}
          </div>
        )}

        {/* PUBLIC LABEL */}

        {!isPrivate && (
          <span className="text-xs text-slate-600">
            Open access
          </span>
        )}

      </div>

      {/* OPEN BUTTON */}

      <button
        onClick={openClassroom}
        className="group/button relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white py-3 text-sm font-bold text-black transition-all duration-300 hover:bg-slate-200 active:scale-[0.98]"
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
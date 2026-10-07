import {Globe2,ArrowRight,Users,} from "lucide-react";

export default function PublicClassroomCard({
  classroom,
  onOpen,
}) {
  const memberCount = Array.isArray(
    classroom?.members
  )
    ? classroom.members.length
    : 0;

  const classroomName =
    classroom?.name?.trim() ||
    "Untitled Classroom";

  const description =
    classroom?.description?.trim() ||
    "A public classroom open for everyone.";

  return (
    <article className="group relative overflow-hidden rounded-sm border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1  hover:shadow-amber-100 ">
      {/* Glow */}


      <div className="relative">
        {/* Top */}

        <div className="flex items-start justify-between gap-4">
        

          <div className="flex items-center gap-1.5 rounded-l border border-green-400/10 bg-green-400/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-green-400">
            <Globe2
              size={12}
              aria-hidden="true"
            />

            Public
          </div>
        </div>

        {/* Content */}

        <h3
          title={classroomName}
          className="mt-6 truncate text-xl font-bold"
        >
          {classroomName}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-slate-400">
          {description}
        </p>

        {/* Members */}

        <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-slate-500">
          <Users
            size={16}
            aria-hidden="true"
          />

          <span>
            {memberCount}{" "}
            {memberCount === 1
              ? "Member"
              : "Members"}
          </span>
        </div>

        {/* Open */}

        <button
          type="button"
          onClick={onOpen}
          className="group/button mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-bold text-black transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
        >
          Open Classroom

          <ArrowRight
            size={17}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover/button:translate-x-1"
          />
        </button>
      </div>
    </article>
  );
}
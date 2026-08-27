"use client";

import {
  FileText,
  FileImage,
  FileVideo,
  Link as LinkIcon,
  Presentation,
  ExternalLink,
} from "lucide-react";

export default function ResourceCard({ resource }) {
  const iconMap = {
    pdf: {
      icon: FileText,
      label: "PDF",
    },

    doc: {
      icon: FileText,
      label: "DOC",
    },

    docx: {
      icon: FileText,
      label: "DOCX",
    },

    ppt: {
      icon: Presentation,
      label: "PPT",
    },

    pptx: {
      icon: Presentation,
      label: "PPTX",
    },

    image: {
      icon: FileImage,
      label: "IMAGE",
    },

    video: {
      icon: FileVideo,
      label: "VIDEO",
    },

    link: {
      icon: LinkIcon,
      label: "LINK",
    },

    other: {
      icon: FileText,
      label: "FILE",
    },
  };

  const config =
    iconMap[resource.type] || iconMap.other;

  const Icon = config.icon;

  return (
    <div className="group flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] md:flex-row md:items-center md:justify-between">

      {/* RESOURCE INFO */}

      <div className="flex min-w-0 items-center gap-4">

        {/* ICON */}

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition group-hover:bg-white/10 group-hover:text-white">
          <Icon size={22} />
        </div>

        {/* DETAILS */}

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <h3 className="truncate font-bold text-white">
              {resource.title}
            </h3>

            <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:inline">
              {config.label}
            </span>

          </div>

          {resource.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">
              {resource.description}
            </p>
          )}

          {resource.createdAt && (
            <p className="mt-2 text-xs text-slate-600">
              Added{" "}
              {new Date(
                resource.createdAt
              ).toLocaleDateString()}
            </p>
          )}

        </div>
      </div>

      {/* OPEN BUTTON */}

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
      >
        Open
        <ExternalLink
          size={15}
          className="transition group-hover:translate-x-0.5"
        />
      </a>

    </div>
  );
}
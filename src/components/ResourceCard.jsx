"use client";

import { useState } from "react";

import {
  FileText,
  FileImage,
  FileVideo,
  Link as LinkIcon,
  Presentation,
  ExternalLink,
  File,
  Download,
  User,
  Trash2,
  Loader2,
} from "lucide-react";

export default function ResourceCard({
  resource,
  currentUserId,
  classroomHostId,
  onDelete,
}) {
  const [deleting, setDeleting] = useState(false);

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
      icon: File,
      label: "FILE",
    },
  };

  const type =
    resource.type?.toLowerCase() || "other";

  const config =
    iconMap[type] || iconMap.other;

  const Icon = config.icon;

  // =========================
  // PERMISSIONS
  // =========================

  const uploadedById =
    resource.uploadedBy?._id?.toString() ||
    resource.uploadedBy?.toString();

  const isUploader =
    currentUserId?.toString() ===
    uploadedById;

  const isHost =
    currentUserId?.toString() ===
    classroomHostId?.toString();

  const canDelete =
    isUploader || isHost;

  // =========================
  // FORMAT FILE SIZE
  // =========================

  const formatFileSize = (bytes) => {
    if (!bytes) return null;

    const sizes = [
      "Bytes",
      "KB",
      "MB",
      "GB",
    ];

    const index = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return `${(
      bytes / Math.pow(1024, index)
    ).toFixed(1)} ${sizes[index]}`;
  };

  const formattedSize =
    formatFileSize(resource.size);

  const formattedDate =
    resource.createdAt
      ? new Date(
          resource.createdAt
        ).toLocaleDateString(
          undefined,
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        )
      : null;

  // =========================
  // DELETE RESOURCE
  // =========================

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        `Delete "${resource.title}"? This cannot be undone.`
      );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response =
        await fetch(
          `/api/resource?id=${resource._id}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete resource"
        );

        return;
      }

      // Update parent UI immediately
      if (onDelete) {
        onDelete(resource._id);
      }

    } catch (error) {
      console.error(
        "DELETE RESOURCE ERROR:",
        error
      );

      alert(
        "Something went wrong while deleting the resource"
      );

    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-xl md:flex-row md:items-center md:justify-between">

      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-[60px] transition group-hover:bg-indigo-500/10" />

      {/* RESOURCE INFO */}

      <div className="relative flex min-w-0 items-center gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/10 group-hover:text-white">
          <Icon size={22} />
        </div>

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <h3 className="truncate font-bold text-white">
              {resource.title}
            </h3>

            <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {config.label}
            </span>

          </div>

          {resource.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">
              {resource.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">

            {formattedDate && (
              <span>
                Added {formattedDate}
              </span>
            )}

            {formattedSize && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-700" />

                <span>
                  {formattedSize}
                </span>
              </>
            )}

            {resource.uploadedBy?.name && (
              <>
                <span className="h-1 w-1 rounded-full bg-slate-700" />

                <span className="flex items-center gap-1">
                  <User size={11} />

                  {resource.uploadedBy.name}
                </span>
              </>
            )}

          </div>

        </div>
      </div>

      {/* ACTIONS */}

      <div className="relative flex shrink-0 gap-2">

        {/* OPEN RESOURCE */}

        {resource.url ? (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:text-black active:scale-[0.98]"
          >
            {type === "link" ? (
              <>
                Open
                <ExternalLink size={15} />
              </>
            ) : (
              <>
                Open
                <Download size={15} />
              </>
            )}
          </a>
        ) : (
          <button
            disabled
            className="cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-slate-600"
          >
            Unavailable
          </button>
        )}

        {/* DELETE RESOURCE */}

        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete resource"
            className="flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 px-3 text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        )}

      </div>

    </div>
  );
}
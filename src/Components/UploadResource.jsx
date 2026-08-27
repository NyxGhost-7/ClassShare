"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Link,
  FileUp,
  Upload,
  FileText,
  Check,
  Loader2,
  // Youube,
  Paperclip,
  Sparkles,
} from "lucide-react";

export default function UploadResource({ classroomId }) {
  const router = useRouter();

  const [mode, setMode] = useState("link");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);


  const addLink = async () => {
    if (!title.trim() || !url.trim()) {
      alert("Title and URL are required");
      return;
    }

    setLoading(true);

    try {
      let type = "link";

      if (
        url.includes("youtube.com") ||
        url.includes("youtu.be")
      ) {
        type = "video";
      }

      const response = await fetch("/api/resource", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          type,
          url,
          classroomId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add link");
        return;
      }

      router.push(`/classroom/${classroomId}`);
    } catch (error) {
      alert("Failed to add link");
    } finally {
      setLoading(false);
    }
  };


  const uploadFile = async () => {
    if (!title.trim() || !file) {
      alert("Title and file are required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("classroomId", classroomId);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Upload failed");
        return;
      }

      router.push(`/classroom/${classroomId}`);
    } catch (error) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">



      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium tracking-wider text-slate-500">
            <Sparkles size={16} />
            NEW RESOURCE
          </div>

          <h2 className="mt-3 text-2xl font-bold">
            Add a Resource
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Share a useful link or upload a file for your classmates.
          </p>
        </div>
      </div>

      {/* ================= MODE SWITCH ================= */}

      <div className="mt-8 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1">

        <button
          type="button"
          onClick={() => setMode("link")}
          className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
            mode === "link"
              ? "bg-white text-black shadow-lg"
              : "text-slate-500 hover:text-white"
          }`}
        >
          <Link size={17} />
          Paste Link
        </button>

        <button
          type="button"
          onClick={() => setMode("file")}
          className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
            mode === "file"
              ? "bg-white text-black shadow-lg"
              : "text-slate-500 hover:text-white"
          }`}
        >
          <FileUp size={17} />
          Upload File
        </button>
      </div>

      {/* ================= TITLE ================= */}

      <div className="mt-7">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Resource Title
        </label>

        <input
          type="text"
          placeholder="Example: Unit 1 DSA Notes"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      {/* ================= DESCRIPTION ================= */}

      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Description

          <span className="ml-1 text-slate-500">
            (optional)
          </span>
        </label>

        <textarea
          placeholder="Add a short description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-28 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      {/* ================= LINK MODE ================= */}

      {mode === "link" && (
        <div className="mt-5">

          <label className="mb-2 block text-sm font-medium text-slate-300">
            Resource URL
          </label>

          <div className="relative">
            <Link
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* YOUTUBE HINT */}

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            {/* <Youtube size={15} /> */}

            YouTube links will automatically be added as videos.
          </div>

          <button
            onClick={addLink}
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-black to-gray-600 py-3.5 font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Adding Resource...
              </>
            ) : (
              <>
                <Link size={18} />
                Add Link
              </>
            )}
          </button>
        </div>
      )}

      {/* ================= FILE MODE ================= */}

      {mode === "file" && (
        <div className="mt-5">

          <label className="mb-2 block text-sm font-medium text-slate-300">
            Select File
          </label>

          <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-10 text-center transition hover:border-white/30 hover:bg-white/[0.06]">

            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="hidden"
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition group-hover:scale-110 group-hover:text-white">
              <Upload size={24} />
            </div>

            <p className="mt-4 font-semibold text-white">
              {file
                ? file.name
                : "Choose a file to upload"}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              PDF, DOC, DOCX, PPT, PPTX, JPG or PNG
            </p>
          </label>

          {/* SELECTED FILE */}

          {file && (
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4">

              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg bg-white/5 p-2 text-slate-300">
                  <FileText size={18} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <Check
                size={18}
                className="shrink-0 text-green-400"
              />
            </div>
          )}

          <button
            onClick={uploadFile}
            disabled={loading || !file}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-black to-gray-600 py-3.5 font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Uploading...
              </>
            ) : (
              <>
                <Paperclip size={18} />
                Upload File
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  FileUp,
  Loader2,
  FileText,
} from "lucide-react";

import Navbar from "../../components/Navbar";

export default function UploadPage() {
  const searchParams =
    useSearchParams();

  const router =
    useRouter();

  const classroomId =
    searchParams.get("classroomId");

  const [mode, setMode] =
    useState("file");

  const [file, setFile] =
    useState(null);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [url, setUrl] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      if (!classroomId) {
        setError(
          "Invalid classroom"
        );

        return;
      }

      try {
        setLoading(true);

        // =====================
        // UPLOAD FILE
        // =====================

        if (mode === "file") {
          if (!file) {
            setError(
              "Please select a file"
            );

            setLoading(false);

            return;
          }

          const formData =
            new FormData();

          formData.append(
            "file",
            file
          );

          formData.append(
            "title",
            title
          );

          formData.append(
            "description",
            description
          );

          formData.append(
            "classroomId",
            classroomId
          );

          const response =
            await fetch(
              "/api/resource/upload",
              {
                method: "POST",
                body: formData,
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Upload failed"
            );
          }
        }

        // =====================
        // ADD LINK
        // =====================

        else {
          const response =
            await fetch(
              "/api/resource",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  title,
                  description,
                  url,
                  classroomId,
                }),
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to add link"
            );
          }
        }

        router.push(
          `/classroom/${classroomId}`
        );

        router.refresh();
      } catch (error) {
        console.error(error);

        setError(
          error.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 py-10">
        <button
          onClick={() =>
            router.back()
          }
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={17} />

          Back to Classroom
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white">
            <Upload size={24} />
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Add Resource
          </h1>

          <p className="mt-2 text-slate-400">
            Upload study material or share a useful link.
          </p>

          {/* MODE */}

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() =>
                setMode("file")
              }
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                mode === "file"
                  ? "border-white bg-white text-black"
                  : "border-white/10 bg-white/5 text-slate-400"
              }`}
            >
              <FileUp size={17} />

              Upload File
            </button>

            <button
              type="button"
              onClick={() =>
                setMode("link")
              }
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                mode === "link"
                  ? "border-white bg-white text-black"
                  : "border-white/10 bg-white/5 text-slate-400"
              }`}
            >
              <LinkIcon size={17} />

              Add Link
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* TITLE */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Example: DBMS Unit 1 Notes"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Add a short description..."
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
              />
            </div>

            {/* FILE */}

            {mode === "file" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Select File
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-6 py-10 text-center transition hover:bg-white/[0.06]">
                  <FileText
                    size={32}
                    className="text-slate-400"
                  />

                  <span className="mt-3 text-sm font-medium">
                    {file
                      ? file.name
                      : "Choose a file"}
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    PDF, DOC, PPT, Image or Video
                  </span>

                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) =>
                      setFile(
                        event.target.files?.[0] ||
                          null
                      )
                    }
                  />
                </label>
              </div>
            )}

            {/* URL */}

            {mode === "link" && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Resource URL
                </label>

                <input
                  type="url"
                  value={url}
                  onChange={(event) =>
                    setUrl(
                      event.target.value
                    )
                  }
                  placeholder="https://example.com"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-white/30"
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-bold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  {mode === "file"
                    ? "Uploading..."
                    : "Adding..."}
                </>
              ) : (
                <>
                  <Upload size={18} />

                  {mode === "file"
                    ? "Upload Resource"
                    : "Add Resource"}
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  FileUp,
  Loader2,
  FileText,
} from "lucide-react";

import Navbar from "../../components/Navbar";

function UploadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const classroomId = searchParams.get("classroomId");

  const [mode, setMode] = useState("file");
  const [file, setFile] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // HANDLE SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // -------------------------------------------------------
    // Classroom validation
    // -------------------------------------------------------

    if (!classroomId) {
      setError(
        "Invalid classroom ID. Make sure ?classroomId= is in the URL."
      );
      return;
    }

    // -------------------------------------------------------
    // Title validation
    // -------------------------------------------------------

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // FILE UPLOAD
      // =====================================================

      if (mode === "file") {
        // ---------------------------------------------------
        // File validation
        // ---------------------------------------------------

        if (!file) {
          setError("Please select a file.");
          setLoading(false);
          return;
        }

        // 10MB limit
        if (file.size > 10 * 1024 * 1024) {
          setError("File size exceeds 10MB limit.");
          setLoading(false);
          return;
        }

        // ---------------------------------------------------
        // FormData
        // ---------------------------------------------------

        const formData = new FormData();

        formData.append("file", file);
        formData.append(
          "title",
          title.trim()
        );
        formData.append(
          "description",
          description.trim()
        );
        formData.append(
          "classroomId",
          classroomId
        );

        // ---------------------------------------------------
        // API request
        // ---------------------------------------------------

        const response = await fetch(
          "/api/resource/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        // ---------------------------------------------------
        // Parse response
        // ---------------------------------------------------

        const contentType =
          response.headers.get("content-type");

        let data;

        if (
          contentType &&
          contentType.includes(
            "application/json"
          )
        ) {
          data = await response.json();
        } else {
          const text =
            await response.text();

          throw new Error(
            text ||
              `Server error: ${response.status}`
          );
        }

        // ---------------------------------------------------
        // API error
        // ---------------------------------------------------

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Upload failed"
          );
        }

        if (data.resource) {
          window.dispatchEvent(
            new CustomEvent(
              "resource-uploaded",
              {
                detail: data.resource,
              }
            )
          );
        }
      }

      // =====================================================
      // LINK
      // =====================================================

      else {
        // ---------------------------------------------------
        // URL validation
        // ---------------------------------------------------

        if (!url.trim()) {
          setError("Please enter a URL.");
          setLoading(false);
          return;
        }

        // ---------------------------------------------------
        // API request
        // ---------------------------------------------------

        const response = await fetch(
          "/api/resource",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              title: title.trim(),
              description:
                description.trim(),
              url: url.trim(),
              classroomId,
            }),
          }
        );

 
        const contentType =
          response.headers.get(
            "content-type"
          );

        let data;

        if (
          contentType &&
          contentType.includes(
            "application/json"
          )
        ) {
          data = await response.json();
        } else {
          const text =
            await response.text();

          throw new Error(
            text ||
              `Server error: ${response.status}`
          );
        }


        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to add link"
          );
        }


        if (data.resource) {
          window.dispatchEvent(
            new CustomEvent(
              "resource-uploaded",
              {
                detail: data.resource,
              }
            )
          );
        }
      }


      router.push(
        `/classroom/${classroomId}`
      );

    } catch (error) {
      console.error(
        "UPLOAD ERROR:",
        error
      );

      setError(
        error.message ||
          "Something went wrong. Check console for details."
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
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />

          Back to Classroom
        </button>


        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">

          {/* ICON */}

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white">
            <Upload size={24} />
          </div>

          {/* TITLE */}

          <h1 className="mt-6 text-3xl font-black">
            Add Resource
          </h1>

          <p className="mt-2 text-slate-400">
            Upload study material or share
            a useful link.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() =>
                setMode("file")
              }
              disabled={loading}
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                mode === "file"
                  ? "border-white bg-white text-black"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
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
              disabled={loading}
              className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                mode === "link"
                  ? "border-white bg-white text-black"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
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


            <div>

              <label className="mb-2 block text-sm font-medium">
                Title{" "}
                <span className="text-red-400">
                  *
                </span>
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Example: DBMS Unit 1 Notes"
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
              />

            </div>


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
                disabled={loading}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
              />

            </div>


            {mode === "file" && (
              <div>

                <label className="mb-2 block text-sm font-medium">
                  Select File{" "}
                  <span className="text-red-400">
                    *
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-6 py-10 text-center transition hover:bg-white/[0.06] ${
                    loading
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >

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
                    PDF, DOC, PPT, Image or
                    Video (Max 10MB)
                  </span>

                  <input
                    type="file"
                    className="hidden"
                    disabled={loading}
                    onChange={(event) => {
                      setFile(
                        event.target
                          .files?.[0] ||
                          null
                      );
                    }}
                  />

                </label>

                {/* FILE SIZE */}

                {file && (
                  <p className="mt-2 text-xs text-slate-500">
                    Size:{" "}
                    {(
                      file.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                )}

              </div>
            )}


            {mode === "link" && (
              <div>

                <label className="mb-2 block text-sm font-medium">
                  Resource URL{" "}
                  <span className="text-red-400">
                    *
                  </span>
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
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition placeholder:text-slate-600 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
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

export default function UploadPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          <div className="flex items-center gap-3 text-slate-400">

            <Loader2
              size={22}
              className="animate-spin"
            />

            Loading upload page...

          </div>
        </div>
      }
    >
      <UploadContent />
    </Suspense>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Search,
  BookOpen,
  FileText,
  Video,
  Link as LinkIcon,
  FolderOpen,
  Filter,
  X,
  Plus,
  Loader2,
  Image as ImageIcon,
  Presentation,
  File,
} from "lucide-react";

import Navbar from "../../components/Navbarr";
import ResourceCard from "../../components/ResourceCard";

export default function ResourcesPage() {
  const router = useRouter();
  const params = useParams();

  const classroomId = params?.classroomId;

  const [classroom, setClassroom] = useState(null);
  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!classroomId) return;

    loadResources();
  }, [classroomId]);

  const loadResources = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/resource?classroomId=${classroomId}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load resources"
        );
      }

      setClassroom(data.classroom);
      setResources(data.resources || []);
    } catch (error) {
      console.error("RESOURCE LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesSearch =
        !query ||
        resource.title?.toLowerCase().includes(query) ||
        resource.description?.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "file"
          ? ["pdf", "doc", "ppt", "image", "other"].includes(
              resource.type
            )
          : resource.type === filter);

      return matchesSearch && matchesFilter;
    });
  }, [resources, search, filter]);

  /* ================= FILTERS ================= */

  const filters = [
    {
      id: "all",
      label: "All",
      icon: <FolderOpen size={16} />,
    },
    {
      id: "file",
      label: "Files",
      icon: <FileText size={16} />,
    },
    {
      id: "video",
      label: "Videos",
      icon: <Video size={16} />,
    },
    {
      id: "link",
      label: "Links",
      icon: <LinkIcon size={16} />,
    },
  ];

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <Loader2
              size={36}
              className="mx-auto animate-spin text-slate-400"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading resources...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* ================= BACK ================= */}

        <button
          onClick={() =>
            router.push(
              `/classroom/${classroomId}`
            )
          }
          className="group mb-10 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft
            size={17}
            className="transition group-hover:-translate-x-1"
          />

          Back to Classroom
        </button>

        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">

          {/* GLOW */}

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px]" />

          <div className="relative">

            <div className="flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-slate-500">
              <BookOpen size={16} />

              RESOURCE LIBRARY
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              {classroom?.name || "Classroom"}

              <span className="block bg-gradient-to-r from-indigo-100 via-green-400 to-pink-400 bg-clip-text text-transparent">
                Resources.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl leading-relaxed text-slate-400">
              Browse notes, documents, videos and useful
              links shared by members of this classroom.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">

              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
                <span className="font-semibold text-white">
                  {resources.length}
                </span>{" "}
                {resources.length === 1
                  ? "Resource"
                  : "Resources"}
              </div>

              {classroom?.code && (
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-sm text-slate-400">
                  {classroom.code}
                </div>
              )}

            </div>
          </div>
        </section>

        {/* ================= SEARCH ================= */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-black px-11 py-3 text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* FILTERS */}

            <div className="flex gap-2 overflow-x-auto">

              {filters.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setFilter(item.id)
                  }
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    filter === item.id
                      ? "bg-white text-black shadow-lg"
                      : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}

            </div>
          </div>
        </section>

        {/* ================= RESOURCE HEADER ================= */}

        <section className="mt-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">
                Learning Resources
              </h2>

              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-400">
                {filteredResources.length}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {search || filter !== "all"
                ? "Showing filtered resources."
                : "Everything shared in this classroom."}
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
              <Filter size={16} />

              {filter === "all"
                ? "Everything"
                : filter === "file"
                ? "Files"
                : `${filter}s`}
            </div>

            <button
              onClick={() =>
                router.push(
                  `/upload?classroomId=${classroomId}`
                )
              }
              className="group flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black shadow-lg transition hover:scale-[1.03]"
            >
              <Plus
                size={18}
                className="transition group-hover:rotate-90"
              />

              Add Resource
            </button>

          </div>
        </section>

        {/* ================= CONTENT ================= */}

        <section className="mt-6">

          {filteredResources.length === 0 ? (

            <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-20 text-center">

              <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[80px]" />

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-slate-300">

                {search || filter !== "all" ? (
                  <Search size={34} />
                ) : (
                  <FolderOpen size={34} />
                )}

              </div>

              <h3 className="relative mt-6 text-2xl font-bold">

                {search || filter !== "all"
                  ? "No matching resources"
                  : "No resources yet"}

              </h3>

              <p className="relative mx-auto mt-3 max-w-md leading-relaxed text-slate-500">

                {search || filter !== "all"
                  ? "Try another search term or change the filter."
                  : "Share your first note, document, video or useful link with the classroom."}

              </p>

              {search || filter !== "all" ? (

                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="relative mt-7 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Clear Filters
                </button>

              ) : (

                <button
                  onClick={() =>
                    router.push(
                      `/upload?classroomId=${classroomId}`
                    )
                  }
                  className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-105"
                >
                  <Plus size={18} />

                  Add First Resource
                </button>

              )}

            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {filteredResources.map(
                (resource) => (
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                  />
                )
              )}

            </div>

          )}

        </section>

      </main>
    </div>
  );
}
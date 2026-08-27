"use client";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

import Navbar from "@/components/Navbar";
import ResourceCard from "@/components/ResourceCard";

export default function ResourcesPage() {
  const router = useRouter();


  const params = useParams();

  const classroomId = params.classroomId;
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);

     const response = await fetch(
  `/api/resource?classroomId=${classroomId}`
);

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load resources");
        return;
      }

      setResources(data.resources || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        resource.description
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || resource.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [resources, search, filter]);

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

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* BACK */}

        <button
          onClick={() => router.push("/dashboard")}
          className="group mb-10 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft
            size={17}
            className="transition group-hover:-translate-x-1"
          />

          Back to Dashboard
        </button>

        {/* ================= HERO ================= */}

        <section className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

          <div>
            <div className="flex items-center gap-2 text-sm font-medium tracking-wider text-slate-500">
              <BookOpen size={16} />

              RESOURCE LIBRARY
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Everything You

              <span className="block bg-gradient-to-r from-indigo-100 via-green-400 to-pink-400 bg-clip-text text-transparent">
                Need to Learn.
              </span>
            </h1>

            <p className="mt-5 max-w-xl leading-relaxed text-slate-400">
              Browse notes, documents, videos and useful links shared
              across your classrooms.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-black to-gray-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.03]"
          >
            <Plus
              size={19}
              className="transition group-hover:rotate-90"
            />

            Add Resource
          </button>
        </section>

        {/* ================= SEARCH + FILTER ================= */}

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">

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
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black px-11 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10"
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
                  onClick={() => setFilter(item.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    filter === item.id
                      ? "bg-white text-black"
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

        <section className="mt-10 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold">
              Your Resources
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredResources.length}{" "}
              {filteredResources.length === 1
                ? "resource found"
                : "resources found"}
            </p>
          </div>

          <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
            <Filter size={16} />

            {filter === "all"
              ? "Showing everything"
              : `Showing ${filter}s`}
          </div>
        </section>

        {/* ================= CONTENT ================= */}

        <section className="mt-6">

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <Loader2
                  size={34}
                  className="mx-auto animate-spin text-slate-400"
                />

                <p className="mt-4 text-sm text-slate-500">
                  Loading resources...
                </p>
              </div>
            </div>
          ) : filteredResources.length === 0 ? (

            /* EMPTY STATE */

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
                  ? "Try changing your search or selecting a different filter."
                  : "Resources shared in your classrooms will appear here."}
              </p>

              {(search || filter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="relative mt-7 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (

            /* RESOURCE GRID */

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource._id}
                  resource={resource}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
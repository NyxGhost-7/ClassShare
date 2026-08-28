"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  BookOpen,
  FileText,
  Users,
  Video,
  Link as LinkIcon,
  Globe2,
  Loader2,
  Lock,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    loadPublicClassrooms();
  }, []);

  const loadPublicClassrooms = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/classroom/public",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          data.message ||
            "Failed to load public classrooms"
        );

        return;
      }

      setClassrooms(
        data.classrooms || []
      );

    } catch (error) {
      console.error(
        "PUBLIC CLASSROOM ERROR:",
        error
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">

        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3"
        >
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Class
              <span className="text-indigo-400">
                Share
              </span>
            </h1>

            <p className="text-xs text-white/40">
              Learn. Share. Grow.
            </p>
          </div>
        </button>

        <button
          onClick={() =>
            router.push("/dashboard")
          }
          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
        >
          Open Dashboard

          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </button>

      </nav>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-10 text-center">

        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-400">

          <Globe2 size={16} />

          Explore. Learn. Share.

        </div>

        <h2 className="mt-6 max-w-5xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">

          Your classroom.
          <br />

          <span className="bg-gradient-to-r from-purple-400 via-green-400 to-pink-400 bg-clip-text text-transparent">
            Connected.
          </span>{" "}

          <span className="text-white">
            Organized.
          </span>

        </h2>

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">

          Create your digital classroom and bring
          everything together. Share notes,
          assignments, documents, videos and useful
          resources with your classmates — instantly.

        </p>


        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="group flex items-center gap-3 rounded-2xl bg-white px-7 py-4 font-bold text-slate-900 shadow-2xl shadow-indigo-500/20 transition duration-300 hover:scale-105"
          >
            Start Sharing

            <ArrowRight
              size={20}
              className="transition group-hover:translate-x-1"
            />
          </button>

          <button
            onClick={() =>
              document
                .getElementById("public-classrooms")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
          >
            Explore Classrooms
          </button>

        </div>

        {/* FEATURE CARDS */}

        <div className="mt-20 grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">

          <FeatureCard
            icon={<FileText size={22} />}
            title="Notes"
            text="Share study material"
          />

          <FeatureCard
            icon={<Video size={22} />}
            title="Videos"
            text="Learn visually"
          />

          <FeatureCard
            icon={<LinkIcon size={22} />}
            title="Resources"
            text="Useful links"
          />

          <FeatureCard
            icon={<Users size={22} />}
            title="Classrooms"
            text="Learn together"
          />

        </div>

        {/* DASHBOARD PREVIEW */}

        <div className="relative mt-16 w-full max-w-4xl">

          <div className="absolute -left-8 top-10 hidden rotate-[-8deg] rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl lg:block">

            <BookOpen
              className="mb-2 text-indigo-400"
              size={22}
            />

            <p className="text-sm font-semibold">
              DBMS Notes
            </p>

            <p className="text-xs text-white/40">
              Added just now
            </p>

          </div>

          <div className="absolute -right-8 top-20 hidden rotate-[8deg] rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl lg:block">

            <Users
              className="mb-2 text-purple-400"
              size={22}
            />

            <p className="text-sm font-semibold">
              42 Members
            </p>

            <p className="text-xs text-white/40">
              Computer Science
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-2xl">

            <div className="flex items-center justify-between border-b border-white/10 pb-4">

              <div className="flex items-center gap-3">

                <div className="h-3 w-3 rounded-full bg-red-400" />

                <div className="h-3 w-3 rounded-full bg-yellow-400" />

                <div className="h-3 w-3 rounded-full bg-green-400" />

              </div>

              <p className="text-sm text-white/40">
                ClassShare Dashboard
              </p>

            </div>

            <div className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-3">

              <DashboardItem
                title="Data Structures"
                files="12 resources"
              />

              <DashboardItem
                title="Operating Systems"
                files="8 resources"
              />

              <DashboardItem
                title="Machine Learning"
                files="15 resources"
              />

            </div>

          </div>

        </div>

      </section>


      {/* ================================= */}
      {/* PUBLIC CLASSROOMS */}
      {/* ================================= */}

      <section
        id="public-classrooms"
        className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>

            <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-slate-500">

              <Globe2 size={17} />

              EXPLORE CLASSROOMS

            </div>

            <h2 className="mt-4 text-4xl font-black tracking-tight">

              Learn from the community.

            </h2>

            <p className="mt-3 max-w-xl text-slate-400">

              Explore public classrooms created by
              students and teachers. No invitation
              code required.

            </p>

          </div>

          {!loading && (
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">

              {classrooms.length}{" "}

              {classrooms.length === 1
                ? "Classroom"
                : "Classrooms"}

            </div>
          )}

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="flex justify-center py-24">

            <div className="text-center">

              <Loader2
                size={35}
                className="mx-auto animate-spin text-slate-500"
              />

              <p className="mt-4 text-sm text-slate-500">

                Loading classrooms...

              </p>

            </div>

          </div>

        ) : classrooms.length === 0 ? (

          /* EMPTY STATE */

          <div className="mt-12 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

              <BookOpen
                size={28}
                className="text-slate-400"
              />

            </div>

            <h3 className="mt-6 text-xl font-bold">

              No public classrooms yet

            </h3>

            <p className="mt-2 text-slate-500">

              Create a classroom and share your
              knowledge with everyone.

            </p>

            <button
              onClick={() =>
                router.push("/dashboard")
              }
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-105"
            >

              Create Classroom

              <ArrowRight size={17} />

            </button>

          </div>

        ) : (

          /* CLASSROOM GRID */

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {classrooms.map(
              (classroom) => (

                <PublicClassroomCard
                  key={classroom._id}
                  classroom={classroom}
                />

              )
            )}

          </div>

        )}

      </section>


      {/* FOOTER */}

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">

        © {new Date().getFullYear()} ClassShare.
        Learn. Share. Grow.

      </footer>

    </main>
  );
}


/* ================================= */
/* FEATURE CARD */
/* ================================= */

function FeatureCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-indigo-400/30 hover:bg-white/[0.08]">

      <div className="mb-4 w-fit rounded-xl bg-indigo-500/15 p-3 text-indigo-300 transition group-hover:scale-110">

        {icon}

      </div>

      <h3 className="font-bold">

        {title}

      </h3>

      <p className="mt-1 text-sm text-white/40">

        {text}

      </p>

    </div>
  );
}

function DashboardItem({
  title,
  files,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10">

      <div className="mb-8 flex items-center justify-between">

        <div className="rounded-xl bg-indigo-500/15 p-2 text-indigo-300">

          <BookOpen size={20} />

        </div>

        <span className="h-2 w-2 rounded-full bg-green-400" />

      </div>

      <h4 className="font-semibold">

        {title}

      </h4>

      <p className="mt-1 text-sm text-white/40">

        {files}

      </p>

    </div>
  );
}

function PublicClassroomCard({
  classroom,
}) {
  const router = useRouter();

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">

      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-[70px]" />

      <div className="relative">

   
        <div className="flex items-start justify-between">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-indigo-300">

            <BookOpen size={25} />

          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-green-400/10 bg-green-400/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-green-300">

            <Globe2 size={12} />

            Public

          </div>

        </div>

        <h3 className="mt-6 truncate text-xl font-bold">

          {classroom.name}

        </h3>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-slate-400">

          {classroom.description ||
            "A public classroom open for everyone."}

        </p>

        <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-slate-500">

          <Users size={16} />

          {classroom.members?.length || 0}{" "}

          {classroom.members?.length === 1
            ? "Member"
            : "Members"}

        </div>


        <button
          onClick={() =>
            router.push(
              `/classroom/${classroom._id}`
            )
          }
          className="group/button mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 font-bold text-black transition hover:bg-slate-200"
        >

          Open Classroom

          <ArrowRight
            size={17}
            className="transition group-hover/button:translate-x-1"
          />

        </button>

      </div>

    </div>
  );
}

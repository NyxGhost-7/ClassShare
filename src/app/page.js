
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {ArrowRight,BookOpen,Globe2,Loader2,Users,} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPublicClassrooms();
  }, []);

  const loadPublicClassrooms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/classroom/public", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load public classrooms"
        );
      }

      setClassrooms(
        Array.isArray(data?.classrooms)
          ? data.classrooms
          : []
      );
    } catch (error) {
      console.error("PUBLIC CLASSROOM ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading classrooms."
      );

      setClassrooms([]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToClassrooms = () => {
    document
      .getElementById("public-classrooms")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
  



      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Go to ClassShare home"
          className="group flex items-center gap-3"
        >
          <div className="text-left">
            <h1 className="text-xl font-bold tracking-tight">
              Class
             <span className="bg-gradient-to-r from-indigo-100 via-green-200 to-pink-400 bg-clip-text text-transparent">Share</span>
            </h1>

            <p className="text-xs text-white/40">
              Learn. Share. Grow.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="group flex items-center gap-2 rounded-sm  px-5 py-2.5 text-sm font-semibold backdrop-blur-xl transition hover:border-white/20 hover:bg-midnight-900/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
        >
          Open Dashboard

          <ArrowRight
            size={16}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </nav>

   

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-10 text-center lg:px-8">
   
    <h2 className="mt-6 max-w-5xl font-poppins text-5xl font-bold leading-[1.02] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-8xl">
      Your classroom.
      <br />

      <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-green-400 bg-clip-text font-extrabold text-transparent">
        Connected.
      </span>

      <br />

      <span className="font-semibold text-white/90">
        Organized.
      </span>
    </h2>

        {/* Description */}

      <p className="mt-8 max-w-2xl font-poppins text-base leading-relaxed text-slate-300 sm:text-lg">
        Create your digital classroom and bring
        everything together. Share notes,
        assignments, documents, videos and useful
        resources with your classmates — instantly.
      </p>

        {/* CTA */}

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="group flex items-center gap-3 rounded-[4.5px] bg-white px-7 py-4 font-bold text-slate-900 shadow-2xl shadow-indigo-500/20 transition duration-300 hover:scale-105 hover:bg-slate-100"
          >
            Start Sharing

            <ArrowRight
              size={20}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>

          <button
            type="button"
            onClick={scrollToClassrooms}
            className="rounded-sm border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
          >
            Explore Classrooms
          </button>
        </div>

        {/* Small trust text */}

        <div className="mt-16 flex items-center gap-3 text-sm text-white/30">
          <div className="h-px w-10 bg-white/10" />

          <span>
            Built for collaborative learning
          </span>

          <div className="h-px w-10 bg-white/10" />
        </div>
      </section>

      <section
        id="public-classrooms"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-10 px-6 py-24 lg:px-8"
      >
        {/* SECTION HEADER */}

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-slate-500">
              <Globe2
                size={17}
                aria-hidden="true"
              />

              <span>EXPLORE CLASSROOMS</span>
            </div>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Learn from the community.
            </h2>

            <p className="mt-3 max-w-xl text-slate-400">
              Explore public classrooms created by
              students and teachers. No invitation
              code required.
            </p>
          </div>

          {!loading && !error && (
            <div className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
              {classrooms.length}{" "}
              {classrooms.length === 1
                ? "Classroom"
                : "Classrooms"}
            </div>
          )}
        </div>
      {loading && (
          <div className="flex justify-center py-24">
            <div className="text-center">
              <Loader2
                size={35}
                aria-hidden="true"
                className="mx-auto animate-spin text-slate-500"
              />

              <p className="mt-4 text-sm text-slate-500">
                Loading classrooms...
              </p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="mt-12 rounded-3xl border border-red-400/10 bg-red-400/[0.04] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/10 bg-red-400/5">
              <BookOpen
                size={28}
                className="text-red-300"
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-6 text-xl font-bold">
              Unable to load classrooms
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={loadPublicClassrooms}
              className="mt-7 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-105 hover:bg-slate-200"
            >
              Try Again
            </button>
          </div>
        )}


        {!loading &&
          !error &&
          classrooms.length === 0 && (
            <div className="mt-12 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <BookOpen
                  size={28}
                  className="text-slate-400"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                No public classrooms yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-slate-500">
                Create a classroom and share your
                knowledge with everyone.
              </p>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-105 hover:bg-slate-200"
              >
                Create Classroom

                <ArrowRight
                  size={17}
                  aria-hidden="true"
                />
              </button>
            </div>
          )}


        {!loading &&
          !error &&
          classrooms.length > 0 && (
            <div className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {classrooms.map((classroom) => (
                <PublicClassroomCard
                  key={classroom._id}
                  classroom={classroom}
                  onOpen={() =>
                    router.push(
                      `/classroom/${classroom._id}`
                    )
                  }
                />
              ))}
            </div>
          )}
      </section>

      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ClassShare.
        <span className="mx-1">•</span>
        Learn. Share. Grow.
      </footer>
    </main>
  );
}


function PublicClassroomCard({
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


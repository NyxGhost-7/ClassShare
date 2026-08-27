"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Plus,
  LogIn,
  Users,
  BookOpen,
  X,
  Hash,
  ArrowRight,
  GraduationCap,
  Globe,
  Lock,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import ClassroomCard from "../../Components/ClassroomCard";

export default function Dashboard() {
  const router = useRouter();

  const {
    data: session,
    status,
  } = useSession();

  const [classrooms, setClassrooms] =
    useState([]);

  const [showCreate, setShowCreate] =
    useState(false);

  const [showJoin, setShowJoin] =
    useState(false);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [code, setCode] =
    useState("");

  const [privacy, setPrivacy] =
    useState("private");

  const [loading, setLoading] =
    useState(false);

  const [loadingClassrooms, setLoadingClassrooms] =
    useState(true);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);


  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    fetchClassrooms();
  }, [status]);

  const fetchClassrooms = async () => {
    try {
      setLoadingClassrooms(true);

      const response = await fetch(
        "/api/classroom",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        console.error(
          data.message ||
            "Failed to load classrooms"
        );

        return;
      }

      setClassrooms(
        data.classrooms || []
      );
    } catch (error) {
      console.error(
        "FETCH CLASSROOMS ERROR:",
        error
      );
    } finally {
      setLoadingClassrooms(false);
    }
  };


  const createClassroom = async () => {
    if (!name.trim()) {
      alert(
        "Please enter a classroom name"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/classroom/create",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            description:
              description.trim(),
            privacy,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to create classroom"
        );

        return;
      }

      // Add classroom immediately
      setClassrooms((prev) => [
        data.classroom,
        ...prev,
      ]);

      // Reset form
      setName("");
      setDescription("");
      setPrivacy("private");

      setShowCreate(false);

      // Show private code
      if (
        data.classroom.privacy ===
        "private"
      ) {
        alert(
          `Classroom created successfully!\n\nYour classroom code:\n${data.classroom.code}`
        );
      }
    } catch (error) {
      console.error(
        "CREATE CLASSROOM ERROR:",
        error
      );

      alert(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // JOIN CLASSROOM
  // =========================

  const joinClassroom = async () => {
    if (!code.trim()) {
      alert(
        "Please enter a classroom code"
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/classroom/join",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            code: code
              .trim()
              .toUpperCase(),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to join classroom"
        );

        return;
      }

      setCode("");
      setShowJoin(false);

      // Refresh classroom list
      await fetchClassrooms();

      router.push(
        `/classroom/${data.classroom._id}`
      );
    } catch (error) {
      console.error(
        "JOIN CLASSROOM ERROR:",
        error
      );

      alert(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };


  if (
    status === "loading" ||
    loadingClassrooms
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-indigo-400" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your classroom...
          </p>
        </div>
      </div>
    );
  }


  if (!session) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      <div className="relative z-10">

        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <section className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>

              <p className="mb-3 text-sm font-medium text-indigo-400">
                Welcome back,{" "}
                {session.user?.name?.split(" ")[0]}
                
              </p>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">

                Your Learning

                <span className="block bg-gradient-to-r from-indigo-100 via-green-400 to-pink-400 bg-clip-text text-transparent">
                  Universe.
                </span>

              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
                Create classrooms, collaborate
                with your classmates, and keep
                all your study resources organized
                in one beautiful workspace.
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() =>
                  setShowJoin(true)
                }
                className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-200 transition hover:border-indigo-400/30 hover:bg-white/10"
              >
                <LogIn size={18} />

                Join Classroom

                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() =>
                  setShowCreate(true)
                }
                className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-black to-gray-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.03]"
              >
                <Plus
                  size={19}
                  className="transition group-hover:rotate-90"
                />

                Create Classroom
              </button>

            </div>

          </section>



          <section className="mt-10 grid gap-4 sm:grid-cols-3">

            <StatCard
              icon={
                <GraduationCap
                  size={20}
                />
              }
              value={classrooms.length}
              label="My Classrooms"
            />

            <StatCard
              icon={
                <BookOpen
                  size={20}
                />
              }
              value="0"
              label="Shared Resources"
            />

            <StatCard
              icon={
                <Users
                  size={20}
                />
              }
              value="0"
              label="Learning Together"
            />

          </section>

          {/* =========================
              CLASSROOMS
          ========================= */}

          <section className="mt-12">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold">
                  Your Classrooms
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  All your learning spaces in
                  one place.
                </p>

              </div>

              {classrooms.length > 0 && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-400">
                  {classrooms.length} Total
                </span>
              )}

            </div>

            {classrooms.length === 0 ? (

              <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-20 text-center">

                <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[80px]" />

                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                  <BookOpen size={34} />
                </div>

                <h2 className="relative mt-6 text-2xl font-bold">
                  Your learning journey starts
                  here
                </h2>

                <p className="relative mx-auto mt-3 max-w-md leading-relaxed text-slate-400">
                  Create your own classroom and
                  invite others, or join an existing
                  classroom using a code.
                </p>

                <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                  <button
                    onClick={() =>
                      setShowCreate(true)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-105"
                  >
                    <Plus size={18} />
                    Create Classroom
                  </button>

                  <button
                    onClick={() =>
                      setShowJoin(true)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold transition hover:bg-white/10"
                  >
                    <Hash size={18} />
                    Enter Code
                  </button>

                </div>

              </div>

            ) : (

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {classrooms.map(
                  (classroom) => (
                    <ClassroomCard
                      key={classroom._id}
                      classroom={classroom}
                    />
                  )
                )}

              </div>

            )}

          </section>

        </main>

      </div>

      {/* =========================
          CREATE MODAL
      ========================= */}

      {showCreate && (

        <Modal
          title="Create Classroom"
          subtitle="Build a new space for your class and start sharing knowledge."
          onClose={() =>
            setShowCreate(false)
          }
        >

          <div className="mt-7 space-y-5">

            {/* NAME */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Classroom Name
              </label>

              <input
                type="text"
                placeholder="e.g. Computer Science A"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10"
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">

                Description

                <span className="ml-1 text-slate-500">
                  (optional)
                </span>

              </label>

              <textarea
                placeholder="What is this classroom about?"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                className="h-24 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10"
              />

            </div>

            {/* PRIVACY */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Classroom Privacy
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* PUBLIC */}

                <button
                  type="button"
                  onClick={() =>
                    setPrivacy("public")
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    privacy === "public"
                      ? "border-indigo-400/50 bg-indigo-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >

                  <div className="flex items-center gap-2">

                    <Globe
                      size={18}
                      className="text-indigo-400"
                    />

                    <span className="font-semibold">
                      Public
                    </span>

                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    Anyone can discover and
                    join.
                  </p>

                </button>

                {/* PRIVATE */}

                <button
                  type="button"
                  onClick={() =>
                    setPrivacy("private")
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    privacy === "private"
                      ? "border-purple-400/50 bg-purple-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >

                  <div className="flex items-center gap-2">

                    <Lock
                      size={18}
                      className="text-purple-400"
                    />

                    <span className="font-semibold">
                      Private
                    </span>

                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    Members need a classroom
                    code.
                  </p>

                </button>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="flex gap-3 pt-2">

              <button
                onClick={() =>
                  setShowCreate(false)
                }
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 font-semibold transition hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={createClassroom}
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-gray-800 via-gray-500 to-gray-600 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating..."
                  : "Create Classroom"}
              </button>

            </div>

          </div>

        </Modal>

      )}

      {/* =========================
          JOIN MODAL
      ========================= */}

      {showJoin && (

        <Modal
          title="Join Classroom"
          subtitle="Enter the unique classroom code shared with you."
          onClose={() =>
            setShowJoin(false)
          }
        >

          <div className="mt-7">

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Classroom Code
            </label>

            <div className="relative">

              <Hash
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
              />

              <input
                type="text"
                placeholder="CLS-AB1234"
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value
                      .toUpperCase()
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 font-mono tracking-wider text-white uppercase outline-none placeholder:text-slate-600 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10"
              />

            </div>

            <p className="mt-3 text-xs text-slate-500">
              Example: CLS-AB1234
            </p>

            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  setShowJoin(false)
                }
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 font-semibold transition hover:bg-white/10"
              >
                Cancel
              </button>

              <button
                onClick={joinClassroom}
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-black to-gray-600 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Joining..."
                  : "Join Classroom"}
              </button>

            </div>

          </div>

        </Modal>

      )}

    </div>
  );
}


/* =========================
   STAT CARD
========================= */

function StatCard({
  icon,
  value,
  label,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.06]">

      <div className="flex items-center justify-between">

        <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-300">
          {icon}
        </div>

        <span className="text-3xl font-bold">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm text-slate-500">
        {label}
      </p>

    </div>
  );
}


/* =========================
   MODAL
========================= */

function Modal({
  title,
  subtitle,
  onClose,
  children,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* BACKDROP */}

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* MODAL */}

      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 bg-black p-7 shadow-2xl">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        <p className="mt-2 pr-6 text-sm leading-relaxed text-slate-400">
          {subtitle}
        </p>

        {children}

      </div>

    </div>
  );
}
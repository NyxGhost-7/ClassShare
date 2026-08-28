"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Copy,
  Check,
  Hash,
  FolderOpen,
  Share2,
  Loader2,
} from "lucide-react";

import Navbar from "../../../components/Navbar";
import ResourceCard from "../../../components/ResourceCard";

export default function ClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  // Folder is [classId]
  const classroomId = params.classId;

  const [classroom, setClassroom] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (classroomId) {
      loadClassroom();
    }
  }, [classroomId]);

  const loadClassroom = async () => {
    try {
      setLoading(true);

      const classroomResponse = await fetch(
        `/api/classroom?id=${classroomId}`
      );

      const classroomData =
        await classroomResponse.json();

      if (!classroomResponse.ok) {
        console.error(
          classroomData.message ||
          "Failed to load classroom"
        );

        setClassroom(null);
        return;
      }

      setClassroom(classroomData.classroom);

      const resourceResponse = await fetch(
        `/api/resource?classroomId=${classroomId}`
      );

      const resourceData =
        await resourceResponse.json();

      if (!resourceResponse.ok) {
        console.error(
          resourceData.message ||
          "Failed to load resources"
        );

        setResources([]);
        return;
      }

      setResources(
        resourceData.resources || []
      );

    } catch (error) {
      console.error(
        "CLASSROOM LOAD ERROR:",
        error
      );

      setClassroom(null);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    try {
      const inviteUrl =
        `${window.location.origin}/classroom/${classroomId}`;

      await navigator.clipboard.writeText(
        inviteUrl
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error(
        "Failed to copy link",
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">

          <Loader2
            size={36}
            className="mx-auto animate-spin text-slate-400"
          />

          <p className="mt-4 text-sm text-slate-500">
            Loading classroom...
          </p>

        </div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">

          <h1 className="text-2xl font-bold">
            Classroom not found
          </h1>

          <p className="mt-2 text-slate-500">
            This classroom may have been deleted
            or does not exist.
          </p>

          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">

        <button
          onClick={() =>
            router.push("/dashboard")
          }
          className="group mb-8 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft
            size={17}
            className="transition group-hover:-translate-x-1"
          />

          Back to Dashboard
        </button>

        {/* CLASSROOM HEADER */}

        <section className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:p-8">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03] blur-[80px]" />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">

            <div className="max-w-2xl">

              <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-slate-500">
                <BookOpen size={16} />

                CLASSROOM
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                {classroom.name}
              </h1>

              <div className="mt-2 h-[2px] w-20 bg-gradient-to-r from-indigo-100 via-green-400 to-pink-400" />

              <p className="mt-5 max-w-xl leading-relaxed text-slate-400">
                {classroom.description ||
                  "Welcome to the classroom. Start exploring and sharing learning resources with everyone."}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <Share2 size={15} />

                Share resources. Learn together.
              </div>

            </div>

            {/* CLASS CODE */}

            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-5 md:w-[230px]">

              <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-slate-500">
                <Hash size={14} />

                CLASS CODE
              </div>

              <p className="mt-4 font-mono text-2xl font-bold tracking-[0.15em] text-white">
                {classroom.code || "PRIVATE"}
              </p>

              <button
                onClick={copyLink}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
                  copied
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Link Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Invite Link
                  </>
                )}
              </button>

            </div>

          </div>
        </section>

        {/* RESOURCES */}

        <section className="mt-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <FolderOpen size={16} />

              RESOURCE LIBRARY
            </div>

            <h2 className="mt-3 text-3xl font-bold">
              Learning Resources
            </h2>

            <p className="mt-2 text-slate-500">
              Notes, documents, videos and useful links — all in one place.
            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                `/upload?classroomId=${classroomId}`
              )
            }
            className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-black to-gray-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.03]"
          >
            <Plus
              size={19}
              className="transition group-hover:rotate-90"
            />

            Add Resource
          </button>

        </section>

        {/* RESOURCE COUNT */}

        {resources.length > 0 && (
          <div className="mt-8 flex items-center gap-3">

            <span className="h-px flex-1 bg-white/10" />

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-500">
              {resources.length}{" "}
              {resources.length === 1
                ? "Resource"
                : "Resources"}
            </span>

            <span className="h-px flex-1 bg-white/10" />

          </div>
        )}

        {/* RESOURCE LIST */}

        <section className="mt-8">

          {resources.length === 0 ? (

            <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-20 text-center">

              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-slate-300">
                <FolderOpen size={34} />
              </div>

              <h3 className="relative mt-6 text-2xl font-bold">
                No resources yet
              </h3>

              <p className="relative mx-auto mt-3 max-w-md leading-relaxed text-slate-500">
                This classroom is waiting for
                its first resource.
              </p>

              <button
                onClick={() =>
                  router.push(
                    `/upload?classroomId=${classroomId}`
                  )
                }
                className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-105"
              >
                <Plus size={18} />

                Add First Resource
              </button>

            </div>

          ) : (

            <div className="space-y-4">

              {resources.map((resource) => (
                <ResourceCard
                   key={resource._id}
                    resource={resource}
                    currentUserId={session?.user?.id}
                    classroomHostId={
                      classroom.host?._id ||
                      classroom.host
                    }
                    onDelete={(resourceId) => {
                      setResources((previous) =>
                        previous.filter(
                          (resource) =>
                            resource._id !== resourceId
                        )
                      );
                    }}
                />
              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}
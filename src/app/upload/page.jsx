"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";

import Navbar from "../../Components/Navbar";
import UploadResource from "../../Components/UploadResource";

export default function UploadPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const classroomId = searchParams.get("classroomId");

  if (!classroomId) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-slate-300">
              <AlertCircle size={34} />
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              Classroom not specified
            </h1>

            <p className="mt-3 leading-relaxed text-slate-500">
              We couldn't find the classroom you want to upload
              this resource to. Please return to your dashboard
              and select a classroom.
            </p>

            <button
              onClick={() => router.push("/dashboard")}
              className="group mx-auto mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-black to-gray-600 px-5 py-3 font-semibold text-white transition hover:scale-[1.03]"
            >
              <LayoutDashboard size={18} />

              Go to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 py-10 lg:px-8">

        {/* BACK BUTTON */}

        <button
          onClick={() =>
            router.push(`/classroom/${classroomId}`)
          }
          className="group mb-10 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft
            size={17}
            className="transition group-hover:-translate-x-1"
          />

          Back to Classroom
        </button>


        {/* PAGE HEADER */}

        <section className="mb-10">
          <div className="flex items-center gap-2 text-sm font-medium tracking-wider text-slate-500">
            <Upload size={16} />

            RESOURCE LIBRARY
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Share Something

            <span className="block bg-gradient-to-r from-indigo-100 via-green-400 to-pink-400 bg-clip-text text-transparent">
              Valuable.
            </span>
          </h1>

          <p className="mt-5 max-w-xl leading-relaxed text-slate-400">
            Upload notes, documents, videos or useful links and
            make them available to everyone in your classroom.
          </p>
        </section>


        {/* UPLOAD COMPONENT */}

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
          <UploadResource classroomId={classroomId} />
        </section>

      </main>
    </div>
  );
}
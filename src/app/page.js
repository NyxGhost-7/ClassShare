"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Users,
  Video,
  Link as LinkIcon,
  Sparkles,
  GraduationCap,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
    

      {/* Navbar */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <div className="flex items-center gap-3">
         

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Class<span className="text-indigo-400 ">Share</span>
            </h1>
            <p className="text-xs text-white/40">
              Learn. Share. Grow.
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
        >
          Open Dashboard
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-10 text-center">
        {/* Badge */}
     

        {/* Heading */}
        <h2 className="max-w-5xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Your classroom.
          <br />

          <span className="bg-gradient-to-r from-purple-400 via-green-400 to-pink-400 bg-clip-text text-transparent">
            Connected.
          </span>{" "}

          <span className="text-white">Organized.</span>
        </h2>

        {/* Description */}
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Create your digital classroom and bring everything together.
          Share notes, assignments, documents, videos and useful resources
          with your classmates — instantly.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={() => router.push("/dashboard")}
            className="group flex items-center gap-3 rounded-2xl bg-white px-7 py-4 font-bold text-slate-900 shadow-2xl shadow-indigo-500/20 transition duration-300 hover:scale-105"
          >
            Start Sharing
            <ArrowRight
              size={20}
              className="transition group-hover:translate-x-1"
            />
          </button>

          <button
            className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
          >
            Explore Features
          </button>
        </div>

        {/* Feature Cards */}
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

        {/* Bottom Floating UI */}
        <div className="relative mt-16 w-full max-w-4xl">
          <div className="absolute -left-8 top-10 hidden rotate-[-8deg] rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl lg:block">
            <BookOpen className="mb-2 text-indigo-400" size={22} />
            <p className="text-sm font-semibold">
              DBMS Notes
            </p>
            <p className="text-xs text-white/40">
              Added just now
            </p>
          </div>

          <div className="absolute -right-8 top-20 hidden rotate-[8deg] rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl lg:block">
            <Users className="mb-2 text-purple-400" size={22} />
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
    </main>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-indigo-400/30 hover:bg-white/[0.08]">
      <div className="mb-4 w-fit rounded-xl bg-indigo-500/15 p-3 text-indigo-300 transition group-hover:scale-110">
        {icon}
      </div>

      <h3 className="font-bold">{title}</h3>

      <p className="mt-1 text-sm text-white/40">
        {text}
      </p>
    </div>
  );
}

function DashboardItem({ title, files }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:bg-white/10">
      <div className="mb-8 flex items-center justify-between">
        <div className="rounded-xl bg-indigo-500/15 p-2 text-indigo-300">
          <BookOpen size={20} />
        </div>

        <span className="h-2 w-2 rounded-full bg-green-400" />
      </div>

      <h4 className="font-semibold">{title}</h4>

      <p className="mt-1 text-sm text-white/40">
        {files}
      </p>
    </div>
  );
}
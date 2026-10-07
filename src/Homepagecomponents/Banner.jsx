
"use client";

import React from "react";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const Banner = () => {
  const router = useRouter();

  const scrollToClassrooms = () => {
    document.getElementById("public-classrooms")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
   <div className="mx-auto flex" >
     <section className="relative mx-auto max-w-7xl px-6 pb-1 pt-6 sm:pt-20 lg:px-8 lg:pb-3 lg:pt-12">
      {/* Background glow */}
    

    

      {/* Heading */}
      <h1 className="max-w-5xl font-poppins text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
        Your classroom.
        <br />

        <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-green-400 bg-clip-text font-extrabold text-transparent">
          Connected.
        </span>

        <br />

        <span className="text-white/90">Organized.</span>
      </h1>

      {/* Description */}
      <p className="mt-8 max-w-2xl font-poppins text-base leading-8 text-slate-300/80 sm:text-lg">
        Create your digital classroom and bring everything together.
        Share notes, assignments, documents, videos, and useful resources
        with your classmates — all in one place.
      </p>

      {/* CTA */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        {/* Primary */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="group inline-flex items-center justify-center gap-3 rounded-lg bg-white px-7 py-4 font-poppins text-sm font-bold text-slate-950 shadow-xl shadow-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-2xl sm:text-base"
        >
          Start Sharing

          <ArrowRight
            size={19}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>

        {/* Secondary */}
        <button
          type="button"
          onClick={scrollToClassrooms}
          className="group inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-7 py-4 font-poppins text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08] sm:text-base"
        >
          <BookOpen
            size={18}
            className="text-white/60 transition-colors group-hover:text-pink-400"
          />

          Explore Classrooms
        </button>

        {/* Description */}
        <button
          type="button"
          onClick={() => router.push("/description")}
          className="group inline-flex items-center justify-center gap-3 rounded-lg border border-pink-400/20 bg-pink-500/[0.06] px-7 py-4 font-poppins text-sm font-semibold text-pink-100 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/40 hover:bg-pink-500/10 sm:text-base"
        >
          Write Description

          <ArrowRight
            size={19}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* Bottom trust section */}
      <div className="mt-16 flex max-w-xl mx-auto items-center gap-4 text-white/30">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />

        <span className="whitespace-nowrap font-poppins text-xs font-medium tracking-wide text-white/40 sm:text-sm">
          Simple • Collaborative • Organized
        </span>

        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
      </div>
    </section>
   </div>
  );
};

export default Banner;

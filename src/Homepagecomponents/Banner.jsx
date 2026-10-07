import React from 'react'
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
const Banner = () => {
  const router = useRouter();
   const scrollToClassrooms = () => {
    document
      .getElementById("public-classrooms")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };
  return (
    <div>
      
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
          <button
            type="button"
            onClick={()=>{router.push("/description")}}
            className="group flex items-center gap-3 rounded-[4.5px] bg-white px-7 py-4 font-bold text-slate-900 shadow-2xl shadow-indigo-500/20 transition duration-300 hover:scale-105 hover:bg-slate-100"
        

          >
            Write description
             <ArrowRight
              size={20}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Small trust text */}

        <div className="mt-16 flex items-center gap-3 text-sm text-white/30">
          <div className="h-px w-10 bg-white/10" />

          <span className="font-semibold text-white/50 mx-auto">
            Built for collaborative learning
          </span>

          <div className="h-px w-10 bg-white/10" />
        </div>
    </div>
  )
}

export default Banner

import React from 'react'
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
const Navbar = () => {
  const router = useRouter();
  return (
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

   
  )
}

export default Navbar

import React from 'react'
import { Globe2 } from 'lucide-react';
const Middlebanner = () => {
  return (
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
  )
}

export default Middlebanner

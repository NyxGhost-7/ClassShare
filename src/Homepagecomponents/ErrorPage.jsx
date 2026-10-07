import React from 'react'
import {BookOpen} from "lucide-react";

const ErrorPage = ({error, loadPublicClassrooms}) => {

  
  return (
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
  )
}

export default ErrorPage

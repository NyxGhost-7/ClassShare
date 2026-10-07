import React from 'react'
import { BookOpen, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
const NoClassroom = () => {
  const router = useRouter();
  return (
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
  )
}

export default NoClassroom

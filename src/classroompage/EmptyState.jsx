import React from 'react'
import { FolderOpen , Plus } from 'lucide-react'
import { useRouter } from 'next/router'
const EmptyState = () => {
    const router = useRouter();
  return (
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
  )
}

export default EmptyState

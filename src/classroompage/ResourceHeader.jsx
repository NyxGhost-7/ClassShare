import React from 'react'
import { FolderOpen, Plus } from 'lucide-react';
import {useRouter} from "next/navigation";
const ResourceHeader = () => {
  const router = useRouter();
  return (
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
              Notes, documents, videos and useful links —
              all in one place.
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
  )
}

export default ResourceHeader

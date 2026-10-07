import { Frown } from 'lucide-react'
import { useRouter } from 'next/router'
import React from 'react'
// imprt {useRouter} from ""
// import { useRouter } from 'next/router'
const ClassRoomNotFound = () => {
    const router = useRouter();
  return (
     <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Classroom not found
          </h1>

          <p className="mt-2 text-slate-500">
            This classroom may have been deleted
            or does not exist.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-slate-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
  )
}

export default ClassRoomNotFound

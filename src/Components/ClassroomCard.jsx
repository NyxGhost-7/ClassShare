"use client";

import { useRouter } from "next/navigation";

export default function ClassroomCard({ classroom }) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
          
        </div>

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
          {classroom.code}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold text-gray-800">
        {classroom.name}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
        {classroom.description ||
          "No description available"}
      </p>

      <button
        onClick={() =>
          router.push(
            `/classroom/${classroom._id}`
          )
        }
        className="mt-5 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white"
      >
        Open Classroom
      </button>
    </div>
  );
}
"use client";

export default function ResourceCard({ resource }) {
  const icons = {
    pdf: "📕",
    doc: "📘",
    docx: "📘",
    ppt: "📙",
    pptx: "📙",
    image: "🖼️",
    link: "🔗",
    video: "🎥",
    other: "📄",
  };

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
          {icons[resource.type] || "📄"}
        </div>

        <div>
          <h3 className="font-bold text-gray-800">
            {resource.title}
          </h3>

          {resource.description && (
            <p className="mt-1 text-sm text-gray-500">
              {resource.description}
            </p>
          )}

          <p className="mt-1 text-xs text-gray-400">
            {new Date(
              resource.createdAt
            ).toLocaleDateString()}
          </p>
        </div>
      </div>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-semibold text-white"
      >
        Open
      </a>
    </div>
  );
}
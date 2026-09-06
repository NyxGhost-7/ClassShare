import { Suspense } from "react";
import ResourcesClient from "./ResourcesClient";

export default function ResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          Loading resources...
        </div>
      }
    >
      <ResourcesClient />
    </Suspense>
  );
}
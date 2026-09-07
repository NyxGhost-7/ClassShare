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

// 533695496621391 hCIpoJP4mSFHAx7_7KXSr-mKFJY 
// CLOUDINARY_URL=cloudinary://533695496621391:hCIpoJP4mSFHAx7_7KXSr-mKFJY@zchzshzd
// zchzshzd
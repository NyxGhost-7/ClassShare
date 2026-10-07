
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {ArrowRight,Ban,BookOpen,Globe2,Loader2,Users,} from "lucide-react";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import Navbar from "@/Homepagecomponents/Navbar";
import Banner from "@/Homepagecomponents/Banner";

import Footer from "@/Homepagecomponents/Footer";
import ClassesPage from "@/Homepagecomponents/ClassesPage";
export default function Home() {
  const router = useRouter();

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  loadPublicClassrooms();

  const handleClassroomCreated = (event) => {
    const classroom = event.detail;

    if (!classroom || classroom.privacy !== "public") {
      return;
    }

    setClassrooms((prev) => {
      // duplicate protection
      if (
        prev.some(
          (item) => item._id === classroom._id
        )
      ) {
        return prev;
      }

      return [classroom, ...prev];
    });
  };

  window.addEventListener(
    "classroom-created",
    handleClassroomCreated
  );

  return () => {
    window.removeEventListener(
      "classroom-created",
      handleClassroomCreated
    );
  };
}, []);

  const loadPublicClassrooms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/classroom/public", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load public classrooms"
        );
      }

      setClassrooms(
        Array.isArray(data?.classrooms)
          ? data.classrooms
          : []
      );
    } catch (error) {
      console.error("PUBLIC CLASSROOM ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading classrooms."
      );

      setClassrooms([]);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
  
    <Analytics />
    <SpeedInsights />

    <Navbar/>
       <section className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center justify-center px-6 pb-20 pt-10 text-center lg:px-8">
   
    <Banner/>
      </section>

      <ClassesPage
        loading={loading}
        error={error}
        classrooms={classrooms}
        loadPublicClassrooms={loadPublicClassrooms}
      />

          <Footer/>
    </main>
  );
}


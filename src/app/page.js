
"use client";

import { useEffect, useState } from "react";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "@/Homepagecomponents/Navbar";
import Banner from "@/Homepagecomponents/Banner";
import ClassesPage from "@/Homepagecomponents/ClassesPage";
import Footer from "@/Homepagecomponents/Footer";

export default function Home() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  const loadPublicClassrooms = async (signal) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/classroom/public", {
        method: "GET",
        cache: "no-store",
        signal,
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
      // Ignore aborted requests
      if (error?.name === "AbortError") {
        return;
      }

      console.error("PUBLIC CLASSROOM ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while loading classrooms."
      );

      setClassrooms([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };


  useEffect(() => {
    const controller = new AbortController();

    loadPublicClassrooms(controller.signal);

    const handleClassroomCreated = (event) => {
      const classroom = event.detail;

      // Only public classrooms should appear
      if (!classroom || classroom.privacy !== "public") {
        return;
      }

      setClassrooms((prev) => {
        // Prevent duplicate classrooms
        const alreadyExists = prev.some(
          (item) => item._id === classroom._id
        );

        if (alreadyExists) {
          return prev;
        }

        // Add newest classroom at the top
        return [classroom, ...prev];
      });
    };

    window.addEventListener(
      "classroom-created",
      handleClassroomCreated
    );

    return () => {
      controller.abort();

      window.removeEventListener(
        "classroom-created",
        handleClassroomCreated
      );
    };
  }, []);

  return (
    <main className="relative min-h-screen mx-auto flex flex-col overflow-hidden bg-black text-white">
      {/* Vercel monitoring */}
      <Analytics />
      <SpeedInsights />

      {/* Navigation */}
      <div> <Navbar /> </div>

      {/* Hero */}
  

      <Banner />
  
      
      

      {/* Public Classrooms */}
      <section
        id="public-classrooms"
        className="relative z-10"
      >
        <ClassesPage
          loading={loading}
          error={error}
          classrooms={classrooms}
          loadPublicClassrooms={() => loadPublicClassrooms()}
        />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
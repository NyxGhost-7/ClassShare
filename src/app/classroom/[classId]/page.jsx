"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Navbar from "../../../components/Navbar";
import Main from "@/classroompage/Main";
import ClassRoomNotFound from "@/classroompage/ClassRoomNotFound";
import Loading from "@/Homepagecomponents/Loading";
import { Copyleft } from "lucide-react";

export default function ClassroomPage() {
  const params = useParams();
  
  const { data: session } = useSession();

  const classroomId = params.classId;

  const [classroom, setClassroom] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadClassroom = useCallback(async () => {
    if (!classroomId) return;

    try {
      setLoading(true);

      const classroomResponse = await fetch(
        `/api/classroom?id=${classroomId}`,
        {
          cache: "no-store",
        }
      );

      const classroomData = await classroomResponse.json();

      if (!classroomResponse.ok) {
        console.error(
          classroomData.message || "Failed to load classroom"
        );

        setClassroom(null);
        return;
      }

      setClassroom(classroomData.classroom);

      const resourceResponse = await fetch(
        `/api/resource?classroomId=${classroomId}`,
        {
          cache: "no-store",
        }
      );

      const resourceData = await resourceResponse.json();

      if (!resourceResponse.ok) {
        console.error(
          resourceData.message || "Failed to load resources"
        );

        setResources([]);
        return;
      }

      setResources(resourceData.resources || []);
    } catch (error) {
      console.error("CLASSROOM LOAD ERROR:", error);

      setClassroom(null);
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    loadClassroom();
  }, [loadClassroom]);


  useEffect(() => {
    const handleResourceUploaded = (event) => {
      const uploadedResource = event.detail;

      if (!uploadedResource) {
        return;
      }

      // Make sure resource belongs to this classroom
      const uploadedClassroomId =
        uploadedResource.classroom?._id ||
        uploadedResource.classroom;

      if (
        String(uploadedClassroomId) !== String(classroomId)
      ) {
        return;
      }

      setResources((previousResources) => {
        // Prevent duplicate resource
        const alreadyExists = previousResources.some(
          (resource) =>
            String(resource._id) ===
            String(uploadedResource._id)
        );

        if (alreadyExists) {
          return previousResources;
        }

        // New resource appears at top
        return [
          uploadedResource,
          ...previousResources,
        ];
      });
    };

    window.addEventListener(
      "resource-uploaded",
      handleResourceUploaded
    );

    return () => {
      window.removeEventListener(
        "resource-uploaded",
        handleResourceUploaded
      );
    };
  }, [classroomId]);

  const copyLink = async () => {
    try {
      const inviteUrl =
        `${window.location.origin}/classroom/${classroomId}`;

      await navigator.clipboard.writeText(inviteUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "FAILED TO COPY LINK:",
        error
      );
    }
  };

 
  if (loading) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-indigo-400" />
      <Loading/>
          
        </div>
      </div> 
    );
  }
{/* <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-indigo-400" />

          
        </div>
      </div> */}
 
  if (!classroom) {
    return (
     <ClassRoomNotFound/>
    );
  }


  return (
    <div className="min-h-screen bg-black text-white">

      <Navbar />

     <Main classroom={classroom} copied={copied} copyLink={copyLink} resources={resources} session={session} setResources={setResources} classroomId={classroomId} />

    </div>
  );
}
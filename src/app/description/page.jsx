"use client";

import { useState } from "react";

import HandoffHeader from "./HandoffHeader";
import HandoffTabs from "./HandoffTabs";
import DropOff from "./DropOff";
import PickUp from "./PickUp";
import Navbar from "./Navbar";

export default function Page() {
  const [activeTab, setActiveTab] = useState("drop");

  return (
    <main className="min-h-screen bg-[#08090a] px-5 text-zinc-100">
      <Navbar />

      <div className="mx-auto w-full max-w-[440px]">
        <HandoffHeader />

        <HandoffTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <section className="relative rounded-sm border border-white/10 bg-[#111315] px-7 py-8 shadow-2xl shadow-black/30">
       
          {activeTab === "drop" ? (
            <DropOff />
          ) : (
            <PickUp />
          )}
        </section>

        <p className="mt-4 max-w-[40ch] pl-1 text-xs leading-relaxed text-zinc-500">
          Shared text is temporary and accessible to anyone with the
          ClassShare code. Don't use it for passwords, PINs, or sensitive
          information.
        </p>
      </div>
    </main>
  );
}
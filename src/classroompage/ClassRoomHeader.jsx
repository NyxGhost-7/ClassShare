import React from 'react'
import {BookOpen, Share2, Hash, Copy, Check} from "lucide-react";
const ClassRoomPageHeader = ({classroom , copied, copyLink}) => {
  return (
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:p-8">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03] blur-[80px]" />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">

            {/* CLASSROOM INFORMATION */}

            <div className="max-w-2xl">

              <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-slate-500">
                <BookOpen size={16} />

                CLASSROOM
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                {classroom.name}
              </h1>

              <div className="mt-2 h-[2px] w-20 bg-gradient-to-r from-indigo-100 via-green-400 to-pink-400" />

              <p className="mt-5 max-w-xl leading-relaxed text-slate-400">
                {classroom.description ||
                  "Welcome to the classroom. Start exploring and sharing learning resources with everyone."}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <Share2 size={15} />

                Share resources. Learn together.
              </div>

            </div>

            {/* CLASS CODE */}

            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.05] p-5 md:w-[230px]">

              <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-slate-500">
                <Hash size={14} />

                CLASS CODE
              </div>

              <p className="mt-4 font-mono text-2xl font-bold tracking-[0.15em] text-white">
                {classroom.code || "PRIVATE"}
              </p>

              <button
                onClick={copyLink}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${
                  copied
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Link Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Invite Link
                  </>
                )}
              </button>

            </div>

          </div>
        </section>
  )
}

export default ClassRoomPageHeader

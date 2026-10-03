
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  FileText,
  Image as ImageIcon,
  Link2,
  MoreVertical,
  Paperclip,
  Plus,
  Send,
  ShieldCheck,
  Smile,
  Users,
  X,
} from "lucide-react";

const initialMessages = [
  {
    id: 1,
    name: "Ayush",
    text: "Hey everyone 👋",
    time: "10:00 AM",
    mine: true,
  },
  {
    id: 2,
    name: "Rahul",
    text: "Hey! Is this the new DropOff room?",
    time: "10:02 AM",
    mine: false,
  },
  {
    id: 3,
    name: "Sneha",
    text: "Yes 😄 You can just send anything here.",
    time: "10:03 AM",
    mine: false,
  },
  {
    id: 4,
    name: "Ayush",
    text: "Perfect. Let's test the sliding expiry window.",
    time: "10:05 AM",
    mine: true,
  },
];

const members = [
  { name: "Ayush", initials: "A", online: true },
  { name: "Rahul", initials: "R", online: true },
  { name: "Sneha", initials: "S", online: true },
  { name: "Karan", initials: "K", online: false },
];

export default function DropOff() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [showMembers, setShowMembers] = useState(true);
  const [showAttach, setShowAttach] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const messagesEndRef = useRef(null);

  /*
   * Sliding window:
   *
   * Every new message resets the expiry timer.
   * So if:
   *
   * 10:00 -> message
   * 10:05 -> message
   *
   * the room remains alive for another 24 hours
   * from the latest activity.
   */

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  function resetExpiryWindow() {
    setTimeLeft(24 * 60 * 60);
  }

  function sendMessage() {
    const trimmed = text.trim();

    if (!trimmed) return;

    const now = new Date();

    const newMessage = {
      id: Date.now(),
      name: "Ayush",
      text: trimmed,
      mine: true,
      time: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((previous) => [...previous, newMessage]);

    setText("");

    // Sliding expiry window
    resetExpiryWindow();

    /*
     * Later:
     *
     * socket.send(
     *   JSON.stringify({
     *     type: "message",
     *     text: trimmed
     *   })
     * );
     */
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex h-screen max-w-[1500px] overflow-hidden border-x border-white/[0.06] bg-[#0b0b0c]">
        {/* ================================================= */}
        {/* LEFT SIDEBAR */}
        {/* ================================================= */}

        <aside className="hidden w-[280px] shrink-0 border-r border-white/[0.07] bg-[#0d0d0e] md:flex md:flex-col">
          {/* Logo */}
          <div className="flex h-[76px] items-center gap-3 border-b border-white/[0.07] px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-emerald-400 text-sm font-black text-black">
              D
            </div>

            <div>
              <h1 className="text-[15px] font-semibold">DropOff</h1>
              <p className="text-[11px] text-zinc-500">
                Temporary conversations
              </p>
            </div>
          </div>

          {/* Room */}
          <div className="p-4">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  Current room
                </span>

                <button className="text-zinc-500 transition hover:text-white">
                  <MoreVertical size={17} />
                </button>
              </div>

              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-emerald-400/20">
                  <Users size={18} className="text-zinc-200" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    Development Team
                  </p>
                  <p className="text-xs text-zinc-500">
                    4 members
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-black/30 px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />

                <span className="text-xs text-zinc-400">
                  Room is active
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-600">
              Conversations
            </p>

            <button className="flex w-full items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-3 text-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06]">
                <Users size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">Development Team</p>
                <p className="text-xs text-zinc-500">
                  Active now
                </p>
              </div>

              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </button>
          </div>

          {/* Bottom */}
          <div className="mt-auto border-t border-white/[0.07] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-xs font-bold">
                A
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">Ayush</p>
                <p className="text-xs text-zinc-500">You</p>
              </div>

              <div className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
          </div>
        </aside>

        {/* ================================================= */}
        {/* MAIN CHAT */}
        {/* ================================================= */}

        <section className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#0b0b0c]/90 px-4 backdrop-blur-xl md:px-6">
            <div className="flex items-center gap-3">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/[0.05] hover:text-white md:hidden">
                <ArrowLeft size={18} />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-gradient-to-br from-pink-500/10 to-emerald-400/10">
                <Users size={18} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold">
                    Development Team
                  </h2>

                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
                    LIVE
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-zinc-500">
                  4 people in this room
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Expiry */}
              <div className="hidden items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 sm:flex">
                <Clock3 size={14} className="text-zinc-500" />

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-600">
                    Expires in
                  </p>

                  <p className="font-mono text-xs text-zinc-300">
                    {formatTime(timeLeft)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMembers(!showMembers)}
                className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
              >
                <Users size={16} />

                <span className="hidden text-xs sm:block">
                  Members
                </span>
              </button>

              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] text-zinc-500 hover:bg-white/[0.05] hover:text-white">
                <MoreVertical size={17} />
              </button>
            </div>
          </header>

          {/* Mobile expiry */}
          <div className="flex items-center justify-center gap-2 border-b border-white/[0.05] bg-white/[0.015] py-2 sm:hidden">
            <Clock3 size={13} className="text-zinc-600" />
            <span className="text-[11px] text-zinc-500">
              Messages expire in
            </span>
            <span className="font-mono text-[11px] text-zinc-300">
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div className="mx-auto max-w-3xl">
              {/* Date divider */}
              <div className="mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/[0.06]" />

                <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                  Today
                </span>

                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              {/* Security notice */}
              <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2">
                <ShieldCheck size={13} className="text-emerald-400" />

                <p className="text-[10px] text-zinc-500">
                  Messages are temporary and disappear after inactivity.
                </p>
              </div>

              {/* Messages */}
              <div className="space-y-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.mine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[82%] gap-3 ${
                        message.mine
                          ? "flex-row-reverse"
                          : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          message.mine
                            ? "bg-gradient-to-br from-pink-500 to-purple-500"
                            : "bg-white/[0.08] text-zinc-300"
                        }`}
                      >
                        {message.name.charAt(0)}
                      </div>

                      <div
                        className={`${
                          message.mine
                            ? "items-end"
                            : "items-start"
                        } flex flex-col`}
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <span className="text-[11px] font-medium text-zinc-400">
                            {message.mine
                              ? "You"
                              : message.name}
                          </span>

                          <span className="text-[10px] text-zinc-700">
                            {message.time}
                          </span>
                        </div>

                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                            message.mine
                              ? "rounded-tr-md bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/10"
                              : "rounded-tl-md border border-white/[0.07] bg-white/[0.045] text-zinc-200"
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-white/[0.07] bg-[#0b0b0c] p-4 md:p-5">
            <div className="mx-auto max-w-3xl">
              {/* Attachment menu */}
              {showAttach && (
                <div className="mb-3 flex gap-2 rounded-2xl border border-white/[0.07] bg-[#111113] p-2">
                  <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.05] hover:text-white">
                    <ImageIcon size={15} />
                    Image
                  </button>

                  <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.05] hover:text-white">
                    <FileText size={15} />
                    File
                  </button>

                  <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-400 hover:bg-white/[0.05] hover:text-white">
                    <Link2 size={15} />
                    Link
                  </button>
                </div>
              )}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-2 transition focus-within:border-white/[0.15]">
                <div className="flex items-end gap-2">
                  <button
                    onClick={() =>
                      setShowAttach(!showAttach)
                    }
                    className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    {showAttach ? (
                      <X size={18} />
                    ) : (
                      <Paperclip size={18} />
                    )}
                  </button>

                  <textarea
                    value={text}
                    onChange={(event) =>
                      setText(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Write a message..."
                    className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600"
                  />

                  <button className="mb-1 hidden h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:bg-white/[0.06] hover:text-white sm:flex">
                    <Smile size={18} />
                  </button>

                  <button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-20"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between px-1">
                <p className="text-[10px] text-zinc-700">
                  Press Enter to send · Shift + Enter for new line
                </p>

                <p className="hidden text-[10px] text-zinc-700 sm:block">
                  Sliding expiry enabled
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================= */}
        {/* MEMBERS PANEL */}
        {/* ================================================= */}

        {showMembers && (
          <aside className="hidden w-[250px] shrink-0 border-l border-white/[0.07] bg-[#0d0d0e] lg:flex lg:flex-col">
            <div className="border-b border-white/[0.07] px-5 py-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Members
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                3 online · 4 total
              </p>
            </div>

            <div className="space-y-1 p-3">
              {members.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/[0.035]"
                >
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.07] text-xs font-semibold text-zinc-300">
                      {member.initials}
                    </div>

                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d0d0e] ${
                        member.online
                          ? "bg-emerald-400"
                          : "bg-zinc-700"
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">
                      {member.name}
                      {member.name === "Ayush" && (
                        <span className="ml-1 text-zinc-600">
                          (you)
                        </span>
                      )}
                    </p>

                    <p className="text-[10px] text-zinc-600">
                      {member.online
                        ? "Active now"
                        : "Offline"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Invite */}
            <div className="mt-auto border-t border-white/[0.07] p-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] py-3 text-xs text-zinc-400 transition hover:bg-white/[0.06] hover:text-white">
                <Plus size={15} />
                Invite people
              </button>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}


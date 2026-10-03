"use client";

import { useState ,useEffect} from "react";

export default function DropOff() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("none");
  const [handoffOTP, setHandoffOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2 , setLoading2] = useState(false)
  


  const createHandoff = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      setHandoffOTP("");

      const response = await fetch("/api/description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          mode,
        }),
      });

      const data = await response.json();
      


      if (!response.ok) {
        throw new Error(data.message || "Failed to create handoff");
      }

      // OTP received from backend
      if (mode === "otp") {
        setHandoffOTP(data.otp);
      }

    } catch (error) {
      alert(error.message || "Failed to create handoff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">
        Drop text / Code / Link here
      </h2>

      <p className="mt-1 text-sm text-zinc-500">
        Leave text here and pick it up on another device.
      </p>
    
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type your text..."
        maxLength={100000}
        className="mt-5 min-h-[180px] w-full resize-none rounded-sm border border-white/10 bg-[#08090a] p-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-white/20"
      />
    
   
    

      <p className="mt-2 text-right text-xs text-zinc-600">
        {text.length}/100000
      </p>

     

      <button
        type="button"
        // disabled={Boolean(loading || !text.trim())}

        onClick={()=>{
          setMode("otp");
          createHandoff();
        }}
        className="mt-4 w-full rounded-sm bg-zinc-100 px-4 py-3 text-sm font-medium text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Creating..." : "Create handoff"}
      </button>

      {handoffOTP && (
        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="text-xs uppercase tracking-wider text-zinc-600">
            Your OTP
          </p>

          <div className="mt-2 flex items-center justify-center rounded-sm border border-white/10 bg-[#08090a] p-5">
            <span className="text-3xl font-semibold tracking-[0.35em] text-zinc-100">
              {handoffOTP}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(handoffOTP)}
            className="mt-2 w-full rounded-sm border border-white/10 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/5"
          >
            Copy OTP
          </button>

          <p className="mt-3 text-center text-xs text-zinc-600">
            Share this OTP with the device that will pick up the text.
          </p>
        </div>
      )}
    </div>
  );
}
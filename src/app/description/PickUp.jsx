import { useState } from "react";
import StatusMessage from "./StatusMessage";

export default function PickUp() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [wasDestroyed, setWasDestroyed] = useState(false);
  const [copied, setCopied] = useState(false);

  const opened = Boolean(result);

  function handleChange(e) {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);

    setCode(value);
  }

  async function handleOpen() {
    setError("");

    const cleanCode = code.trim();

    if (!cleanCode) {
      setError("Enter the code you were given first.");
      return;
    }

    setLoading(true);

    try {
        const response = await fetch(`/api/description/pickup/${cleanCode}`, {
        method: "POST",
        
        
      });

      const data  = await response.json()
      if (!response.ok) {
        
        throw new Error(data.message || "Failed to open ticket");
      }
      // Temporary example
      
      
      setResult(data.text);

      if (data.selfDestruct) {
        /*
         * await window.storage.delete(
         *   `share:${cleanCode}`,
         *   true
         * );
         */

        setWasDestroyed(true);
      } else {
        setWasDestroyed(false);
      }
    } catch {
      setError(
        `No ticket found for ${cleanCode}. It may have already been picked up, or the code is off.`
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Clipboard unavailable
    }
  }

  function handleReset() {
    setCode("");
    setResult("");
    setError("");
    setWasDestroyed(false);
    setCopied(false);
  }

  if (opened) {
    return (
      <div className="border-t border-dashed border-white/10 pt-5">

        <p className="mb-2.5 text-[13px] text-zinc-500">
          Here's what was sealed:
        </p>

        <div className="mb-3 min-h-[140px] w-full whitespace-pre-wrap break-words rounded-sm border border-white/10 bg-[#0d0f10] p-3 font-mono text-[13.5px] leading-relaxed text-zinc-300">
          {result}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="mb-2.5 w-full rounded-sm border border-white/10 px-2.5 py-2.5 text-[13.5px] text-zinc-300 transition hover:bg-white/5"
        >
          {copied ? "Copied" : "Copy text"}
        </button>

        {wasDestroyed && (
          <StatusMessage type="success">
            This ticket erased itself. It can't be opened again.
          </StatusMessage>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="mt-3.5 w-full text-center text-[13px] text-amber-400 underline underline-offset-2"
        >
          Open another
        </button>

      </div>
    );
  }

  return (
    <div>

      <div className="mb-[18px]">
        <label
          htmlFor="pickup-code"
          className="mb-2 block text-[13px] text-zinc-500"
        >
          Enter the code
        </label>

        <input
          id="pickup-code"
          value={code}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleOpen();
            }
          }}
          placeholder="XXXXXX"
          maxLength={6}
          autoComplete="off"
          className="
            w-full rounded border border-dashed border-white/10
            bg-[#0d0f10] px-2 py-3.5
            text-center font-mono text-[22px] font-semibold
            tracking-[0.18em] text-white
            outline-none placeholder:text-zinc-700
            focus:border-amber-500/50
            focus:ring-1 focus:ring-amber-500/30
          "
        />
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={handleOpen}
        className="
          w-full rounded-sm bg-zinc-100 px-3 py-[13px]
          font-[Space_Grotesk] text-sm font-medium
          text-black transition hover:bg-white
          disabled:cursor-default disabled:opacity-60
        "
      >
        {loading ? "Opening…" : "Open"}
      </button>

      {error && (
        <StatusMessage>
          {error}
        </StatusMessage>
      )}

    </div>
  );
}
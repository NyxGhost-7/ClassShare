export default function HandoffTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="flex gap-1.5 pl-1.5">

      <button
        type="button"
        onClick={() => setActiveTab("drop")}
        className={`
          rounded-t-lg border border-b-0 px-[18px] py-2.5
          font-[Space_Grotesk] text-sm font-medium
          transition-all duration-150
          ${
            activeTab === "drop"
              ? "translate-y-0 border-white/10 bg-[#111315] text-white"
              : "translate-y-[3px] border-white/10 bg-[#0d0f10] text-zinc-500 opacity-75 hover:opacity-100"
          }
        `}
      >
        Drop off
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("pickup")}
        className={`
          rounded-t-lg border border-b-0 px-[18px] py-2.5
          font-[Space_Grotesk] text-sm font-medium
          transition-all duration-150
          ${
            activeTab === "pickup"
              ? "translate-y-0 border-white/10 bg-[#111315] text-white"
              : "translate-y-[3px] border-white/10 bg-[#0d0f10] text-zinc-500 opacity-75 hover:opacity-100"
          }
        `}
      >
        Pick up
      </button>

    </div>
  );
}
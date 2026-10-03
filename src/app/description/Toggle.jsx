export default function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`
        relative h-[22px] w-[38px] shrink-0 rounded-full
        transition-colors duration-150
        ${enabled ? "bg-amber-500" : "bg-zinc-700"}
      `}
    >
      <span
        className={`
          absolute left-[3px] top-[3px]
          h-4 w-4 rounded-full bg-white
          transition-transform duration-150
          ${enabled ? "translate-x-4" : "translate-x-0"}
        `}
      />
    </button>
  );
}
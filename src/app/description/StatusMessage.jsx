export default function StatusMessage({
  type = "error",
  children,
}) {
  const styles = {
    error:
      "border-red-500/20 bg-red-500/10 text-red-400",

    success:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div
      className={`
        mt-1 rounded-sm border px-3.5 py-3
        text-[13px] leading-relaxed
        ${styles[type]}
      `}
    >
      {children}
    </div>
  );
}
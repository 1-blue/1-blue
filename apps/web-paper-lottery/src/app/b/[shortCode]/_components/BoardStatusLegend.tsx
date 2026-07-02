export const BoardStatusLegend = () => {
  return (
    <div className="text-ink/60 flex flex-wrap justify-center gap-4 text-xs">
      <span className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="inline-block size-3 rounded-sm border-2 border-[#c9b08a] bg-[#fff8ef] shadow-sm"
        />
        남은 칸
      </span>
      <span className="flex items-center gap-1.5">
        <span
          aria-hidden
          className="inline-block size-3 rounded-sm border-2 border-dashed border-[#a89880] bg-[#ddd5c8]"
          style={{ boxShadow: "inset 0 1px 3px rgb(61 41 20 / 0.15)" }}
        />
        뽑힌 칸
      </span>
    </div>
  );
};

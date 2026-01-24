type StartMenuProps = {
  canContinue: boolean;
  onStart: () => void;
  onContinue: () => void;
};

const StartMenu = ({ canContinue, onStart, onContinue }: StartMenuProps) => {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="w-[420px] max-w-[90vw] rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl">
        <div className="text-xl font-semibold text-white">Virtuous</div>
        <div className="mt-1 text-sm text-slate-300">
          WASD or Arrow keys to move. Ctrl+S to save. Ctrl+L to load.
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onStart}
            className="rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-500 active:bg-emerald-700"
          >
            Start
          </button>

          <button
            onClick={onContinue}
            disabled={!canContinue}
            className={`
              rounded-lg px-4 py-3 font-semibold
              ${
                canContinue
                  ? "bg-slate-700 text-white hover:bg-slate-600 active:bg-slate-800"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
          >
            Continue
          </button>
        </div>

        {!canContinue && (
          <div className="mt-3 text-xs text-slate-400">No save detected.</div>
        )}
      </div>
    </div>
  );
};
export default StartMenu;

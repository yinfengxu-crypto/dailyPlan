'use client';

export default function ProgressRing({ percent }: { percent: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percent / 100);

  return (
    <div className="ring-wrap" aria-hidden="true">
      <svg className="ring" viewBox="0 0 64 64">
        <circle className="ring-bg" cx="32" cy="32" r={r} />
        <circle
          className="ring-fg"
          cx="32"
          cy="32"
          r={r}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="ring-label">{percent}%</span>
    </div>
  );
}

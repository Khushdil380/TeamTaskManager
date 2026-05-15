// RingProgress — SVG circular progress indicator used on dashboard stat cards
const RingProgress = ({ pct, size = 48, stroke = 5 }) => {
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const filled = ((pct || 0) / 100) * circ;
  return (
    <svg width={size} height={size} className="dh-ring-svg" style={{ position: "absolute", inset: 0 }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#fff" strokeWidth={stroke}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};

export default RingProgress;
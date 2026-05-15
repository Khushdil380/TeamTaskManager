// HBar — horizontal progress bar used in dashboard breakdown charts
const HBar = ({ value, max, color }) => {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="dh-hbar-track">
      <div className="dh-hbar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
};

export default HBar;
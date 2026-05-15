import { useState, useEffect, useCallback, useRef } from "react";
import { getAuthToken } from "../../utils/auth";
import { STRIPE_COLORS, TASK_STATUS_CFG } from "../../utils/taskConfig";
import "./Calendar.css";

const API = import.meta.env.VITE_API_URL;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Build a map: "YYYY-MM-DD" → task[]
function buildTaskMap(tasks) {
  const map = {};
  tasks.forEach((t) => {
    const key = new Date(t.deadline).toLocaleDateString("en-CA"); // YYYY-MM-DD
    if (!map[key]) map[key] = [];
    map[key].push(t);
  });
  return map;
}

// Get all day cells for a given month (including leading/trailing empties)
function getMonthCells(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function toKey(year, month, day) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export default function Calendar({ role }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [taskMap, setTaskMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ above: true });
  const calendarRef = useRef(null);

  const fetchTasks = useCallback(async () => {
    const token = getAuthToken();
    try {
      setLoading(true);
      const view = role === "admin" ? "admin" : "member";
      const res = await fetch(`${API}/api/tasks/calendar?view=${view}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTaskMap(buildTaskMap(data.tasks || []));
    } catch {
      setTaskMap({});
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); };

  const cells = getMonthCells(year, month);
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const handleDayEnter = (key, e) => {
    if (!taskMap[key]) return;
    setHoveredKey(key);
    const cell = e.currentTarget;
    const cal = calendarRef.current;
    if (cal && cell) {
      const calRect = cal.getBoundingClientRect();
      const cellRect = cell.getBoundingClientRect();
      const rowTop = cellRect.top - calRect.top;
      setTooltipPos({ above: rowTop > 160 });
    }
  };

  return (
    <div className="cal-wrap" ref={calendarRef}>
      {/* Header */}
      <div className="cal-header">
        <div className="cal-heading">
          <h2 className="cal-title">Calendar</h2>
          <p className="cal-sub">Tasks due dates across your projects</p>
        </div>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">‹</button>
          <span className="cal-month-label">
            {MONTHS[month]} {year}
          </span>
          <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">›</button>
          <button className="cal-today-btn" onClick={goToday}>Today</button>
        </div>
      </div>

      {loading ? (
        <div className="cal-loading">
          <div className="cal-spinner" />
        </div>
      ) : (
        <div className="cal-grid-wrap">
          {/* Weekday headers */}
          <div className="cal-grid cal-grid--head">
            {WEEKDAYS.map((d) => (
              <div key={d} className="cal-weekday">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="cal-grid cal-grid--body">
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="cal-cell cal-cell--empty" />;

              const key = toKey(year, month, day);
              const tasks = taskMap[key] || [];
              const isToday = key === todayKey;
              const hasTasks = tasks.length > 0;
              const visible = tasks.slice(0, 3);
              const extra = tasks.length - visible.length;

              return (
                <div
                  key={key}
                  className={`cal-cell${isToday ? " cal-cell--today" : ""}${hasTasks ? " cal-cell--has-tasks" : ""}`}
                  onMouseEnter={(e) => handleDayEnter(key, e)}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  <span className="cal-day-num">{day}</span>

                  {hasTasks && (
                    <div className="cal-dots">
                      {visible.map((t) => (
                        <span
                          key={t._id}
                          className="cal-dot"
                          style={{
                            background: t.project?.color
                              ? STRIPE_COLORS[t.project.color] ?? STRIPE_COLORS[1]
                              : STRIPE_COLORS[1],
                          }}
                        />
                      ))}
                      {extra > 0 && <span className="cal-dot-extra">+{extra}</span>}
                    </div>
                  )}

                  {/* Tooltip */}
                  {hasTasks && hoveredKey === key && (
                    <div className={`cal-tooltip${tooltipPos.above ? " cal-tooltip--above" : " cal-tooltip--below"}`}>
                      <div className="cal-tooltip-arrow" />
                      <ul className="cal-tooltip-list">
                        {tasks.map((t) => {
                          const dotColor = t.project?.color
                            ? STRIPE_COLORS[t.project.color] ?? STRIPE_COLORS[1]
                            : STRIPE_COLORS[1];
                          const statusCfg = TASK_STATUS_CFG[t.status] ?? TASK_STATUS_CFG.todo;
                          return (
                            <li key={t._id} className="cal-tooltip-item">
                              <span className="cal-tooltip-dot" style={{ background: dotColor }} />
                              <div className="cal-tooltip-info">
                                <span className="cal-tooltip-project">{t.project?.title ?? "—"}</span>
                                <span className="cal-tooltip-task">{t.title}</span>
                                {t.description && (
                                  <span className="cal-tooltip-desc">{t.description}</span>
                                )}
                                <span
                                  className="cal-tooltip-status"
                                  style={{ color: statusCfg.color }}
                                >
                                  {statusCfg.label}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="cal-legend">
        <span className="cal-legend-item">
          <span className="cal-legend-dot" style={{ background: "var(--color-primary)" }} />
          Tasks due
        </span>
        <span className="cal-legend-item cal-legend-today">
          <span className="cal-legend-today-ring" />
          Today
        </span>
      </div>
    </div>
  );
}

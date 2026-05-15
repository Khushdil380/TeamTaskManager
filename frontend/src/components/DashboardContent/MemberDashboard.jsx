import { STRIPE_COLORS, TASK_STATUS_CFG, PRIORITY_CFG, PROJECT_STATUS_LABEL } from "../../utils/taskConfig";
import { getGreeting, formatToday, formatDeadline } from "../../utils/helpers";
import RingProgress from "./RingProgress";
import HBar from "./HBar";

const MemberDashboard = ({ data, user, onRefresh }) => {
  const { stats, projects, recentTasks } = data;
  const firstName  = user?.fullName?.split(" ")[0] || "there";
  const barMax     = stats.totalTasks || 1;
  const activeTasks = recentTasks.filter((t) => t.status !== "completed");

  return (
    <div className="dh-page">

      {/* Greeting */}
      <div className="dh-greeting">
        <div>
          <h1 className="dh-greeting-title">
            {getGreeting()}, {firstName}! 👋
          </h1>
          <p className="dh-greeting-date">{formatToday()}</p>
        </div>
        <div className="dh-greeting-right">
          <span className="dh-member-badge">Team Member</span>
          <button className="dh-refresh-btn" onClick={onRefresh} title="Refresh">↻</button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dh-stats-grid">

        {/* My Projects */}
        <div className="dh-stat-card dh-blue">
          <div className="dh-stat-icon-box">📁</div>
          <div className="dh-stat-text">
            <p className="dh-stat-num">{stats.totalProjects}</p>
            <p className="dh-stat-label">My Projects</p>
            <p className="dh-stat-sub">
              {stats.projectsByStatus?.["in-progress"] || 0} active
            </p>
          </div>
          <div className="dh-stat-decor" />
        </div>

        {/* Assigned to Me */}
        <div className="dh-stat-card dh-orange">
          <div className="dh-stat-icon-box">📋</div>
          <div className="dh-stat-text">
            <p className="dh-stat-num">{stats.totalTasks}</p>
            <p className="dh-stat-label">Assigned to Me</p>
            <p className="dh-stat-sub">
              {stats.tasksByStatus?.todo || 0} pending · {stats.tasksByStatus?.["in-progress"] || 0} active
            </p>
          </div>
          <div className="dh-stat-decor" />
        </div>

        {/* Completed */}
        <div className="dh-stat-card dh-green">
          <div className="dh-stat-ring-box">
            <RingProgress pct={stats.completionRate} size={48} stroke={4} />
            <span className="dh-ring-label">{stats.completionRate}%</span>
          </div>
          <div className="dh-stat-text">
            <p className="dh-stat-num">{stats.completedTasks}</p>
            <p className="dh-stat-label">Completed</p>
            <p className="dh-stat-sub">{stats.completionRate}% of my tasks done</p>
          </div>
          <div className="dh-stat-decor" />
        </div>

        {/* Overdue or In Progress */}
        {stats.overdueTasks > 0 ? (
          <div className="dh-stat-card dh-red">
            <div className="dh-stat-icon-box">⚠️</div>
            <div className="dh-stat-text">
              <p className="dh-stat-num">{stats.overdueTasks}</p>
              <p className="dh-stat-label">Overdue</p>
              <p className="dh-stat-sub">Need your attention</p>
            </div>
            <div className="dh-stat-decor" />
          </div>
        ) : (
          <div className="dh-stat-card dh-purple">
            <div className="dh-stat-icon-box">🔄</div>
            <div className="dh-stat-text">
              <p className="dh-stat-num">{stats.tasksByStatus?.["in-progress"] || 0}</p>
              <p className="dh-stat-label">In Progress</p>
              <p className="dh-stat-sub">{stats.tasksByStatus?.todo || 0} more pending</p>
            </div>
            <div className="dh-stat-decor" />
          </div>
        )}
      </div>

      {/* Middle Grid */}
      <div className="dh-mid-grid">

        {/* My Active Tasks */}
        <div className="dh-card">
          <div className="dh-card-hdr">
            <h3 className="dh-card-title">⚡ My Active Tasks</h3>
            <span className="dh-card-badge">{activeTasks.length} pending</span>
          </div>

          {activeTasks.length === 0 ? (
            <div className="dh-empty">
              <span>🎉</span>
              <p>All caught up! No pending tasks.</p>
            </div>
          ) : (
            <div className="dh-active-task-list">
              {activeTasks.map((t) => {
                const col = STRIPE_COLORS[t.projectColor] || STRIPE_COLORS[1];
                const dl  = formatDeadline(t.deadline);
                return (
                  <div key={t._id} className="dh-active-task-item">
                    <span
                      className="dh-task-proj-dot"
                      style={{ background: col, flexShrink: 0 }}
                    />
                    <div className="dh-active-task-info">
                      <p className="dh-active-task-title">{t.title}</p>
                      <p className="dh-active-task-proj">{t.projectTitle}</p>
                    </div>
                    <div className="dh-active-task-meta">
                      <span
                        className="dh-badge"
                        style={{
                          color:      PRIORITY_CFG[t.priority]?.color,
                          background: PRIORITY_CFG[t.priority]?.bg,
                        }}
                      >
                        {PRIORITY_CFG[t.priority]?.label}
                      </span>
                      {dl && (
                        <span className={`dh-deadline${dl.overdue ? " dh-overdue" : ""}`}>
                          {dl.overdue ? "⚠ " : "📅 "}{dl.label}
                        </span>
                      )}
                    </div>
                    <span
                      className="dh-badge"
                      style={{
                        color:      TASK_STATUS_CFG[t.status]?.color,
                        background: TASK_STATUS_CFG[t.status]?.bg,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {TASK_STATUS_CFG[t.status]?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* My Project Progress */}
        <div className="dh-card">
          <div className="dh-card-hdr">
            <h3 className="dh-card-title">📋 My Projects</h3>
            <span className="dh-card-badge">{projects.length} projects</span>
          </div>

          {projects.length === 0 ? (
            <div className="dh-empty">
              <span>📂</span>
              <p>Not part of any project yet</p>
            </div>
          ) : (
            <div className="dh-proj-list">
              {projects.map((p) => {
                const col = STRIPE_COLORS[p.color] || STRIPE_COLORS[1];
                return (
                  <div key={p._id} className="dh-proj-row">
                    <div className="dh-proj-top">
                      <span className="dh-proj-dot" style={{ background: col }} />
                      <span className="dh-proj-name">{p.title}</span>
                      <span className={`dh-proj-status dh-pstatus-${p.status}`}>
                        {PROJECT_STATUS_LABEL[p.status]}
                      </span>
                    </div>
                    <div className="dh-proj-bar-row">
                      <div className="dh-proj-track">
                        <div
                          className="dh-proj-fill"
                          style={{ width: `${p.taskStats.pct}%`, background: col }}
                        />
                      </div>
                      <span className="dh-proj-pct">{p.taskStats.pct}%</span>
                      <span className="dh-proj-frac">
                        {p.taskStats.completed}/{p.taskStats.total} tasks
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {stats.totalTasks > 0 && (
            <>
              <div className="dh-divider" />
              <p className="dh-section-label">My Tasks by Status</p>
              <div className="dh-bar-group">
                {[
                  ["todo",        stats.tasksByStatus.todo],
                  ["in-progress", stats.tasksByStatus["in-progress"]],
                  ["completed",   stats.tasksByStatus.completed],
                ].map(([key, val]) => (
                  <div key={key} className="dh-bar-row">
                    <div className="dh-bar-meta">
                      <span className="dh-bar-dot" style={{ background: TASK_STATUS_CFG[key].color }} />
                      <span className="dh-bar-name">{TASK_STATUS_CFG[key].label}</span>
                      <span className="dh-bar-count">{val}</span>
                    </div>
                    <HBar value={val} max={barMax} color={TASK_STATUS_CFG[key].color} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* My Recent Tasks */}
      <div className="dh-card">
        <div className="dh-card-hdr">
          <h3 className="dh-card-title">🕐 My Recent Tasks</h3>
          <span className="dh-card-badge">{recentTasks.length} shown</span>
        </div>

        {recentTasks.length === 0 ? (
          <div className="dh-empty">
            <span>📋</span>
            <p>No tasks assigned yet — tasks will appear here once added to a project</p>
          </div>
        ) : (
          <div className="dh-tasks-grid">
            {recentTasks.map((t) => {
              const dl  = formatDeadline(t.deadline);
              const col = STRIPE_COLORS[t.projectColor] || STRIPE_COLORS[1];
              return (
                <div
                  key={t._id}
                  className={`dh-task-card${t.status === "completed" ? " dh-task-done" : ""}`}
                >
                  <div className="dh-task-proj">
                    <span className="dh-task-proj-dot" style={{ background: col }} />
                    <span className="dh-task-proj-name">{t.projectTitle}</span>
                  </div>
                  <p className="dh-task-title">{t.title}</p>
                  <div className="dh-task-badges">
                    <span
                      className="dh-badge"
                      style={{
                        color:      TASK_STATUS_CFG[t.status]?.color,
                        background: TASK_STATUS_CFG[t.status]?.bg,
                      }}
                    >
                      {TASK_STATUS_CFG[t.status]?.label}
                    </span>
                    <span
                      className="dh-badge"
                      style={{
                        color:      PRIORITY_CFG[t.priority]?.color,
                        background: PRIORITY_CFG[t.priority]?.bg,
                      }}
                    >
                      {PRIORITY_CFG[t.priority]?.label}
                    </span>
                  </div>
                  <div className="dh-task-foot">
                    <span className="dh-member-you-badge">You</span>
                    {dl && (
                      <span className={`dh-deadline${dl.overdue ? " dh-overdue" : ""}`}>
                        {dl.overdue ? "⚠ " : "📅 "}{dl.label}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
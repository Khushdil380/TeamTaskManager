import { getAvatarById } from "../../utils/avatarConfig";
import { STRIPE_COLORS, TASK_STATUS_CFG, PRIORITY_CFG, PROJECT_STATUS_LABEL } from "../../utils/taskConfig";
import { getGreeting, formatToday, formatDeadline } from "../../utils/helpers";
import RingProgress from "./RingProgress";
import HBar from "./HBar";

const AdminDashboard = ({ data, user, onRefresh }) => {
  const { stats, projects, recentTasks } = data;
  const firstName = user?.fullName?.split(" ")[0] || "there";
  const barMax    = stats.totalTasks || 1;

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
        <button className="dh-refresh-btn" onClick={onRefresh} title="Refresh data">
          ↻
        </button>
      </div>

      {/* Stat Cards */}
      <div className="dh-stats-grid">

        {/* Projects */}
        <div className="dh-stat-card dh-orange">
          <div className="dh-stat-icon-box">📁</div>
          <div className="dh-stat-text">
            <p className="dh-stat-num">{stats.totalProjects}</p>
            <p className="dh-stat-label">Total Projects</p>
            <p className="dh-stat-sub">
              {stats.projectsByStatus?.["in-progress"] || 0} active
              {stats.projectsByStatus?.completed
                ? ` · ${stats.projectsByStatus.completed} done`
                : ""}
            </p>
          </div>
          <div className="dh-stat-decor" />
        </div>

        {/* Tasks */}
        <div className="dh-stat-card dh-blue">
          <div className="dh-stat-icon-box">📋</div>
          <div className="dh-stat-text">
            <p className="dh-stat-num">{stats.totalTasks}</p>
            <p className="dh-stat-label">Total Tasks</p>
            <p className="dh-stat-sub">
              {stats.tasksByStatus?.["in-progress"] || 0} in progress
              {stats.tasksByStatus?.todo
                ? ` · ${stats.tasksByStatus.todo} to do`
                : ""}
            </p>
          </div>
          <div className="dh-stat-decor" />
        </div>

        {/* Completion Rate */}
        <div className="dh-stat-card dh-green">
          <div className="dh-stat-ring-box">
            <RingProgress pct={stats.completionRate} size={48} stroke={4} />
            <span className="dh-ring-label">{stats.completionRate}%</span>
          </div>
          <div className="dh-stat-text">
            <p className="dh-stat-num">{stats.completedTasks}</p>
            <p className="dh-stat-label">Tasks Completed</p>
            <p className="dh-stat-sub">{stats.completionRate}% completion rate</p>
          </div>
          <div className="dh-stat-decor" />
        </div>

        {/* Overdue or Members */}
        {stats.overdueTasks > 0 ? (
          <div className="dh-stat-card dh-red">
            <div className="dh-stat-icon-box">⚠️</div>
            <div className="dh-stat-text">
              <p className="dh-stat-num">{stats.overdueTasks}</p>
              <p className="dh-stat-label">Overdue Tasks</p>
              <p className="dh-stat-sub">Need immediate attention</p>
            </div>
            <div className="dh-stat-decor" />
          </div>
        ) : (
          <div className="dh-stat-card dh-purple">
            <div className="dh-stat-icon-box">👥</div>
            <div className="dh-stat-text">
              <p className="dh-stat-num">{stats.teamMemberCount}</p>
              <p className="dh-stat-label">Team Members</p>
              <p className="dh-stat-sub">Across all projects</p>
            </div>
            <div className="dh-stat-decor" />
          </div>
        )}
      </div>

      {/* Middle Grid */}
      <div className="dh-mid-grid">

        {/* Project Progress */}
        <div className="dh-card">
          <div className="dh-card-hdr">
            <h3 className="dh-card-title">📋 Project Progress</h3>
            <span className="dh-card-badge">{projects.length} projects</span>
          </div>

          {projects.length === 0 ? (
            <div className="dh-empty">
              <span>📂</span>
              <p>No projects yet</p>
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
                      <span className="dh-proj-members">👥 {p.memberCount}</span>
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
                        {p.taskStats.completed}/{p.taskStats.total}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Task Breakdown */}
        <div className="dh-card">
          <div className="dh-card-hdr">
            <h3 className="dh-card-title">📊 Task Breakdown</h3>
          </div>

          <p className="dh-section-label">By Status</p>
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

          <div className="dh-divider" />

          <p className="dh-section-label">By Priority</p>
          <div className="dh-bar-group">
            {[
              ["high",   stats.tasksByPriority.high],
              ["medium", stats.tasksByPriority.medium],
              ["low",    stats.tasksByPriority.low],
            ].map(([key, val]) => (
              <div key={key} className="dh-bar-row">
                <div className="dh-bar-meta">
                  <span className="dh-bar-dot" style={{ background: PRIORITY_CFG[key].color }} />
                  <span className="dh-bar-name">{PRIORITY_CFG[key].label}</span>
                  <span className="dh-bar-count">{val}</span>
                </div>
                <HBar value={val} max={barMax} color={PRIORITY_CFG[key].color} />
              </div>
            ))}
          </div>

          <div className="dh-divider" />

          <p className="dh-section-label">Projects by Status</p>
          <div className="dh-proj-status-chips">
            {[
              ["in-progress", "#60a5fa"],
              ["completed",   "#4ade80"],
              ["on-hold",     "#fbbf24"],
              ["cancelled",   "#f87171"],
            ].map(([key, color]) => {
              const count = stats.projectsByStatus?.[key] || 0;
              return (
                <div key={key} className="dh-pstat-chip" style={{ borderColor: color, color }}>
                  <span className="dh-pstat-num">{count}</span>
                  <span className="dh-pstat-label">{PROJECT_STATUS_LABEL[key]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="dh-card">
        <div className="dh-card-hdr">
          <h3 className="dh-card-title">🕐 Recent Tasks</h3>
          <span className="dh-card-badge">{recentTasks.length} shown</span>
        </div>

        {recentTasks.length === 0 ? (
          <div className="dh-empty">
            <span>📋</span>
            <p>No tasks yet — open a project and add tasks to get started</p>
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
                    <div className="dh-assignees">
                      {t.assignedTo?.length > 0
                        ? t.assignedTo.slice(0, 3).map((a) => {
                            const av = getAvatarById(a.avatar);
                            return (
                              <div
                                key={a._id}
                                className="dh-mini-av"
                                style={{ background: av.bg }}
                                title={a.fullName}
                              >
                                {av.icon}
                              </div>
                            );
                          })
                        : <span className="dh-unassigned">Unassigned</span>}
                    </div>
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

export default AdminDashboard;
import { useState, useEffect, useCallback } from "react";
import "./TeamMembers.css";
import { getAuthToken } from "../../utils/auth";
import { getAvatarById } from "../../utils/avatarConfig";
import { STRIPE_COLORS, PROJECT_STATUS_LABEL } from "../../utils/taskConfig";

const API_URL = import.meta.env.VITE_API_URL;

const CHIPS_VISIBLE = 3;

/* ── Member-view: project team card ── */
const MemberRow = ({ member }) => {
  const av = getAvatarById(member.avatar);
  return (
    <div className="mt-member-row">
      <div className="mt-member-avatar" style={{ background: av.bg }}>
        {av.icon}
      </div>
      <div className="mt-member-info">
        <span className="mt-member-name">{member.fullName}</span>
        <span className="mt-member-email">{member.email}</span>
      </div>
    </div>
  );
};

const MEMBERS_VISIBLE = 4;

const ProjectTeamCard = ({ project, currentUserId }) => {
  const [expanded, setExpanded] = useState(false);
  const stripeColor = STRIPE_COLORS[project.color] || STRIPE_COLORS[1];
  const coMembers = project.members.filter(
    (m) => m._id?.toString() !== currentUserId?.toString(),
  );
  const hidden = coMembers.length - MEMBERS_VISIBLE;
  const visibleMembers = expanded
    ? coMembers
    : coMembers.slice(0, MEMBERS_VISIBLE);

  return (
    <div className="mt-card">
      <div className="mt-card-stripe" style={{ background: stripeColor }} />
      <div className="mt-card-body">
        {/* Header */}
        <div className="mt-card-header">
          <div className="mt-card-title-row">
            <span className="mt-card-dot" style={{ background: stripeColor }} />
            <span className="mt-card-title">{project.title}</span>
          </div>
          <span className={`mt-card-status mt-status-${project.status}`}>
            {PROJECT_STATUS_LABEL[project.status] || project.status}
          </span>
        </div>

        {/* Admin */}
        {project.admin && (
          <div className="mt-section">
            <span className="mt-section-label mt-label-admin">Admin</span>
            <MemberRow member={project.admin} />
          </div>
        )}

        {/* Divider */}
        <div className="mt-divider" />

        {/* Co-members */}
        <div className="mt-section">
          <span className="mt-section-label">
            Members
            <span className="mt-member-count">{project.members.length}</span>
          </span>
          {coMembers.length === 0 ? (
            <p className="mt-no-members">No other members in this project.</p>
          ) : (
            <>
              <div
                className={`mt-members-list${expanded ? " mt-members-list--expanded" : ""}`}
              >
                {visibleMembers.map((m) => (
                  <MemberRow key={m._id} member={m} />
                ))}
              </div>
              {hidden > 0 && !expanded && (
                <button
                  className="mt-toggle-btn"
                  onClick={() => setExpanded(true)}
                >
                  +{hidden} more member{hidden !== 1 ? "s" : ""}
                </button>
              )}
              {expanded && coMembers.length > MEMBERS_VISIBLE && (
                <button
                  className="mt-toggle-btn mt-toggle-btn--less"
                  onClick={() => setExpanded(false)}
                >
                  Show less
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Member view wrapper ── */
const MemberTeamsView = ({ searchQuery, user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUserId = (user?._id ?? user?.id)?.toString();

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/projects/member-teams`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="tm-page">
      <div className="tm-toolbar">
        <div className="tm-toolbar-left">
          <span className="tm-count">{filtered.length}</span>
          <span className="tm-count-label">
            project team{filtered.length !== 1 ? "s" : ""} you're part of
          </span>
        </div>
      </div>

      <div className="tm-list-wrapper">
        {loading ? (
          <p className="tm-state-msg">Loading…</p>
        ) : error ? (
          <p className="tm-state-msg tm-state-error">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="tm-empty">
            <span className="tm-empty-icon">
              {projects.length === 0 ? "👥" : "🔍"}
            </span>
            <p>
              {projects.length === 0
                ? "You haven't been added to any project yet."
                : `No projects match "${searchQuery}"`}
            </p>
          </div>
        ) : (
          <div className="mt-grid">
            {filtered.map((p) => (
              <ProjectTeamCard
                key={p._id}
                project={p}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TeamMembers = ({ searchQuery = "", role = "admin", user }) => {
  if (role === "member") {
    return <MemberTeamsView searchQuery={searchQuery} user={user} />;
  }

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingKey, setRemovingKey] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleExpand = (id) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/projects/team-members`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setMembers(data.members);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleRemoveFromProject = async (userId, projectId, projectTitle) => {
    if (!window.confirm(`Remove this member from "${projectTitle}"?`)) return;

    const key = `${userId}-${projectId}`;
    setRemovingKey(key);
    try {
      const res = await fetch(
        `${API_URL}/api/projects/${projectId}/members/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        },
      );
      if (res.ok) {
        // Optimistic: update local state
        setMembers(
          (prev) =>
            prev
              .map((m) => {
                if (m._id.toString() !== userId.toString()) return m;
                const updatedProjects = m.projects.filter(
                  (p) => p._id.toString() !== projectId.toString(),
                );
                return {
                  ...m,
                  projects: updatedProjects,
                  projectCount: updatedProjects.length,
                };
              })
              .filter((m) => m.projects.length > 0), // remove member if no projects left
        );
      }
    } catch {
      // silent
    } finally {
      setRemovingKey(null);
    }
  };

  const filtered = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="tm-page">
      {/* Toolbar */}
      <div className="tm-toolbar">
        <div className="tm-toolbar-left">
          <span className="tm-count">{filtered.length}</span>
          <span className="tm-count-label">
            member{filtered.length !== 1 ? "s" : ""} in projects
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="tm-list-wrapper">
        {loading ? (
          <p className="tm-state-msg">Loading…</p>
        ) : error ? (
          <p className="tm-state-msg tm-state-error">{error}</p>
        ) : filtered.length === 0 ? (
          <div className="tm-empty">
            <span className="tm-empty-icon">
              {members.length === 0 ? "👥" : "🔍"}
            </span>
            <p>
              {members.length === 0
                ? "No members have been added to any project yet."
                : `No members match "${searchQuery}"`}
            </p>
          </div>
        ) : (
          <table className="tm-table">
            <thead>
              <tr>
                <th className="tm-th">Member</th>
                <th className="tm-th">Email</th>
                <th className="tm-th tm-th-center">Projects</th>
                <th className="tm-th tm-th-center">Progress</th>
                <th className="tm-th">Assigned Projects</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const av = getAvatarById(m.avatar);
                const completedPct =
                  m.projectCount > 0
                    ? Math.round((m.completedCount / m.projectCount) * 100)
                    : 0;

                return (
                  <tr key={m._id} className="tm-tr">
                    {/* Avatar + Name */}
                    <td className="tm-td">
                      <div className="tm-member-cell">
                        <div
                          className="tm-avatar"
                          style={{ background: av.bg }}
                        >
                          {av.icon}
                        </div>
                        <span className="tm-name">{m.fullName}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="tm-td tm-email">{m.email}</td>

                    {/* Project count */}
                    <td className="tm-td tm-td-center">
                      <span className="tm-proj-count">{m.projectCount}</span>
                    </td>

                    {/* Progress bar */}
                    <td className="tm-td tm-td-center">
                      <div className="tm-progress-wrap">
                        <div className="tm-progress-bar">
                          <div
                            className="tm-progress-fill"
                            style={{ width: `${completedPct}%` }}
                          />
                        </div>
                        <span className="tm-progress-label">
                          {m.completedCount}/{m.projectCount}
                        </span>
                      </div>
                    </td>

                    {/* Project chips */}
                    <td className="tm-td">
                      <div className="tm-chips">
                        {(() => {
                          const expanded = expandedRows.has(m._id.toString());
                          const visible = expanded
                            ? m.projects
                            : m.projects.slice(0, CHIPS_VISIBLE);
                          const hidden = m.projects.length - CHIPS_VISIBLE;
                          return (
                            <>
                              {visible.map((p) => {
                                const key = `${m._id}-${p._id}`;
                                const removing = removingKey === key;
                                return (
                                  <div
                                    key={p._id}
                                    className="tm-chip"
                                    style={{
                                      borderColor:
                                        STRIPE_COLORS[p.color] + "55",
                                      background: STRIPE_COLORS[p.color] + "18",
                                    }}
                                  >
                                    <span
                                      className="tm-chip-dot"
                                      style={{
                                        background: STRIPE_COLORS[p.color],
                                      }}
                                    />
                                    <span className="tm-chip-title">
                                      {p.title}
                                    </span>
                                    <span
                                      className={`tm-chip-status tm-status-${p.status}`}
                                    >
                                      {PROJECT_STATUS_LABEL[p.status]}
                                    </span>
                                    <button
                                      className="tm-chip-remove"
                                      title={`Remove from ${p.title}`}
                                      disabled={removing}
                                      onClick={() =>
                                        handleRemoveFromProject(
                                          m._id,
                                          p._id,
                                          p.title,
                                        )
                                      }
                                    >
                                      {removing ? "…" : "×"}
                                    </button>
                                  </div>
                                );
                              })}
                              {!expanded && hidden > 0 && (
                                <button
                                  className="tm-chip-more"
                                  onClick={() => toggleExpand(m._id.toString())}
                                >
                                  +{hidden} more
                                </button>
                              )}
                              {expanded &&
                                m.projects.length > CHIPS_VISIBLE && (
                                  <button
                                    className="tm-chip-more tm-chip-less"
                                    onClick={() =>
                                      toggleExpand(m._id.toString())
                                    }
                                  >
                                    show less
                                  </button>
                                )}
                            </>
                          );
                        })()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeamMembers;

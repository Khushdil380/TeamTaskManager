import "./ActivityFeed.css";

const ActivityFeed = () => {
  const activities = [
    { user: "Sarah", action: "completed", task: "Homepage Design", time: "2m" },
    { user: "Alex", action: "started", task: "Backend Setup", time: "15m" },
    { user: "Maya", action: "commented", task: "Database Design", time: "1h" },
  ];

  return (
    <div className="activity-feed">
      <div className="activity-title">Recent Activity</div>
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-text">
              <span className="activity-user">{activity.user}</span>
              <span className="activity-action">{activity.action}</span>
              <span className="activity-task">{activity.task}</span>
            </div>
            <div className="activity-time">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;

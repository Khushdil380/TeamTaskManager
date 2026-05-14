import "./TaskCard.css";

const TaskCard = ({ title, priority, dueDate }) => {
  const priorityClass = priority.toLowerCase();

  return (
    <div className="task-card">
      <div className="task-header">
        <div className="task-checkbox"></div>
        <div className="task-title">{title}</div>
      </div>
      <div className="task-footer">
        <span className={`task-priority priority-${priorityClass}`}>
          {priority}
        </span>
        <span className="task-due-date">{dueDate}</span>
      </div>
    </div>
  );
};

export default TaskCard;

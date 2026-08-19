import { CheckCircle2, Eye, Pencil } from "lucide-react";

function TaskCard({ task, onView, onEdit, onComplete }) {
  return (
    <article className="task-card">
      <div className="task-card-header">
        <div>
          <span className="task-card-id">Task #{task.id}</span>
          <strong>{task.complaintReference}</strong>
        </div>
        <span className={`task-status status-${task.status.toLowerCase()}`}>{task.status.replace("_", " ")}</span>
      </div>
      <dl className="task-card-details">
        <div><dt>Assigned staff</dt><dd>{task.assignedStaff}</dd></div>
        <div><dt>Due date</dt><dd>{task.dueDate || "No due date"}</dd></div>
        <div><dt>Priority</dt><dd>{task.priority || "None"}</dd></div>
      </dl>
      <div className="task-card-actions">
        <button type="button" onClick={() => onView(task)}><Eye size={15} /> View</button>
        <button type="button" onClick={() => onEdit(task)}><Pencil size={15} /> Edit</button>
        {task.status !== "COMPLETED" && <button type="button" onClick={() => onComplete(task)}><CheckCircle2 size={15} /> Complete</button>}
      </div>
    </article>
  );
}

export default TaskCard;

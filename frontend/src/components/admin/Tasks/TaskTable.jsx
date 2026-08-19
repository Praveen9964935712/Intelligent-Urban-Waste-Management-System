import { CheckCircle2, Eye, Pencil } from "lucide-react";

const statusLabels = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

function TaskTable({ tasks, onView, onEdit, onComplete }) {
  return (
    <div className="task-table-wrap">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Assigned staff</th>
            <th>Due date</th>
            <th>Priority</th>
            <th>Status</th>
            <th><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>
                <button type="button" className="task-reference" onClick={() => onView(task)}>
                  Task #{task.id}
                </button>
                <span className="task-complaint">{task.complaintReference}</span>
              </td>
              <td>{task.assignedStaff}</td>
              <td>{task.dueDate || "No due date"}</td>
              <td><span className={`task-priority priority-${(task.priority || "none").toLowerCase()}`}>{task.priority || "None"}</span></td>
              <td><span className={`task-status status-${task.status.toLowerCase()}`}>{statusLabels[task.status] || task.status}</span></td>
              <td>
                <div className="task-row-actions">
                  <button type="button" onClick={() => onView(task)} title="View task"><Eye size={16} /></button>
                  <button type="button" onClick={() => onEdit(task)} title="Edit task"><Pencil size={16} /></button>
                  {task.status !== "COMPLETED" && <button type="button" onClick={() => onComplete(task)} title="Mark complete"><CheckCircle2 size={16} /></button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskTable;

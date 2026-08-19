import { Search, SlidersHorizontal } from "lucide-react";

function TaskFilters({ filters, onChange, onReset }) {
  return (
    <div className="task-filters" aria-label="Task filters">
      <label className="task-search">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search task, complaint, or staff"
          aria-label="Search tasks"
        />
      </label>
      <label className="task-filter-control">
        <span>Status</span>
        <select value={filters.status} onChange={(event) => onChange("status", event.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </label>
      <label className="task-filter-control">
        <span>Priority</span>
        <select value={filters.priority} onChange={(event) => onChange("priority", event.target.value)}>
          <option value="">All priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </label>
      <label className="task-filter-control">
        <span>Sort</span>
        <select value={filters.sortBy} onChange={(event) => onChange("sortBy", event.target.value)}>
          <option value="assignedAt">Recently assigned</option>
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
      </label>
      <button type="button" className="task-reset-button" onClick={onReset} title="Reset filters">
        <SlidersHorizontal size={16} aria-hidden="true" />
        Reset
      </button>
    </div>
  );
}

export default TaskFilters;

import { useState } from "react";
import { X } from "lucide-react";

const emptyForm = { complaintId: "", staffId: "", dueDate: "", priority: "MEDIUM", status: "PENDING", notes: "" };

function TaskModal({ task, mode, onClose, onSave, saving }) {
  const [form, setForm] = useState(() => task ? {
    complaintId: task.complaintId || "",
    staffId: task.staffId || "",
    dueDate: task.dueDate || "",
    priority: task.priority || "MEDIUM",
    status: task.status || "PENDING",
    notes: task.notes || "",
  } : emptyForm);
  const isReadOnly = mode === "view";

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <div className="task-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <header className="task-modal-header">
          <div><span className="eyebrow">Task workspace</span><h2 id="task-modal-title">{mode === "create" ? "Assign task" : mode === "view" ? `Task #${task.id}` : `Edit task #${task.id}`}</h2></div>
          <button type="button" className="icon-button" onClick={onClose} title="Close"><X size={20} /></button>
        </header>
        <div className="task-modal-body">
          <label>Complaint reference<input type="number" min="1" required={!isReadOnly} value={form.complaintId} onChange={(event) => update("complaintId", event.target.value)} disabled={isReadOnly || mode !== "create"} placeholder="Complaint ID" /></label>
          <label>Assigned staff<input type="number" min="1" required={!isReadOnly} value={form.staffId} onChange={(event) => update("staffId", event.target.value)} disabled={isReadOnly} placeholder="Staff ID" /></label>
          <label>Due date<input type="date" value={form.dueDate} onChange={(event) => update("dueDate", event.target.value)} disabled={isReadOnly} /></label>
          <label>Priority<select value={form.priority} onChange={(event) => update("priority", event.target.value)} disabled={isReadOnly}><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select></label>
          <label>Status<select value={form.status} onChange={(event) => update("status", event.target.value)} disabled={isReadOnly}><option>PENDING</option><option>IN_PROGRESS</option><option>COMPLETED</option></select></label>
          <label className="task-modal-notes">Notes<textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} disabled={isReadOnly} rows="4" placeholder="Add operational notes" /></label>
        </div>
        {!isReadOnly && <footer className="task-modal-footer"><button type="button" className="button-secondary" onClick={onClose}>Cancel</button><button type="button" className="button-primary" onClick={() => { if (!form.complaintId || !form.staffId) return; onSave({ ...form, complaintId: Number(form.complaintId), staffId: Number(form.staffId) }); }} disabled={saving || !form.complaintId || !form.staffId}>{saving ? "Saving..." : "Save task"}</button></footer>}
      </section>
    </div>
  );
}

export default TaskModal;

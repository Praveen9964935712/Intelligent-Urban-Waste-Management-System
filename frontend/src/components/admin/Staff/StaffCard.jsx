import { Eye, Pencil, Power } from "lucide-react";

function StaffCard({ member, onView, onEdit, onToggle }) {
  return <article className="staff-card"><header><span className="staff-avatar">{member.name?.slice(0, 1).toUpperCase()}</span><div><h3>{member.name}</h3><p>{member.department || "Operations"}</p></div><span className={`availability-badge ${member.available ? "is-active" : "is-inactive"}`}>{member.available ? "Active" : "Inactive"}</span></header><dl><div><dt>Zone</dt><dd>{member.zone || "All zones"}</dd></div><div><dt>Active tasks</dt><dd>{member.assignedTasks}</dd></div><div><dt>Resolved</dt><dd>{member.resolvedComplaints}</dd></div></dl><footer><button type="button" onClick={() => onView(member)}><Eye size={15} /> Profile</button><button type="button" onClick={() => onEdit(member)}><Pencil size={15} /> Edit</button><button type="button" onClick={() => onToggle(member)}><Power size={15} /> {member.available ? "Deactivate" : "Activate"}</button></footer></article>;
}

export default StaffCard;

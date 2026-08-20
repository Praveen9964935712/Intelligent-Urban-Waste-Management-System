import { Mail, MapPin, Phone, UserRound } from "lucide-react";
import StaffPerformanceWidget from "./StaffPerformanceWidget";

function StaffProfile({ profile }) {
  const staff = profile.staff;
  return <div className="staff-profile"><header className="staff-profile-header"><div className="profile-avatar">{staff.name?.slice(0, 1).toUpperCase()}</div><div><span className="eyebrow">Staff profile</span><h2>{staff.name}</h2><p>{staff.department || "Operations"} · {staff.available ? "Active" : "Inactive"}</p></div></header><div className="profile-detail-grid"><div><Mail size={16} /><span><small>Email</small>{staff.email}</span></div><div><Phone size={16} /><span><small>Phone</small>{staff.phone || "Not provided"}</span></div><div><MapPin size={16} /><span><small>Zone</small>{staff.zone || "All zones"}</span></div><div><UserRound size={16} /><span><small>Availability</small>{staff.available ? "Available for assignment" : "Currently inactive"}</span></div></div><StaffPerformanceWidget performance={profile.performance} /><section className="profile-work-grid"><div><h3>Assigned complaints</h3>{profile.assignedComplaints?.length ? <ul>{profile.assignedComplaints.map((complaint) => <li key={complaint.id}><strong>#{complaint.id} {complaint.title}</strong><span>{complaint.priority || "Normal"} · {complaint.status}</span></li>)}</ul> : <p className="profile-empty">No assigned complaints.</p>}</div><div><h3>Assigned tasks</h3>{profile.assignedTasks?.length ? <ul>{profile.assignedTasks.map((task) => <li key={task.id}><strong>Task #{task.id}</strong><span>Complaint #{task.complaintId} · {task.status}</span></li>)}</ul> : <p className="profile-empty">No assigned tasks.</p>}</div></section></div>;
}

export default StaffProfile;

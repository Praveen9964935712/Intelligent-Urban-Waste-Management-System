import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, LogOut, MapPin, RefreshCw, Recycle, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  assignDispatchTask,
  getDispatchQueue,
  getDispatchTeam,
  getStaffComplaintDetail,
  getStaffComplaints,
  getStaffProfile,
  getStaffTasks,
  updateStaffAvailability,
  updateStaffTaskNotes,
  updateStaffTaskStatus,
} from "../../services/staffWorkflowService";
import "./StaffDashboard.css";

const nextStatuses = { PENDING: "ASSIGNED", ASSIGNED: "IN_PROGRESS", IN_PROGRESS: "COMPLETED" };

function StaffDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [dispatchQueue, setDispatchQueue] = useState([]);
  const [dispatchTeam, setDispatchTeam] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState({ complaintId: "", staffId: "", type: "WORKER", priority: "MEDIUM", zone: "" });
  const [note, setNote] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true); setError("");
    try {
      const [profileData, taskData, complaintData, queueData] = await Promise.all([
        getStaffProfile(),
        getStaffTasks(),
        getStaffComplaints(),
        getDispatchQueue(),
      ]);
      setProfile(profileData);
      setTasks(taskData || []);
      setComplaints(complaintData || []);
      setDispatchQueue(queueData || []);
      const zone = profileData?.staff?.zone || "";
      const teamData = zone ? await getDispatchTeam(zone) : await getDispatchTeam();
      setDispatchTeam(teamData || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to load your workspace.");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const request = setTimeout(() => loadDashboard(), 0);
    return () => clearTimeout(request);
  }, []);

  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("role"); localStorage.removeItem("name"); navigate("/login"); };

  const updateStatus = async (task) => {
    const status = nextStatuses[task.status];
    if (!status || saving) return;
    setSaving(true); setError("");
    try { await updateStaffTaskStatus(task.id, status); await loadDashboard(); }
    catch (requestError) { setError(requestError.response?.data?.message || requestError.message || "Unable to update task status."); }
    finally { setSaving(false); }
  };

  const saveNote = async (taskId) => {
    if (saving) return;
    setSaving(true);
    try { await updateStaffTaskNotes(taskId, note[taskId] || ""); setNote((current) => ({ ...current, [taskId]: "" })); }
    catch (requestError) { setError(requestError.response?.data?.message || requestError.message || "Unable to save the note."); }
    finally { setSaving(false); }
  };

  const showComplaint = async (taskId) => {
    setError("");
    try { setSelectedComplaint(await getStaffComplaintDetail(taskId)); }
    catch (requestError) { setError(requestError.response?.data?.message || requestError.message || "Unable to load complaint details."); }
  };

  const setAvailability = async (available) => {
    setSaving(true);
    try { const staff = await updateStaffAvailability(available); setProfile((current) => ({ ...current, staff })); }
    catch (requestError) { setError(requestError.response?.data?.message || requestError.message || "Unable to update availability."); }
    finally { setSaving(false); }
  };

  const assignTask = async (event) => {
    event.preventDefault();
    if (!selectedAssignment.complaintId || !selectedAssignment.staffId) {
      setError("Select a complaint and a field resource before assigning.");
      return;
    }
    const complaintToAssign = (dispatchQueue || []).find((complaint) => String(complaint.id) === String(selectedAssignment.complaintId));
    setSaving(true); setError("");
    try {
      const assignedTask = await assignDispatchTask({
        complaintId: Number(selectedAssignment.complaintId),
        staffId: Number(selectedAssignment.staffId),
        type: selectedAssignment.type,
        priority: selectedAssignment.priority,
        zone: selectedAssignment.zone || profile?.staff?.zone || "",
      });

      if (complaintToAssign) {
        const nextComplaint = {
          ...complaintToAssign,
          priority: selectedAssignment.priority || complaintToAssign.priority,
          status: assignedTask?.status || "ASSIGNED",
          zone: selectedAssignment.zone || complaintToAssign.zone || profile?.staff?.zone || "",
        };
        setComplaints((current) => [nextComplaint, ...current.filter((complaint) => complaint.id !== complaintToAssign.id)]);
      }

      setTasks((current) => [{
        id: assignedTask?.id || Date.now(),
        complaintId: Number(selectedAssignment.complaintId),
        status: assignedTask?.status || "ASSIGNED",
        assignedAt: assignedTask?.assignedAt || new Date().toISOString(),
        completedAt: assignedTask?.completedAt || null,
      }, ...current]);

      setSelectedAssignment({ complaintId: "", staffId: "", type: "WORKER", priority: "MEDIUM", zone: profile?.staff?.zone || "" });
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to assign the task.");
    } finally { setSaving(false); }
  };

  const activeTasks = tasks.filter((task) => task.status !== "COMPLETED");
  const completedTasks = tasks.filter((task) => task.status === "COMPLETED");
  const highPriority = complaints.filter((complaint) => complaint.priority?.toUpperCase() === "HIGH").length;
  const staff = profile?.staff || {};

  return (
    <main className="staff-dashboard"><div className="staff-shell">
      <header className="staff-topbar"><div className="staff-brand"><span className="staff-brand-mark"><Recycle size={20} /></span> CleanCity</div><button type="button" className="staff-logout" onClick={logout}><LogOut size={16} /> Sign out</button></header>
      <section className="staff-heading"><div><p className="staff-eyebrow">Staff supervisor workspace</p><h1>Good work starts with a clear queue.</h1><p>Coordinate assigned complaints, keep field work moving, and close the loop with residents.</p></div><button type="button" className="staff-secondary" onClick={loadDashboard} disabled={loading}><RefreshCw size={16} /> Refresh</button></section>
      {error && <div className="staff-error" role="alert">{error}</div>}
      <section className="staff-kpis" aria-label="Work summary"><article className="staff-kpi"><span>Assigned complaints</span><strong>{loading ? "--" : complaints.length}</strong></article><article className="staff-kpi"><span>Active tasks</span><strong>{loading ? "--" : activeTasks.length}</strong></article><article className="staff-kpi"><span>Completed tasks</span><strong>{loading ? "--" : completedTasks.length}</strong></article><article className="staff-kpi"><span>High priority</span><strong>{loading ? "--" : highPriority}</strong></article></section>
      <div className="staff-grid">
        <section className="staff-panel"><div className="staff-section-heading"><div><h2>My operational queue</h2><p>Move work through the verified field workflow.</p></div><ClipboardList size={22} color="#14845f" /></div>{loading ? <div className="staff-empty">Loading assigned work...</div> : tasks.length === 0 ? <div className="staff-empty">No tasks are assigned to you yet.</div> : <div className="staff-task-list">{tasks.map((task) => <article className="staff-task" key={task.id}><div className="staff-task-top"><div><h3>Task #{task.id}</h3><p>Complaint #{task.complaintId} · Assigned {task.assignedAt ? new Date(task.assignedAt).toLocaleDateString() : "recently"}</p></div><span className="staff-badge">{task.status?.replace("_", " ")}</span></div><div className="staff-task-actions"><button type="button" className="staff-secondary" onClick={() => showComplaint(task.id)}>View complaint</button>{nextStatuses[task.status] && <button type="button" className={`staff-status-button ${nextStatuses[task.status] === "COMPLETED" ? "complete" : ""}`} onClick={() => updateStatus(task)} disabled={saving}>{nextStatuses[task.status] === "COMPLETED" ? <><CheckCircle2 size={15} /> Mark completed</> : `Move to ${nextStatuses[task.status].replace("_", " ")}`}</button>}</div><div className="staff-notes"><input value={note[task.id] || ""} onChange={(event) => setNote((current) => ({ ...current, [task.id]: event.target.value }))} placeholder="Add an operational note" /><button type="button" className="staff-status-button" onClick={() => saveNote(task.id)} disabled={saving}>Save note</button></div></article>)}</div>}</section>
        <aside className="staff-panel"><div className="staff-section-heading"><div><h2>Supervisor profile</h2><p>Keep your availability accurate.</p></div><Users size={22} color="#14845f" /></div><div className="staff-profile-row"><span>Name</span><strong>{staff.name || "Staff supervisor"}</strong></div><div className="staff-profile-row"><span>Zone</span><strong>{staff.zone || "All assigned zones"}</strong></div><div className="staff-profile-row"><span>Department</span><strong>{staff.department || "Operations"}</strong></div><div className="staff-profile-row"><span>Availability</span><label className="staff-toggle"><input type="checkbox" checked={staff.available !== false} disabled={saving} onChange={(event) => setAvailability(event.target.checked)} /> {staff.available === false ? "Unavailable" : "Available"}</label></div><div className="staff-report-list"><div className="staff-report"><span>Team workload</span><strong>{activeTasks.length}</strong></div><div className="staff-report"><span>Completion rate</span><strong>{tasks.length ? `${Math.round((completedTasks.length / tasks.length) * 100)}%` : "0%"}</strong></div></div></aside>
        <section className="staff-panel"><div className="staff-section-heading"><div><h2>Assigned complaints</h2><p>Location and priority context for your queue.</p></div><MapPin size={22} color="#14845f" /></div>{complaints.length === 0 ? <div className="staff-empty">Assigned complaint details will appear here.</div> : <div className="staff-complaint-list">{complaints.map((complaint) => <article className="staff-complaint" key={complaint.id}><div className="staff-task-top"><div><h3>#{complaint.id} {complaint.title}</h3><p>{complaint.status} · Reported {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : "recently"}</p></div><span className={`staff-badge ${complaint.priority?.toUpperCase() === "HIGH" ? "high" : ""}`}>{complaint.priority || "Normal"}</span></div></article>)}</div>}</section>
        <section className="staff-panel"><div className="staff-section-heading"><div><h2>Operational reports</h2><p>Live metrics for your assigned work.</p></div><CheckCircle2 size={22} color="#14845f" /></div><div className="staff-report-list"><div className="staff-report"><span>Pending work</span><strong>{tasks.filter((task) => task.status === "PENDING").length}</strong></div><div className="staff-report"><span>In progress</span><strong>{tasks.filter((task) => ["ASSIGNED", "IN_PROGRESS"].includes(task.status)).length}</strong></div><div className="staff-report"><span>Resolved complaints</span><strong>{complaints.filter((complaint) => complaint.status === "RESOLVED").length}</strong></div><div className="staff-report"><span>Priority alerts</span><strong>{highPriority}</strong></div></div></section>
      </div>

      <section className="staff-panel dispatch-panel" style={{ marginTop: 24 }}>
        <div className="staff-section-heading"><div><h2>Company dispatch board</h2><p>Assign workers and drivers based on complaint type, priority, and location.</p></div><Users size={22} color="#14845f" /></div>
        <form className="dispatch-form" onSubmit={assignTask}>
          <label>
            Complaint
            <select value={selectedAssignment.complaintId} onChange={(event) => setSelectedAssignment((current) => ({ ...current, complaintId: event.target.value }))}>
              <option value="">Select complaint</option>
              {(dispatchQueue || []).map((complaint) => (
                <option key={complaint.id} value={complaint.id}>#{complaint.id} · {complaint.title} · {complaint.zone || "Unassigned zone"}</option>
              ))}
            </select>
          </label>
          <label>
            Assignment type
            <select value={selectedAssignment.type} onChange={(event) => setSelectedAssignment((current) => ({ ...current, type: event.target.value }))}>
              <option value="WORKER">Worker</option>
              <option value="DRIVER">Driver</option>
              <option value="FIELD">Field Crew</option>
            </select>
          </label>
          <label>
            Priority
            <select value={selectedAssignment.priority} onChange={(event) => setSelectedAssignment((current) => ({ ...current, priority: event.target.value }))}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
          <label>
            Zone
            <input value={selectedAssignment.zone || profile?.staff?.zone || ""} onChange={(event) => setSelectedAssignment((current) => ({ ...current, zone: event.target.value }))} placeholder="Zone A" />
          </label>
          <label>
            Available team member
            <select value={selectedAssignment.staffId} onChange={(event) => setSelectedAssignment((current) => ({ ...current, staffId: event.target.value }))}>
              <option value="">Choose team member</option>
              {(dispatchTeam || []).map((member) => (
                <option key={member.id} value={member.id}>{member.name} · {member.department || "Operations"} · {member.zone || "All zones"} · {member.assignedTasks} active tasks</option>
              ))}
            </select>
          </label>
          <button type="submit" className="staff-primary" disabled={saving}>Assign to team</button>
        </form>
      </section>
    </div>{selectedComplaint && <div className="staff-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelectedComplaint(null)}><section className="staff-panel staff-modal" role="dialog" aria-modal="true" aria-labelledby="staff-complaint-title"><div className="staff-section-heading"><div><p className="staff-eyebrow">Complaint #{selectedComplaint.id}</p><h2 id="staff-complaint-title">{selectedComplaint.title}</h2></div><button type="button" className="staff-secondary" onClick={() => setSelectedComplaint(null)} aria-label="Close complaint details"><X size={18} /></button></div><p>{selectedComplaint.description}</p><div className="staff-profile-row"><span>Location</span><strong>{selectedComplaint.zone || "Zone not specified"}{selectedComplaint.latitude != null && ` · ${selectedComplaint.latitude}, ${selectedComplaint.longitude}`}</strong></div><div className="staff-profile-row"><span>Priority / status</span><strong>{selectedComplaint.priority || "Normal"} · {selectedComplaint.status}</strong></div></section></div>}</main>
  );
}

export default StaffDashboard;

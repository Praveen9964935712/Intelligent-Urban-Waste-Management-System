import { useEffect, useEffectEvent, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { deleteComplaint, listComplaints, updateComplaintStatus } from "../../services/complaintService";
import "./AdminModulePlaceholder.css";

function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      setComplaints(await listComplaints());
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  const loadComplaintsEvent = useEffectEvent(loadComplaints);
  useEffect(() => {
    const request = setTimeout(() => loadComplaintsEvent(), 0);
    return () => clearTimeout(request);
  }, []);

  const changeStatus = async (complaint, status) => {
    try {
      const updated = await updateComplaintStatus(complaint.id, status);
      setComplaints((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to update complaint.");
    }
  };

  const removeComplaint = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await deleteComplaint(id);
      setComplaints((current) => current.filter((complaint) => complaint.id !== id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to delete complaint.");
    }
  };

  return (
    <AdminLayout>
      <main className="admin-module-placeholder">
        <section className="admin-module-hero">
          <span className="admin-module-eyebrow">Operations / Complaints</span>
          <h1>Complaints</h1>
          <p>Review incoming reports and keep neighborhood issues moving toward resolution.</p>
        </section>
        {error && <p role="alert">{error}</p>}
        {loading ? <p>Loading complaints...</p> : !complaints.length ? <section className="admin-module-empty"><h2>No complaints found</h2></section> : <section className="admin-module-empty complaints-table-panel"><div className="complaints-table-wrap"><table><thead><tr><th>Complaint</th><th>Zone</th><th>Priority</th><th>Status</th><th>Actions</th></tr></thead><tbody>{complaints.map((complaint) => <tr key={complaint.id}><td><strong>#{complaint.id}</strong> {complaint.title}</td><td>{complaint.zone || "-"}</td><td>{complaint.priority || "-"}</td><td><select value={complaint.status || "PENDING"} onChange={(event) => changeStatus(complaint, event.target.value)}><option>PENDING</option><option>ASSIGNED</option><option>RESOLVED</option></select></td><td><button type="button" onClick={() => removeComplaint(complaint.id)}>Delete</button></td></tr>)}</tbody></table></div></section>}
      </main>
    </AdminLayout>
  );
}

export default ComplaintsPage;

import { useEffect, useEffectEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { listComplaints } from "../../services/complaintService";
import { listManagedStaff } from "../../services/staffManagementService";
import { listManagedTasks } from "../../services/taskManagementService";
import "./AdminModulePlaceholder.css";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const [results, setResults] = useState({ complaints: [], tasks: [], staff: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResults = async () => {
    setLoading(true);
    setError("");
    try {
      const [complaints, tasks, staff] = await Promise.all([
        listComplaints(),
        listManagedTasks({ search: query, page: 0, size: 10 }),
        listManagedStaff({ search: query, page: 0, size: 10 }),
      ]);
      const normalizedQuery = query.toLowerCase();
      setResults({
        complaints: complaints.filter((complaint) => !normalizedQuery || `${complaint.id} ${complaint.title} ${complaint.description} ${complaint.zone}`.toLowerCase().includes(normalizedQuery)),
        tasks: tasks.content || [],
        staff: staff.content || [],
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to search operations.");
    } finally {
      setLoading(false);
    }
  };

  const loadResultsEvent = useEffectEvent(loadResults);
  useEffect(() => {
    const request = setTimeout(() => loadResultsEvent(), 0);
    return () => clearTimeout(request);
  }, [query]);

  return <AdminLayout><main className="admin-module-placeholder"><section className="admin-module-hero"><span className="admin-module-eyebrow">Operations / Search</span><h1>Search results</h1><p>{query ? `Results for "${query}"` : "Enter a search term to find complaints, tasks, or staff."}</p></section>{error && <p role="alert">{error}</p>}{loading ? <p>Searching operations...</p> : <section className="admin-module-empty"><div><h2>Complaints ({results.complaints.length})</h2>{results.complaints.map((complaint) => <p key={complaint.id}>#{complaint.id} {complaint.title} · {complaint.status}</p>)}<h2>Tasks ({results.tasks.length})</h2>{results.tasks.map((task) => <p key={task.id}>Task #{task.id} · {task.complaintReference} · {task.assignedStaff}</p>)}<h2>Staff ({results.staff.length})</h2>{results.staff.map((member) => <p key={member.id}>{member.name} · {member.department || "No department"}</p>)}</div></section>}</main></AdminLayout>;
}

export default SearchPage;

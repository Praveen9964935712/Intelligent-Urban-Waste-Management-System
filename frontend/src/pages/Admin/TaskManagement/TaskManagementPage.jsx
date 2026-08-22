import { useEffect, useEffectEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ClipboardList, Clock3, Plus, RefreshCw, CircleCheck, Timer } from "lucide-react";
import AdminLayout from "../../../layouts/AdminLayout";
import TaskFilters from "../../../components/admin/Tasks/TaskFilters";
import TaskTable from "../../../components/admin/Tasks/TaskTable";
import TaskCard from "../../../components/admin/Tasks/TaskCard";
import TaskModal from "../../../components/admin/Tasks/TaskModal";
import {
  completeManagedTask,
  createManagedTask,
  getTaskManagementStats,
  listManagedTasks,
  updateManagedTask,
} from "../../../services/taskManagementService";
import "./TaskManagementPage.css";
import "../../../components/admin/Tasks/TaskManagement.css";

const initialFilters = { search: "", status: "ALL", priority: "", sortBy: "assignedAt", sortDirection: "desc", page: 0, size: 10 };

function TaskManagementPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({ ...initialFilters, search: searchParams.get("search") || "" }));
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasks: 0, inProgressTasks: 0, completedTasks: 0 });
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ open: false, mode: "view", task: null });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [taskPage, taskStats] = await Promise.all([
        listManagedTasks(filters),
        getTaskManagementStats(),
      ]);
      setTasks(taskPage.content || []);
      setPagination({ page: taskPage.page || 0, totalPages: taskPage.totalPages || 0, totalElements: taskPage.totalElements || 0 });
      setStats(taskStats);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const loadDataEvent = useEffectEvent(loadData);
  useEffect(() => {
    const request = setTimeout(() => loadDataEvent(), 0);
    return () => clearTimeout(request);
  }, [filters]);

  const updateFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value, page: field === "page" ? value : 0 }));
  const resetFilters = () => setFilters(initialFilters);

  const saveTask = async (payload) => {
    setSaving(true);
    try {
      if (modal.mode === "create") await createManagedTask(payload);
      else if (payload.status === "COMPLETED" && modal.task.status !== "COMPLETED") await completeManagedTask(modal.task.id);
      else await updateManagedTask(modal.task.id, payload);
      setModal({ open: false, mode: "view", task: null });
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to save task.");
    } finally {
      setSaving(false);
    }
  };

  const completeTask = async (task) => {
    if (saving || task.status === "COMPLETED") return;
    setSaving(true);
    setError("");
    try {
      await completeManagedTask(task.id);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to complete task.");
    } finally {
      setSaving(false);
    }
  };

  const openModal = (mode, task = null) => setModal({ open: true, mode, task });

  const summaryCards = [
    { label: "Total tasks", value: stats.totalTasks, icon: ClipboardList, tone: "blue" },
    { label: "Pending", value: stats.pendingTasks, icon: Clock3, tone: "amber" },
    { label: "In progress", value: stats.inProgressTasks, icon: Timer, tone: "teal" },
    { label: "Completed", value: stats.completedTasks, icon: CircleCheck, tone: "green" },
  ];

  return (
    <AdminLayout>
      <main className="task-management-page">
        <header className="task-page-header">
          <div><span className="eyebrow">Operations / Tasks</span><h1>Task management</h1><p>Coordinate assignments, priorities, and completion across city operations.</p></div>
          <div className="task-page-actions"><button type="button" className="button-secondary" onClick={loadData} disabled={loading}><RefreshCw size={16} /> Refresh</button><button type="button" className="button-primary" onClick={() => openModal("create")}><Plus size={17} /> Assign task</button></div>
        </header>

        <section className="task-summary-grid" aria-label="Task summary">
          {summaryCards.map(({ label, value, icon: Icon, tone }) => <article className={`task-summary-card tone-${tone}`} key={label}><span className="task-summary-icon"><Icon size={19} /></span><div><span>{label}</span><strong>{loading ? "--" : value}</strong></div></article>)}
        </section>

        <section className="task-list-panel">
          <div className="task-list-heading"><div><h2>All tasks</h2><span>{pagination.totalElements} records</span></div><TaskFilters filters={filters} onChange={updateFilter} onReset={resetFilters} /></div>
          {error && <div className="task-error" role="alert">{error}<button type="button" onClick={loadData}>Try again</button></div>}
          {loading ? <div className="task-loading"><span /><span /><span /> Loading task records...</div> : tasks.length === 0 ? <div className="task-empty"><ClipboardList size={28} /><h3>No tasks match these filters</h3><p>Adjust the search or assign a new task to get started.</p></div> : <><TaskTable tasks={tasks} onView={(task) => openModal("view", task)} onEdit={(task) => openModal("edit", task)} onComplete={completeTask} /><div className="task-card-list">{tasks.map((task) => <TaskCard key={task.id} task={task} onView={(item) => openModal("view", item)} onEdit={(item) => openModal("edit", item)} onComplete={completeTask} />)}</div></>}
          {!loading && pagination.totalPages > 1 && <div className="task-pagination"><button type="button" onClick={() => updateFilter("page", pagination.page - 1)} disabled={pagination.page === 0}>Previous</button><span>Page {pagination.page + 1} of {pagination.totalPages}</span><button type="button" onClick={() => updateFilter("page", pagination.page + 1)} disabled={pagination.page + 1 >= pagination.totalPages}>Next</button></div>}
        </section>
      </main>
      {modal.open && <TaskModal task={modal.task} mode={modal.mode} onClose={() => setModal({ open: false, mode: "view", task: null })} onSave={saveTask} saving={saving} />}
    </AdminLayout>
  );
}

export default TaskManagementPage;

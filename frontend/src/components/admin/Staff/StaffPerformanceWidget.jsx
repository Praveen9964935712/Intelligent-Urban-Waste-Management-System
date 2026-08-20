import { BarChart3, CheckCircle2, Clock3, ListTodo } from "lucide-react";

function StaffPerformanceWidget({ performance }) {
  const metrics = [
    { label: "Resolved complaints", value: performance?.resolvedComplaints ?? 0, icon: CheckCircle2, suffix: "" },
    { label: "Average resolution", value: performance?.averageResolutionHours ?? 0, icon: Clock3, suffix: " hrs" },
    { label: "Task completion rate", value: performance?.taskCompletionRate ?? 0, icon: BarChart3, suffix: "%" },
    { label: "Active workload", value: performance?.activeTasks ?? 0, icon: ListTodo, suffix: ` / ${performance?.totalTasks ?? 0}` },
  ];
  return <div className="staff-performance-widget"><div className="staff-widget-heading"><div><span className="eyebrow">Performance dashboard</span><h3>Operational scorecard</h3></div><span className="widget-period">All time</span></div><div className="staff-performance-grid">{metrics.map(({ label, value, icon: Icon, suffix }) => <div className="staff-performance-metric" key={label}><span className="metric-icon"><Icon size={17} /></span><div><strong>{value}{suffix}</strong><span>{label}</span></div></div>)}</div><div className="workload-track"><div><span>Workload analysis</span><strong>{performance?.totalTasks ? Math.round((performance.activeTasks / performance.totalTasks) * 100) : 0}% active</strong></div><div className="workload-bar"><span style={{ width: `${performance?.totalTasks ? Math.min((performance.activeTasks / performance.totalTasks) * 100, 100) : 0}%` }} /></div></div></div>;
}

export default StaffPerformanceWidget;

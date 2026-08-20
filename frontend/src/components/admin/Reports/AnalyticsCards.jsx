import { BarChart3, CheckCircle2, ClipboardList, UsersRound } from "lucide-react";

function AnalyticsCards({ data, loading }) {
  const cards = [
    { label: "Total complaints", value: data?.stats?.totalComplaints, icon: ClipboardList, tone: "blue" },
    { label: "Resolved complaints", value: data?.stats?.resolvedComplaints, icon: CheckCircle2, tone: "green" },
    { label: "Staff available", value: data?.stats?.availableStaff, icon: UsersRound, tone: "amber" },
    { label: "Total tasks", value: data?.taskStats?.assignedTasks, icon: BarChart3, tone: "teal" },
  ];
  return <section className="analytics-cards" aria-label="Analytics summary">{cards.map(({ label, value, icon: Icon, tone }) => <article className={`analytics-card analytics-${tone}`} key={label}><span className="analytics-card-icon"><Icon size={19} /></span><div><span>{label}</span><strong>{loading ? "--" : value ?? 0}</strong></div></article>)}</section>;
}

export default AnalyticsCards;

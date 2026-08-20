import { CheckCircle2, ClipboardList, Clock3, UserRoundCheck } from "lucide-react";

function CitizenStatsCards({ stats, loading }) {
  const cards = [{ label: "My complaints", value: stats?.totalComplaints, icon: ClipboardList, tone: "blue" }, { label: "Awaiting review", value: stats?.pendingComplaints, icon: Clock3, tone: "amber" }, { label: "In progress", value: stats?.assignedComplaints, icon: UserRoundCheck, tone: "teal" }, { label: "Resolved", value: stats?.resolvedComplaints, icon: CheckCircle2, tone: "green" }];
  return <section className="citizen-stats-grid" aria-label="Complaint statistics">{cards.map(({ label, value, icon: Icon, tone }) => <article className={`citizen-stat-card tone-${tone}`} key={label}><span className="citizen-stat-icon"><Icon size={19} /></span><div><span>{label}</span><strong>{loading ? "--" : value ?? 0}</strong></div></article>)}</section>;
}

export default CitizenStatsCards;

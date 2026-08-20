import { Check, Circle, MapPin, UserRound } from "lucide-react";

function ComplaintTracker({ complaint, onSelect }) {
  return <article className="complaint-card"><div className="complaint-card-top"><div><span className="complaint-id">Complaint #{complaint.id}</span><h3>{complaint.title}</h3></div><span className={`citizen-status status-${complaint.status?.toLowerCase()}`}>{complaint.status}</span></div><p>{complaint.description}</p><div className="complaint-meta"><span><MapPin size={14} /> {complaint.zone || "Zone not set"}</span><span><UserRound size={14} /> {complaint.assignedStaffName || "Awaiting assignment"}</span><span className={`priority priority-${complaint.priority?.toLowerCase()}`}>{complaint.priority}</span></div><div className="timeline-preview">{complaint.timeline?.map((step) => <div className={`timeline-step ${step.complete ? "complete" : ""}`} key={step.label}><span>{step.complete ? <Check size={12} /> : <Circle size={10} />}</span><small>{step.label}</small></div>)}</div><button type="button" className="tracker-button" onClick={() => onSelect(complaint)}>View tracking details</button></article>;
}

export default ComplaintTracker;

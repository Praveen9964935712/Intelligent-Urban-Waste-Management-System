import { Bell, Info, CheckCircle2, AlertTriangle } from "lucide-react";

function NotificationPanel({ notifications = [], onRead, onDismiss }) {
  const iconFor = (type) => type?.includes("RESOLVED") ? CheckCircle2 : type?.includes("ALERT") ? AlertTriangle : Info;
  return <section className="citizen-panel notification-panel"><div className="citizen-panel-heading"><div><span className="citizen-eyebrow">Stay informed</span><h2>Recent updates</h2></div><Bell size={19} /></div>{notifications.length ? <div className="notification-list">{notifications.map((notification) => { const Icon = iconFor(notification.type); return <article className="notification-item" key={notification.id}><span className="notification-icon"><Icon size={16} /></span><div><strong>{notification.message}</strong><time>{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "Recently"}</time><div><button type="button" onClick={() => onRead(notification.id)} disabled={notification.read}>{notification.read ? "Read" : "Mark read"}</button><button type="button" onClick={() => onDismiss(notification.id)}>Dismiss</button></div></div></article>; })}</div> : <p className="citizen-muted">You are all caught up.</p>}</section>;
}

export default NotificationPanel;

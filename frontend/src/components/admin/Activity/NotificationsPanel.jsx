import { useEffect, useState } from "react";
import { deleteNotification, getNotifications, markNotificationRead } from "../../../services/notificationService";
import "./NotificationsPanel.css";

function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setNotifications(await getNotifications());
      } catch (requestError) {
        setError(requestError.message || "Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "alert":
        return "⚠️";
      case "success":
        return "✅";
      case "info":
        return "ℹ️";
      case "warning":
        return "🔔";
      default:
        return "📌";
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const markRead = async (id) => {
    const updated = await markNotificationRead(id);
    setNotifications((current) => current.map((notification) => notification.id === updated.id ? updated : notification));
  };

  const dismiss = async (id) => {
    await deleteNotification(id);
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  };

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
      </div>
      <div className="notifications-list">
        {loading && <p className="notification-time">Loading notifications...</p>}
        {!loading && error && <p className="notification-time">{error}</p>}
        {!loading && !error && !notifications.length && <p className="notification-time">No notifications</p>}
        {!loading && !error && notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item notification-${notification.type?.toLowerCase() || "info"} unread`}
          >
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
              <p className="notification-time">
                {formatTime(notification.createdAt)}
              </p>
              {!notification.read && <button type="button" onClick={() => markRead(notification.id)}>Mark read</button>}
              <button type="button" onClick={() => dismiss(notification.id)}>Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPanel;

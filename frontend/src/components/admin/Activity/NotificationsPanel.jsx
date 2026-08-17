import { useState, useEffect } from "react";
import "./NotificationsPanel.css";

function NotificationsPanel() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "High Priority Complaint",
      message: "New urgent complaint in Zone A requires immediate attention",
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: 2,
      type: "success",
      title: "Complaint Resolved",
      message: "Complaint #1234 has been successfully resolved",
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "Task Assigned",
      message: "New task assigned to Staff Member John",
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true,
    },
  ]);

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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
      </div>
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item notification-${notification.type} ${
              !notification.read ? "unread" : ""
            }`}
          >
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
              <p className="notification-title">{notification.title}</p>
              <p className="notification-message">{notification.message}</p>
              <p className="notification-time">
                {formatTime(notification.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsPanel;

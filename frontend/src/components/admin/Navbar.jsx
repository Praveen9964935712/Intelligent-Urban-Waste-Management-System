import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../../services/notificationService";
import "./Navbar.css";

function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    window.location.href = "/login";
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    if (query) navigate(`/admin/search?q=${encodeURIComponent(query)}`);
  };

  const handleNotifications = async () => {
    const nextOpen = !showNotifications;
    setShowNotifications(nextOpen);
    if (!nextOpen || notifications.length) return;
    setNotificationsLoading(true);
    try {
      setNotifications(await getNotifications());
    } catch {
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <span className="brand-icon">🏘️</span>
          <h2>Waste Management</h2>
        </div>

        {/* Center - Search (optional) */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search complaints, staff, tasks..."
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search tasks, complaints, or staff"
          />
          <span className="search-icon">🔍</span>
        </form>

        {/* Right - Actions */}
        <div className="navbar-actions">
          {/* Notifications */}
          <div className="navbar-item notifications">
            <button className="nav-button" onClick={handleNotifications} aria-label="Open notifications">
              <span className="notification-icon">🔔</span>
              {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
            </button>
            {showNotifications && <div className="profile-menu">
              <div className="profile-menu-item">Notifications</div>
              {notificationsLoading && <div className="profile-menu-item">Loading...</div>}
              {!notificationsLoading && !notifications.length && <div className="profile-menu-item">No notifications</div>}
              {!notificationsLoading && notifications.map((notification) => <div className="profile-menu-item" key={notification.id}>{notification.message}</div>)}
            </div>}
          </div>

          {/* Help */}
          <div className="navbar-item">
            <button className="nav-button help-button" title="Help" aria-label="Open help" onClick={() => setShowHelp(!showHelp)}>
              ❓
            </button>
            {showHelp && <div className="profile-menu">
              <div className="profile-menu-item">Help</div>
              <div className="profile-menu-item">Use the sidebar to open an operations module. Contact your administrator for account or access issues.</div>
            </div>}
          </div>

          {/* Profile Dropdown */}
          <div className="navbar-item profile-dropdown">
            <button
              className="profile-button"
              onClick={() => setShowProfile(!showProfile)}
            >
              <span className="profile-avatar">👤</span>
              <span className="profile-text">Admin</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showProfile && (
              <div className="profile-menu">
                <button type="button" onClick={() => navigate("/admin/settings?section=profile")} className="profile-menu-item">
                  👤 Profile Settings
                </button>
                <button type="button" onClick={() => navigate("/admin/settings?section=preferences")} className="profile-menu-item">
                  ⚙️ Preferences
                </button>
                <div className="profile-menu-divider"></div>
                <button
                  onClick={handleLogout}
                  className="profile-menu-item logout-btn"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search complaints, staff, tasks..."
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Right - Actions */}
        <div className="navbar-actions">
          {/* Notifications */}
          <div className="navbar-item notifications">
            <button className="nav-button">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
          </div>

          {/* Help */}
          <div className="navbar-item">
            <button className="nav-button help-button" title="Help">
              ❓
            </button>
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
                <a href="#profile" className="profile-menu-item">
                  👤 Profile Settings
                </a>
                <a href="#preferences" className="profile-menu-item">
                  ⚙️ Preferences
                </a>
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
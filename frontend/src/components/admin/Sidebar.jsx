import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: "📊",
      label: "Dashboard",
      path: "/admin/dashboard",
      section: "main",
    },
    {
      icon: "📋",
      label: "Complaints",
      path: "/admin/complaints",
      section: "operations",
    },
    {
      icon: "✅",
      label: "Tasks",
      path: "/admin/tasks",
      section: "operations",
    },
    {
      icon: "👥",
      label: "Staff",
      path: "/admin/staff",
      section: "management",
    },
    {
      icon: "📈",
      label: "Analytics",
      path: "/admin/analytics",
      section: "reports",
    },
    {
      icon: "⚙️",
      label: "Settings",
      path: "/admin/settings",
      section: "settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="logo-section">
          <span className="logo-icon">🏘️</span>
          {!collapsed && <span className="logo-text">CleanCity</span>}
        </div>
        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          {!collapsed && <span className="section-label">MAIN</span>}
          <ul className="menu-list">
            {menuItems
              .filter((item) => item.section === "main")
              .map((item, index) => (
                <li key={index} className="menu-item">
                  <button
                    className={`menu-link ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => handleNavigation(item.path)}
                    title={item.label}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    {!collapsed && <span className="menu-label">{item.label}</span>}
                    {isActive(item.path) && !collapsed && (
                      <span className="menu-indicator"></span>
                    )}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="nav-section">
          {!collapsed && <span className="section-label">OPERATIONS</span>}
          <ul className="menu-list">
            {menuItems
              .filter((item) => item.section === "operations")
              .map((item, index) => (
                <li key={index} className="menu-item">
                  <button
                    className={`menu-link ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => handleNavigation(item.path)}
                    title={item.label}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    {!collapsed && <span className="menu-label">{item.label}</span>}
                    {isActive(item.path) && !collapsed && (
                      <span className="menu-indicator"></span>
                    )}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="nav-section">
          {!collapsed && <span className="section-label">MANAGEMENT</span>}
          <ul className="menu-list">
            {menuItems
              .filter((item) => item.section === "management")
              .map((item, index) => (
                <li key={index} className="menu-item">
                  <button
                    className={`menu-link ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => handleNavigation(item.path)}
                    title={item.label}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    {!collapsed && <span className="menu-label">{item.label}</span>}
                    {isActive(item.path) && !collapsed && (
                      <span className="menu-indicator"></span>
                    )}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="nav-section">
          {!collapsed && <span className="section-label">REPORTS</span>}
          <ul className="menu-list">
            {menuItems
              .filter((item) => item.section === "reports")
              .map((item, index) => (
                <li key={index} className="menu-item">
                  <button
                    className={`menu-link ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => handleNavigation(item.path)}
                    title={item.label}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    {!collapsed && <span className="menu-label">{item.label}</span>}
                    {isActive(item.path) && !collapsed && (
                      <span className="menu-indicator"></span>
                    )}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </nav>

      {/* Settings Section */}
      <div className="sidebar-footer">
        <div className="nav-section">
          {!collapsed && <span className="section-label">SYSTEM</span>}
          <ul className="menu-list">
            {menuItems
              .filter((item) => item.section === "settings")
              .map((item, index) => (
                <li key={index} className="menu-item">
                  <button
                    className={`menu-link ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => handleNavigation(item.path)}
                    title={item.label}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    {!collapsed && <span className="menu-label">{item.label}</span>}
                    {isActive(item.path) && !collapsed && (
                      <span className="menu-indicator"></span>
                    )}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <span className="menu-icon">🚪</span>
          {!collapsed && <span className="menu-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
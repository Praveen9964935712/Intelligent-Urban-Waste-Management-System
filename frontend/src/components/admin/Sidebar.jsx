import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <div className="logo">
        CleanCity
      </div>

      <ul className="menu">

        <li>Dashboard</li>

        <li>Complaints</li>

        <li>Tasks</li>

        <li>Staff</li>

        <li>Analytics</li>

        <li>Logout</li>

      </ul>

    </div>
  );
}

export default Sidebar;
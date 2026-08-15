import "./AdminLayout.css";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="main-section">
        <Navbar />

        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
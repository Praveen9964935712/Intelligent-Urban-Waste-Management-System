import { useState } from "react";
import "./AdminLayout.css";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";

function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar mobileMenuOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      {mobileMenuOpen && <button className="sidebar-overlay" type="button" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />}

      <div className="main-section">
        <Navbar onMenuToggle={() => setMobileMenuOpen((open) => !open)} />

        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
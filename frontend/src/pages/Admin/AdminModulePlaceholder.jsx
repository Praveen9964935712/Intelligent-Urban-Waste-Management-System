import AdminLayout from "../../layouts/AdminLayout";
import "./AdminModulePlaceholder.css";

function AdminModulePlaceholder({ eyebrow, title, description, detail }) {
  return (
    <AdminLayout>
      <main className="admin-module-placeholder">
        <section className="admin-module-hero">
          <span className="admin-module-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </section>

        <section className="admin-module-empty" aria-live="polite">
          <div className="admin-module-empty-icon" aria-hidden="true">+</div>
          <div>
            <h2>{detail}</h2>
            <p>This module is ready for the next data integration. Your dashboard and other operations remain available.</p>
          </div>
        </section>
      </main>
    </AdminLayout>
  );
}

export default AdminModulePlaceholder;

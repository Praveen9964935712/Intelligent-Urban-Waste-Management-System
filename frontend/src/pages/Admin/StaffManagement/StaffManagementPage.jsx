import { useEffect, useEffectEvent, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Plus,
  RefreshCw,
  Users,
  X,
} from "lucide-react";
import AdminLayout from "../../../layouts/AdminLayout";
import StaffTable from "../../../components/admin/Staff/StaffTable";
import StaffCard from "../../../components/admin/Staff/StaffCard";
import StaffProfile from "../../../components/admin/Staff/StaffProfile";
import {
  createManagedStaff,
  getManagedStaffProfile,
  listManagedStaff,
  updateManagedStaff,
  updateManagedStaffAvailability,
} from "../../../services/staffManagementService";
import "../../../components/admin/Staff/StaffManagement.css";
import "./StaffManagementPage.css";

const initialFilters = {
  search: "",
  department: "",
  zone: "",
  available: "",
  page: 0,
  size: 10,
  sortBy: "name",
  sortDirection: "asc",
};
const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  department: "",
  zone: "",
  available: true,
};

function StaffManagementPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [staff, setStaff] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ type: "", member: null, profile: null });
  const [form, setForm] = useState(emptyForm);

  const loadStaff = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listManagedStaff({
        ...filters,
        available: filters.available === "" ? undefined : filters.available,
      });
      setStaff(result.content || []);
      setPagination({
        page: result.page || 0,
        totalPages: result.totalPages || 0,
        totalElements: result.totalElements || 0,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to load staff.",
      );
    } finally {
      setLoading(false);
    }
  };
  const loadStaffEvent = useEffectEvent(loadStaff);
  useEffect(() => {
    const request = setTimeout(() => loadStaffEvent(), 0);
    return () => clearTimeout(request);
  }, [filters]);

  const changeFilter = (field, value) =>
    setFilters((current) => ({
      ...current,
      [field]: value,
      page: field === "page" ? value : 0,
    }));
  const openForm = (type, member = null) => {
    setForm(
      member
        ? {
            name: member.name || "",
            email: member.email || "",
            password: "",
            phone: member.phone || "",
            department: member.department || "",
            zone: member.zone || "",
            available: member.available !== false,
          }
        : emptyForm,
    );
    setModal({ type, member, profile: null });
  };
  const openProfile = async (member) => {
    setModal({ type: "profile-loading", member, profile: null });
    try {
      const profile = await getManagedStaffProfile(member.id);
      setModal({ type: "profile", member, profile });
    } catch (requestError) {
      setError(requestError.message || "Unable to load profile.");
      setModal({ type: "", member: null, profile: null });
    }
  };
  const closeModal = () => setModal({ type: "", member: null, profile: null });
  const saveStaff = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (modal.type === "create") await createManagedStaff(form);
      else await updateManagedStaff(modal.member.id, form);
      closeModal();
      await loadStaff();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to save staff.",
      );
    } finally {
      setSaving(false);
    }
  };
  const toggleAvailability = async (member) => {
    try {
      await updateManagedStaffAvailability(member.id, !member.available);
      await loadStaff();
    } catch (requestError) {
      setError(requestError.message || "Unable to update staff availability.");
    }
  };

  const summary = [
    { label: "Total staff", value: pagination.totalElements, icon: Users },
    {
      label: "Active staff",
      value: staff.filter((member) => member.available).length,
      icon: CheckCircle2,
    },
    {
      label: "Departments",
      value: new Set(staff.map((member) => member.department).filter(Boolean))
        .size,
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <AdminLayout>
      <main className="staff-management-page">
        <header className="staff-page-header">
          <div>
            <span className="eyebrow">People / Staff directory</span>
            <h1>Staff management</h1>
            <p>
              Manage field teams, availability, and operational performance.
            </p>
          </div>
          <div className="staff-page-actions">
            <button
              type="button"
              className="staff-secondary-button"
              onClick={loadStaff}
              disabled={loading}
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <button
              type="button"
              className="staff-primary-button"
              onClick={() => openForm("create")}
            >
              <Plus size={17} /> Add staff
            </button>
          </div>
        </header>
        <section className="staff-summary-grid">
          {summary.map(({ label, value, icon: Icon }) => (
            <article className="staff-summary-card" key={label}>
              <Icon size={19} />
              <div>
                <span>{label}</span>
                <strong>{loading ? "--" : value}</strong>
              </div>
            </article>
          ))}
        </section>
        <section className="staff-directory-panel">
          <div className="staff-directory-toolbar">
            <div>
              <h2>Staff directory</h2>
              <span>{pagination.totalElements} team members</span>
            </div>
            <div className="staff-filters">
              <label>
                <span>Search</span>
                <input
                  value={filters.search}
                  onChange={(event) =>
                    changeFilter("search", event.target.value)
                  }
                  placeholder="Name, email, department"
                />
              </label>
              <label>
                <span>Department</span>
                <input
                  value={filters.department}
                  onChange={(event) =>
                    changeFilter("department", event.target.value)
                  }
                  placeholder="All departments"
                />
              </label>
              <label>
                <span>Zone</span>
                <input
                  value={filters.zone}
                  onChange={(event) => changeFilter("zone", event.target.value)}
                  placeholder="All zones"
                />
              </label>
              <label>
                <span>Status</span>
                <select
                  value={filters.available}
                  onChange={(event) =>
                    changeFilter("available", event.target.value)
                  }
                >
                  <option value="">All staff</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </label>
            </div>
          </div>
          {error && (
            <div className="staff-error" role="alert">
              {error}
              <button type="button" onClick={loadStaff}>
                Try again
              </button>
            </div>
          )}
          {loading ? (
            <div className="staff-loading">Loading staff directory...</div>
          ) : staff.length === 0 ? (
            <div className="staff-empty">
              <Users size={28} />
              <h3>No staff members found</h3>
              <p>Adjust the filters or add a team member.</p>
            </div>
          ) : (
            <>
              <StaffTable
                staff={staff}
                onView={openProfile}
                onEdit={(member) => openForm("edit", member)}
                onToggle={toggleAvailability}
              />
              <div className="staff-card-list">
                {staff.map((member) => (
                  <StaffCard
                    key={member.id}
                    member={member}
                    onView={openProfile}
                    onEdit={(item) => openForm("edit", item)}
                    onToggle={toggleAvailability}
                  />
                ))}
              </div>
            </>
          )}
          {!loading && pagination.totalPages > 1 && (
            <div className="staff-pagination">
              <button
                type="button"
                onClick={() => changeFilter("page", pagination.page - 1)}
                disabled={pagination.page === 0}
              >
                Previous
              </button>
              <span>
                Page {pagination.page + 1} of {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => changeFilter("page", pagination.page + 1)}
                disabled={pagination.page + 1 >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </section>
        {modal.type === "profile-loading" && (
          <div className="staff-modal-backdrop">
            <div className="staff-loading-modal">Loading profile...</div>
          </div>
        )}
        {modal.type === "profile" && (
          <div className="staff-modal-backdrop">
            <section className="staff-modal staff-profile-modal">
              <button
                type="button"
                className="profile-close"
                onClick={closeModal}
                title="Close"
              >
                <X size={19} />
              </button>
              <StaffProfile profile={modal.profile} />
            </section>
          </div>
        )}
        {(modal.type === "create" || modal.type === "edit") && (
          <div className="staff-modal-backdrop">
            <section className="staff-modal" role="dialog" aria-modal="true">
              <header className="staff-modal-header">
                <div>
                  <span className="eyebrow">People operations</span>
                  <h2>
                    {modal.type === "create"
                      ? "Add staff member"
                      : `Edit ${modal.member.name}`}
                  </h2>
                </div>
                <button
                  type="button"
                  className="profile-close"
                  onClick={closeModal}
                  title="Close"
                >
                  <X size={19} />
                </button>
              </header>
              <form className="staff-form" onSubmit={saveStaff}>
                <label>
                  Full name
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                  />
                </label>
                <label>
                  Work email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                  />
                </label>
                <label>
                  Login password
                  <input
                    required={modal.type === "create"}
                    minLength={6}
                    type="password"
                    value={form.password}
                    placeholder={
                      modal.type === "create"
                        ? "Set login password"
                        : "Leave blank to keep current password"
                    }
                    onChange={(event) =>
                      setForm({ ...form, password: event.target.value })
                    }
                  />
                </label>
                <label>
                  Phone
                  <input
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                  />
                </label>
                <label>
                  Department
                  <input
                    value={form.department}
                    onChange={(event) =>
                      setForm({ ...form, department: event.target.value })
                    }
                  />
                </label>
                <label>
                  Zone
                  <input
                    value={form.zone}
                    onChange={(event) =>
                      setForm({ ...form, zone: event.target.value })
                    }
                  />
                </label>
                <label className="staff-checkbox">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(event) =>
                      setForm({ ...form, available: event.target.checked })
                    }
                  />{" "}
                  Active and available
                </label>
                <footer>
                  <button
                    type="button"
                    className="staff-secondary-button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="staff-primary-button"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save staff"}
                  </button>
                </footer>
              </form>
            </section>
          </div>
        )}
      </main>
    </AdminLayout>
  );
}

export default StaffManagementPage;

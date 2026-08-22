import AdminLayout from "../../layouts/AdminLayout";
import KPICards from "../../components/admin/KPICards/KPICards";
import ComplaintTrendChart from "../../components/admin/Charts/ComplaintTrendChart";
import ComplaintStatusChart from "../../components/admin/Charts/ComplaintStatusChart";
import PriorityDistributionChart from "../../components/admin/Charts/PriorityDistributionChart";
import ZoneStatisticsChart from "../../components/admin/Charts/ZoneStatisticsChart";
import StaffPerformanceTable from "../../components/admin/Tables/StaffPerformanceTable";
import StaffWorkloadTable from "../../components/admin/Tables/StaffWorkloadTable";
import ActivityFeed from "../../components/admin/Activity/ActivityFeed";
import NotificationsPanel from "../../components/admin/Activity/NotificationsPanel";
import TaskStatistics from "../../components/admin/Tasks/TaskStatistics";
import TaskStatusOverview from "../../components/admin/Tasks/TaskStatusOverview";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 > City Operations Dashboard</h1>
            <p className="header-subtitle">Real-time waste management system overview</p>
          </div>
          <div className="header-info">
            <span className="last-updated">Last updated: Just now</span>
          </div>
        </div>

        {/* KPI Cards Section */}
        <section className="dashboard-section">
          <KPICards />
        </section>

        {/* Analytics Section */}
        <section className="dashboard-section">
          <h2 className="section-title">Analytics</h2>
          <div className="analytics-grid">
            <div className="chart-item full-width">
              <ComplaintTrendChart />
            </div>
            <div className="chart-item half-width">
              <ComplaintStatusChart />
            </div>
            <div className="chart-item half-width">
              <PriorityDistributionChart />
            </div>
            <div className="chart-item full-width">
              <ZoneStatisticsChart />
            </div>
          </div>
        </section>

        {/* Tasks Section */}
        <section className="dashboard-section">
          <h2 className="section-title">Tasks Management</h2>
          <div className="tasks-grid">
            <div className="tasks-item full-width">
              <TaskStatistics />
            </div>
            <div className="tasks-item full-width">
              <TaskStatusOverview />
            </div>
          </div>
        </section>

        {/* Staff Management Section */}
        <section className="dashboard-section">
          <h2 className="section-title">Staff Management</h2>
          <div className="staff-grid">
            <div className="staff-item full-width">
              <StaffPerformanceTable />
            </div>
            <div className="staff-item full-width">
              <StaffWorkloadTable />
            </div>
          </div>
        </section>

        {/* Activity Section */}
        <section className="dashboard-section">
          <h2 className="section-title">Activity & Notifications</h2>
          <div className="activity-grid">
            <div className="activity-item half-width">
              <ActivityFeed />
            </div>
            <div className="activity-item half-width">
              <NotificationsPanel />
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
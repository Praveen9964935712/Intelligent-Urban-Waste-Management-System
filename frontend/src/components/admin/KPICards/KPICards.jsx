import { useState, useEffect } from "react";
import { getDashboardStats } from "../../../services/dashboardService";
import StatCard from "../StatCard";
import "./KPICards.css";

function KPICards() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    staffMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats({
          totalComplaints: data.totalComplaints || 0,
          pendingComplaints: data.pendingComplaints || 0,
          resolvedComplaints: data.resolvedComplaints || 0,
          staffMembers: data.staffMembers || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <div className="kpi-error">Error loading stats: {error}</div>;
  }

  return (
    <div className="kpi-cards-container">
      <StatCard
        title="Total Complaints"
        value={stats.totalComplaints}
        loading={loading}
        icon="📋"
      />
      <StatCard
        title="Pending Complaints"
        value={stats.pendingComplaints}
        loading={loading}
        icon="⏳"
      />
      <StatCard
        title="Resolved Complaints"
        value={stats.resolvedComplaints}
        loading={loading}
        icon="✅"
      />
      <StatCard
        title="Staff Members"
        value={stats.staffMembers}
        loading={loading}
        icon="👥"
      />
    </div>
  );
}

export default KPICards;

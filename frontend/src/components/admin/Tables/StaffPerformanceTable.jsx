import { useState, useEffect } from "react";
import { getStaffPerformance } from "../../../services/dashboardService";
import "./StaffPerformanceTable.css";

function StaffPerformanceTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getStaffPerformance();
        setData(result || []);
      } catch (err) {
        console.error("Error fetching staff performance:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="table-error">Error loading data: {error}</div>;
  }

  if (loading) {
    return <div className="table-loading">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="table-empty">No staff data available</div>;
  }

  return (
    <div className="staff-performance-table">
      <h3>Staff Performance</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Complaints Resolved</th>
              <th>Efficiency Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((staff, index) => (
              <tr key={index}>
                <td>
                  <span className="staff-name">{staff.name}</span>
                </td>
                <td className="text-center">{staff.resolved}</td>
                <td className="text-center">
                  <div className="rating-bar">
                    <div
                      className="rating-fill"
                      style={{ width: `${staff.efficiency}%` }}
                    ></div>
                  </div>
                  <span className="rating-text">{staff.efficiency}%</span>
                </td>
                <td className="text-center">
                  <span className={`status-badge status-${staff.status?.toLowerCase()}`}>
                    {staff.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffPerformanceTable;

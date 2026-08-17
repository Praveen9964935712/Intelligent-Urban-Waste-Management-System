import { useState, useEffect } from "react";
import { getStaffWorkload } from "../../../services/dashboardService";
import "./StaffWorkloadTable.css";

function StaffWorkloadTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getStaffWorkload();
        setData(result || []);
      } catch (err) {
        console.error("Error fetching staff workload:", err);
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
    return <div className="table-empty">No workload data available</div>;
  }

  return (
    <div className="staff-workload-table">
      <h3>Staff Workload</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Active Tasks</th>
              <th>Workload</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            {data.map((staff, index) => {
              const workloadPercentage = (staff.activeTasks / staff.capacity) * 100;
              const workloadClass =
                workloadPercentage >= 80 ? "high" : workloadPercentage >= 50 ? "medium" : "low";

              return (
                <tr key={index}>
                  <td>
                    <span className="staff-name">{staff.name}</span>
                  </td>
                  <td className="text-center">{staff.activeTasks}</td>
                  <td className="text-center">
                    <div className="workload-bar">
                      <div
                        className={`workload-fill workload-${workloadClass}`}
                        style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="workload-text">{workloadPercentage.toFixed(0)}%</span>
                  </td>
                  <td className="text-center">{staff.capacity} tasks</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffWorkloadTable;

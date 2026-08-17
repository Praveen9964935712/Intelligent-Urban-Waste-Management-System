import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getZoneStatistics } from "../../../services/dashboardService";
import "./ZoneStatisticsChart.css";

function ZoneStatisticsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getZoneStatistics();
        setData(result || []);
      } catch (err) {
        console.error("Error fetching zone statistics:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="chart-error">Error loading data: {error}</div>;
  }

  if (loading) {
    return <div className="chart-loading">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="chart-empty">No data available</div>;
  }

  return (
    <div className="zone-statistics-chart">
      <h3>Zone Statistics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="zone" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              color: "#f1f5f9",
            }}
          />
          <Legend />
          <Bar dataKey="complaints" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="resolved" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ZoneStatisticsChart;

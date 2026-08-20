import { useEffect, useEffectEvent, useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import AdminLayout from "../../../layouts/AdminLayout";
import AnalyticsCards from "../../../components/admin/Reports/AnalyticsCards";
import ChartsSection from "../../../components/admin/Reports/ChartsSection";
import ReportsTable from "../../../components/admin/Reports/ReportsTable";
import ExportTools from "../../../components/admin/Reports/ExportTools";
import { getReportsAnalyticsData } from "../../../services/reportsAnalyticsService";
import "../../../components/admin/Reports/ReportsAnalytics.css";
import "./ReportsAnalyticsPage.css";

const reportTabs = [{ key: "complaints", label: "Complaints" }, { key: "staff", label: "Staff" }, { key: "tasks", label: "Tasks" }, { key: "zones", label: "Zones" }];

function ReportsAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeReport, setActiveReport] = useState("complaints");

  const loadData = async () => {
    setLoading(true); setError("");
    try { setData(await getReportsAnalyticsData()); } catch (requestError) { setError(requestError.response?.data?.message || requestError.message || "Unable to load analytics."); } finally { setLoading(false); }
  };
  const loadDataEvent = useEffectEvent(loadData);
  useEffect(() => { const request = setTimeout(() => loadDataEvent(), 0); return () => clearTimeout(request); }, []);

  return <AdminLayout><main className="reports-analytics-page"><header className="reports-page-header"><div><span className="report-eyebrow">Executive intelligence</span><h1>Reports & analytics</h1><p>See the operational picture clearly, from citywide trends to team output.</p></div><button type="button" className="reports-refresh" onClick={loadData} disabled={loading}><RefreshCw size={16} /> {loading ? "Refreshing" : "Refresh data"}</button></header>{error && <div className="reports-error" role="alert">{error}<button type="button" onClick={loadData}>Try again</button></div>}<AnalyticsCards data={data} loading={loading} />{loading ? <div className="reports-loading"><BarChart3 size={28} /><strong>Preparing your analytics workspace...</strong><span>Gathering operational datasets</span></div> : data && <><ChartsSection data={data} /><section className="reports-section"><div className="reports-section-heading"><div><span className="report-eyebrow">Decision support</span><h2>Operational reports</h2></div><ExportTools activeReport={activeReport} data={data} /></div><div className="report-tabs" role="tablist">{reportTabs.map((tab) => <button type="button" role="tab" aria-selected={activeReport === tab.key} className={activeReport === tab.key ? "active" : ""} onClick={() => setActiveReport(tab.key)} key={tab.key}>{tab.label}</button>)}</div><ReportsTable activeReport={activeReport} data={data} /></section></>}</main></AdminLayout>;
}

export default ReportsAnalyticsPage;

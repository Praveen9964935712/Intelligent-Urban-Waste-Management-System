import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { getReportDefinition } from "./reportDefinitions";

function escapeCsv(value) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }

function ExportTools({ activeReport, data }) {
  const exportData = () => getReportDefinition(activeReport).rows(data);
  const download = (content, filename, type) => { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url); };
  const exportCsv = () => download(exportData().map((row) => row.map(escapeCsv).join(",")).join("\n"), `${activeReport}-report.csv`, "text/csv;charset=utf-8");
  const exportExcel = () => { const rows = exportData(); const html = `<table><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? "").replaceAll("<", "&lt;")}</td>`).join("")}</tr>`).join("")}</tbody></table>`; download(html, `${activeReport}-report.xls`, "application/vnd.ms-excel"); };
  const exportPdf = () => { const rows = exportData(); const reportWindow = window.open("", "_blank", "noopener,noreferrer"); if (!reportWindow) return; reportWindow.document.write(`<html><head><title>${activeReport} report</title><style>body{font:14px Arial;color:#12302f;padding:32px}table{border-collapse:collapse;width:100%}td{border:1px solid #cbdedc;padding:10px}h1{font-size:22px}</style></head><body><h1>${activeReport} report</h1><table>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell ?? ""}</td>`).join("")}</tr>`).join("")}</table><script>window.onload=()=>window.print()</script></body></html>`); reportWindow.document.close(); };
  return <div className="export-tools"><span>Export</span><button type="button" onClick={exportPdf} title="Print or save as PDF"><FileText size={16} /> PDF</button><button type="button" onClick={exportExcel} title="Export Excel file"><FileSpreadsheet size={16} /> Excel</button><button type="button" onClick={exportCsv} title="Export CSV file"><Download size={16} /> CSV</button></div>;
}

export default ExportTools;

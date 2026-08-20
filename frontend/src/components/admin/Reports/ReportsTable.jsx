import { getReportDefinition } from "./reportDefinitions";

function ReportsTable({ activeReport, data }) {
  const definition = getReportDefinition(activeReport);
  const rows = definition.rows(data);
  return <section className="reports-table-panel"><div className="reports-table-heading"><div><span className="report-eyebrow">Data extract</span><h2>{definition.title}</h2></div><span>{rows.length} rows</span></div><div className="reports-table-wrap"><table className="reports-table"><thead><tr>{definition.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={`${row[0]}-${index}`}>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`}>{cell}</td>)}</tr>) : <tr><td colSpan={definition.columns.length}>No report data available.</td></tr>}</tbody></table></div></section>;
}

export default ReportsTable;

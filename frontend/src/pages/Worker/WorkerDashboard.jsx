import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MapPin, Navigation, RefreshCw } from "lucide-react";
import FreeRouteMap from "../../components/Map/FreeRouteMap";
import { getWorkerAssignmentsByWorker, getNavigationRoute, updateWorkerAssignmentStatus } from "../../services/workerService";

const STATUS_FLOW = ["ASSIGNED", "ACCEPTED", "IN_PROGRESS", "ARRIVED", "COMPLETED"];

function WorkerDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const workerId = Number(localStorage.getItem("workerId") || 1);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await getWorkerAssignmentsByWorker(workerId);
      setAssignments(data || []);
      if (data?.[0]) setSelectedAssignment(data[0]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to load worker assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleStatusUpdate = async (assignmentId, status) => {
    try {
      await updateWorkerAssignmentStatus(assignmentId, { status });
      await loadAssignments();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to update assignment status.");
    }
  };

  const selectedRoute = useMemo(() => {
    if (!selectedAssignment) return null;
    return {
      start: { latitude: 12.9716, longitude: 77.5946 },
      destination: { latitude: 12.9838, longitude: 77.5878 },
    };
  }, [selectedAssignment]);

  const handleNavigate = async () => {
    if (!selectedRoute) return;
    try {
      const route = await getNavigationRoute(
        selectedRoute.start.latitude,
        selectedRoute.start.longitude,
        selectedRoute.destination.latitude,
        selectedRoute.destination.longitude
      );
      setSelectedAssignment((current) => ({ ...current, route }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to calculate route.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Worker dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800">Field operations</h1>
          </div>
          <button type="button" onClick={loadAssignments} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 font-medium text-slate-700">
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Assignments</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{assignments.length} active</span>
              </div>

              {loading ? <div className="py-8 text-center text-slate-500">Loading assignments...</div> : assignments.length === 0 ? <div className="py-10 text-center text-slate-500">No assignments yet.</div> : (
                <div className="space-y-3">
                  {assignments.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedAssignment(item)}
                      className={`w-full rounded-xl border p-4 text-left transition ${selectedAssignment?.id === item.id ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">Complaint #{item.complaintId}</p>
                          <p className="text-sm text-slate-500">Priority: {item.priority || "MEDIUM"}</p>
                        </div>
                        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">{item.status}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Live route</h2>
                <button type="button" onClick={handleNavigate} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                  <Navigation size={16} /> Navigate
                </button>
              </div>

              {selectedRoute ? (
                <>
                  <FreeRouteMap start={selectedRoute.start} destination={selectedRoute.destination} route={selectedAssignment?.route} />
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Distance</p>
                      <p className="mt-2 text-xl font-semibold text-slate-800">{selectedAssignment?.route?.distanceKm ?? "--"} km</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">ETA</p>
                      <p className="mt-2 text-xl font-semibold text-slate-800">{selectedAssignment?.route?.etaMinutes ?? "--"} min</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Current status</p>
                      <p className="mt-2 text-xl font-semibold text-slate-800">{selectedAssignment?.status ?? "--"}</p>
                    </div>
                  </div>
                </>
              ) : <div className="py-8 text-center text-slate-500">Select an assignment to show route.</div>}
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {selectedAssignment ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">Assignment details</h2>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">{selectedAssignment.status}</span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Route</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-700"><MapPin size={16} className="text-emerald-600" /> Complaint location · Zone route</div>
                    <div className="mt-2 text-sm text-slate-600">
                      <p>Complaint: #{selectedAssignment.complaintId}</p>
                      <p>Priority: {selectedAssignment.priority || "MEDIUM"}</p>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => handleStatusUpdate(selectedAssignment.id, "ACCEPTED")} className="rounded-xl border border-emerald-200 bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">Accept</button>
                    <button type="button" onClick={() => handleStatusUpdate(selectedAssignment.id, "IN_PROGRESS")} className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">Start</button>
                    <button type="button" onClick={() => handleStatusUpdate(selectedAssignment.id, "ARRIVED")} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">Arrive</button>
                    <button type="button" onClick={() => handleStatusUpdate(selectedAssignment.id, "COMPLETED")} className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">Complete</button>
                  </div>

                  <button type="button" onClick={() => handleStatusUpdate(selectedAssignment.id, STATUS_FLOW[STATUS_FLOW.indexOf(selectedAssignment.status || "ASSIGNED") + 1] || selectedAssignment.status)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 font-semibold text-white">
                    <CheckCircle2 size={18} /> Advance status
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-slate-500">Select an assignment to view details.</div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

export default WorkerDashboard;

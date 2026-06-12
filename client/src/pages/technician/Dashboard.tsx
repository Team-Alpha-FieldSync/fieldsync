import { useState } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle,
  Calendar,
  MapPin,
  ArrowRight,
  Phone,
} from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { formatPriority } from "../../utils/formatters";
import { MY_JOBS_QUERY, MY_REPORTS_QUERY, MY_NOTIFICATIONS_QUERY } from "../../graphql/queries";
import { UPDATE_JOB_STATUS_MUTATION, SUBMIT_REPORT_MUTATION } from "../../graphql/mutations";
import { mapMyJob, type JobNode, type MyJobView } from "../../adapters/job";
export default function TechnicianDashboard() {
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const { data, loading, error } = useQuery<{ myJobs: JobNode[] }>(MY_JOBS_QUERY);
  const { data: reportsData } = useQuery<{ myReports: { id: string; status: string }[] }>(
    MY_REPORTS_QUERY,
    { variables: { status: "PENDING" } }
  );
  const reportsRefetch = [{ query: MY_REPORTS_QUERY, variables: { status: "PENDING" } }];
  const [updateStatus, { loading: updating }] = useMutation(UPDATE_JOB_STATUS_MUTATION, {
    refetchQueries: [{ query: MY_JOBS_QUERY }, ...reportsRefetch, { query: MY_NOTIFICATIONS_QUERY }],
  });
  const [submitReport, { loading: submittingReport }] = useMutation(SUBMIT_REPORT_MUTATION, {
    refetchQueries: [...reportsRefetch, { query: MY_NOTIFICATIONS_QUERY }],
  });
  const jobs: MyJobView[] = (data?.myJobs ?? []).map(mapMyJob);
  const activeCount = jobs.filter((j) => j.status === "PENDING" || j.status === "IN_PROGRESS").length;
  const inProgressCount = jobs.filter((j) => j.status === "IN_PROGRESS").length;
  const completedCount = jobs.filter((j) => j.status === "COMPLETED" || j.status === "VERIFIED").length;
  const pendingReports = reportsData?.myReports.length ?? 0;
  const currentJob =
    jobs.find((j) => j.status === "IN_PROGRESS") ??
    jobs.find((j) => j.status === "PENDING") ??
    null;
  const advanceLabel = currentJob?.status === "PENDING" ? "Start Job" : "Mark as Complete";
  const advanceStatus = currentJob?.status === "PENDING" ? "IN_PROGRESS" : "COMPLETED";
  const run = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    }
  };
  const handleSubmitNotes = async () => {
    if (!currentJob || !notes.trim()) return;
    await run(async () => {
      await submitReport({ variables: { jobId: currentJob.rawId, notes: notes.trim() } });
      setNotesOpen(false);
      setNotes("");
    });
  };
  const summaryStats = [
    { title: "Active Jobs", count: String(activeCount), subtitle: "Assigned to you", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "In Progress", count: String(inProgressCount), subtitle: "Currently working", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Completed", count: String(completedCount), subtitle: "Done", icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Pending Reports", count: String(pendingReports), subtitle: "Requires attention", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];
  if (loading) {
    return <div className="flex items-center justify-center h-full p-6 text-fg-muted">Loading dashboard…</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-full p-6 text-danger">Failed to load dashboard: {error.message}</div>;
  }
  return (
    <div className="space-y-4 xl:space-y-6 p-4 xl:p-6">
      {/* TOP ROW: 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
        {summaryStats.map((stat, index) => (
          <div key={index} className="bg-bg-base border border-border-muted rounded-xl p-4 xl:p-6 shadow-sm flex flex-col justify-between hover:border-primary transition-colors cursor-default">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-fg-muted">{stat.title}</p>
                <h3 className="text-2xl font-bold text-fg mt-1">{stat.count}</h3>
              </div>
            </div>
            <p className="text-xs text-fg-muted mt-4 font-medium">{stat.subtitle}</p>
          </div>
        ))}
      </div>
      {/* MIDDLE ROW: Schedule & Current Job Widget */}
      <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 xl:gap-6">
        {/* Right Widget: Current Job */}
        <div className="order-1 xl:order-2 xl:col-span-1 bg-bg-base border border-border-muted rounded-xl shadow-sm p-4 xl:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 xl:mb-6">
            <h2 className="text-lg xl:text-xl font-bold text-fg">Current Job</h2>
            {currentJob && <StatusBadge status={currentJob.status} />}
          </div>
          {!currentJob ? (
            <div className="flex-1 flex items-center justify-center text-center text-sm text-fg-muted py-8">
              No active job right now.
            </div>
          ) : (
            <>
              <div className="space-y-4 xl:space-y-6 flex-1">
                <div>
                  <p className="text-sm text-fg-muted font-medium mb-1">{currentJob.id}</p>
                  <h3 className="text-xl xl:text-2xl font-bold text-fg">{currentJob.client.name}</h3>
                  <p className="text-sm text-fg-muted mt-1">{currentJob.title}</p>
                </div>
                <div className="flex items-start gap-3 bg-bg-light p-3 xl:p-4 rounded-lg border border-border-muted">
                  <MapPin className="text-primary shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-medium text-fg">{currentJob.client.address}</p>
                    <button className="text-primary text-xs font-semibold mt-2 hover:underline">Get Directions</button>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 xl:p-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <span className="font-bold text-sm">{currentJob.client.contactPerson.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-fg">{currentJob.client.contactPerson}</p>
                    <p className="text-xs text-fg-muted">{currentJob.client.phone || "Site Contact"}</p>
                  </div>
                  <button className="p-2 bg-bg-light border border-border-muted rounded-full hover:text-primary transition-colors shrink-0">
                    <Phone size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button
                  disabled={updating}
                  onClick={() => run(() => updateStatus({ variables: { id: currentJob.rawId, status: advanceStatus } }))}
                  className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {updating ? "Updating…" : <>{advanceLabel} <ArrowRight size={16} /></>}
                </button>
                <button
                  onClick={() => { setNotes(""); setActionError(null); setNotesOpen(true); }}
                  className="w-full py-2.5 bg-bg-light border border-border-muted hover:bg-border-muted text-fg rounded-lg text-sm font-medium transition-colors"
                >
                  Add Field Notes
                </button>
                {actionError && !notesOpen && <p className="text-sm text-danger">{actionError}</p>}
              </div>
            </>
          )}
        </div>
        {/* Left Widget: My Schedule */}
        <div className="order-2 xl:order-1 xl:col-span-2 bg-bg-base border border-border-muted rounded-xl shadow-sm flex flex-col">
          <div className="p-4 xl:p-5 border-b border-border-muted flex justify-between items-center">
            <h2 className="text-lg xl:text-xl font-bold text-fg">My Schedule</h2>
          </div>
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-sm text-fg-muted">No jobs scheduled.</div>
          ) : (
            <>
              {/* MOBILE/TABLET VIEW: Card Layout */}
              <div className="xl:hidden flex flex-col divide-y divide-border-muted">
                {jobs.map((job) => (
                  <div key={job.rawId} className="p-4 flex flex-col gap-3 hover:bg-bg-light transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-primary block mb-0.5">{job.id}</span>
                        <span className="font-bold text-sm text-fg">{job.client.name}</span>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-fg-muted">
                      <div className="flex items-center gap-1.5"><Clock size={14} /> {job.timeWindow}</div>
                      <div className="flex items-center gap-1.5"><MapPin size={14} /> {job.client.address}</div>
                    </div>
                    <div className="pt-3 flex justify-between items-center border-t border-border-muted mt-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${
                        job.priority === "HIGH" ? "text-danger border-danger/20 bg-danger/5"
                          : job.priority === "MEDIUM" ? "text-yellow-600 border-yellow-600/20 bg-yellow-600/5"
                          : "text-success border-success/20 bg-success/5"
                      }`}>
                        {formatPriority(job.priority)} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {/* DESKTOP VIEW: Table Layout */}
              <div className="hidden xl:block overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="border-b border-border-muted text-fg font-semibold bg-bg-light/50">
                    <tr>
                      <th className="p-4">Schedule</th>
                      <th className="p-4">Job ID</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-muted">
                    {jobs.map((job) => (
                      <tr key={job.rawId} className="hover:bg-bg-light transition-colors text-fg-muted">
                        <td className="p-4 font-medium text-fg">{job.timeWindow}</td>
                        <td className="p-4">{job.id}</td>
                        <td className="p-4">{job.client.name}</td>
                        <td className="p-4">{job.client.address}</td>
                        <td className="p-4"><StatusBadge status={job.status} /></td>
                        <td className="p-4">{formatPriority(job.priority)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Add Field Notes modal */}
      <Modal isOpen={notesOpen} onClose={() => setNotesOpen(false)} title="Add Field Notes">
        <div className="space-y-4">
          <textarea
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your field report / notes…"
            className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary resize-none"
          />
          {actionError && <p className="text-sm text-danger">{actionError}</p>}
          <div className="flex justify-end gap-3 pt-2 border-t border-border-muted">
            <Button variant="secondary" onClick={() => setNotesOpen(false)}>Cancel</Button>
            <Button variant="primary" disabled={!notes.trim() || submittingReport} onClick={handleSubmitNotes}>
              {submittingReport ? "Saving…" : "Save Notes"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
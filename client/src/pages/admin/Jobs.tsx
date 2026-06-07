import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Trash2,
  Edit,
  ChevronLeft,
  UserRoundCog,
} from "lucide-react";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/StatusBadge";
import { formatPriority } from "../../utils/formatters";
import { JOBS_QUERY, TECHNICIANS_QUERY, DASHBOARD_STATS_QUERY } from "../../graphql/queries";
import {
  VERIFY_JOB_MUTATION,
  CANCEL_JOB_MUTATION,
  DELETE_JOB_MUTATION,
  CHANGE_JOB_PRIORITY_MUTATION,
  REASSIGN_JOB_MUTATION,
} from "../../graphql/mutations";
import { mapJob, type JobNode } from "../../adapters/job";
import { mapTechnician, type TechNode } from "../../adapters/technician";

export default function Jobs() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reassignTechnicianId, setReassignTechnicianId] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, loading, error } = useQuery<{ jobs: JobNode[] }>(JOBS_QUERY);
  const { data: techData } = useQuery<{ technicians: TechNode[] }>(TECHNICIANS_QUERY, {
    variables: { activeOnly: true },
  });
  const technicians = (techData?.technicians ?? []).map(mapTechnician);
  const jobs = (data?.jobs ?? []).map(mapJob);
  const selectedJob = jobs.find((j) => j.rawId === selectedId) ?? null;

  const refetchQueries = [
    { query: JOBS_QUERY },
    { query: TECHNICIANS_QUERY },
    { query: DASHBOARD_STATS_QUERY },
  ];
  const [verifyJob, { loading: verifying }] = useMutation(VERIFY_JOB_MUTATION, { refetchQueries });
  const [cancelJob, { loading: cancelling }] = useMutation(CANCEL_JOB_MUTATION, { refetchQueries });
  const [deleteJob, { loading: deleting }] = useMutation(DELETE_JOB_MUTATION, { refetchQueries });
  const [changePriority, { loading: changingPriority }] = useMutation(CHANGE_JOB_PRIORITY_MUTATION, { refetchQueries });
  const [reassignJob, { loading: reassigning }] = useMutation(REASSIGN_JOB_MUTATION, { refetchQueries });

  const selectJob = (rawId: string | null) => {
    setSelectedId(rawId);
    setReassignTechnicianId("");
    setActionError(null);
  };

  const run = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full p-6 text-fg-muted">Loading jobs…</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-full p-6 text-danger">Failed to load jobs: {error.message}</div>;
  }

  const canVerify = selectedJob?.status === "COMPLETED";
  const canChangePriority = selectedJob?.status === "PENDING" || selectedJob?.status === "IN_PROGRESS";
  const canCancel = selectedJob?.status === "PENDING" || selectedJob?.status === "IN_PROGRESS";
  const canDelete = selectedJob?.status === "CANCELLED";
  const canReassign = selectedJob?.status === "PENDING";

  return (
    <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 h-full p-4 xl:p-6">
      {/* LEFT PANEL: All Jobs List */}
      <div className={`${selectedJob ? "hidden xl:flex" : "flex"} flex-col xl:flex-2 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden h-full`}>
        <div className="p-4 xl:p-6 border-b border-border-muted flex justify-between items-center">
          <h2 className="text-lg xl:text-xl font-bold text-fg">All Jobs ({jobs.length})</h2>
        </div>

        <div className="hidden xl:grid grid-cols-12 gap-4 px-6 py-3 bg-bg-light border-b border-border-muted text-xs font-bold text-fg-muted uppercase tracking-wider">
          <div className="col-span-3">Job Info</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-3">Assigned Tech</div>
          <div className="col-span-2">Timeline</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        <div className="divide-y divide-border-muted overflow-y-auto">
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-sm text-fg-muted">No jobs found.</div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.rawId}
                onClick={() => selectJob(job.rawId)}
                className={`flex flex-col xl:grid xl:grid-cols-12 gap-3 xl:gap-4 p-4 xl:px-6 xl:py-4 xl:items-center cursor-pointer transition-colors hover:bg-bg-light ${
                  selectedId === job.rawId ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                }`}
              >
                <div className="xl:col-span-3 xl:pr-2 overflow-hidden w-full">
                  <div className="flex justify-between items-start w-full mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{job.id}</span>
                      {job.priority === "HIGH" && <AlertCircle size={12} className="text-danger shrink-0" />}
                    </div>
                    <div className="xl:hidden shrink-0">
                      <StatusBadge status={job.status} />
                    </div>
                  </div>
                  <p className="font-bold text-sm text-fg truncate">{job.title}</p>
                  <p className="text-xs text-fg-muted flex items-center gap-1 mt-1 truncate">
                    <MapPin size={12} className="shrink-0" /> {job.client.address}
                  </p>
                </div>

                <div className="xl:col-span-2 text-sm text-fg truncate flex items-center gap-2">
                  <span className="text-xs font-bold text-fg-muted uppercase xl:hidden">Client:</span>
                  {job.client.name}
                </div>

                <div className="xl:col-span-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-fg-muted uppercase xl:hidden">Tech:</span>
                  <div className="flex items-center gap-2 w-full overflow-hidden">
                    <div className="w-6 h-6 xl:w-8 xl:h-8 rounded-full bg-border flex items-center justify-center text-[10px] xl:text-xs text-fg-muted font-bold shrink-0">
                      {job.assignedTech.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-fg truncate">{job.assignedTech.name}</p>
                      <p className="hidden xl:block text-xs text-fg-muted truncate">{job.assignedTech.id}</p>
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-2 flex flex-row xl:flex-col gap-4 xl:gap-1 mt-2 xl:mt-0">
                  <div className="flex items-center gap-1.5 text-xs text-fg-muted truncate">
                    <Calendar size={12} className="shrink-0" /> {job.dateCreated}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-fg-muted truncate">
                    <Clock size={12} className="shrink-0" /> {job.deadline}
                  </div>
                </div>

                <div className="hidden xl:flex col-span-2 justify-end">
                  <StatusBadge status={job.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Job Details */}
      <div className={`${!selectedJob ? "hidden xl:flex" : "flex"} flex-col xl:flex-1 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden h-full`}>
        {!selectedJob ? (
          <div className="p-12 flex flex-col items-center justify-center text-center h-full text-fg-muted">
            <Calendar size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-fg mb-2">No Job Selected</h3>
            <p className="text-sm">Select a job from the list to view its details, update its status, or manage assignments.</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 xl:p-6 border-b border-border-muted flex justify-between items-center bg-bg-light/50">
              <div className="flex items-center gap-2 xl:gap-3">
                <button
                  onClick={() => selectJob(null)}
                  className="xl:hidden p-1.5 -ml-2 rounded-lg text-fg-muted hover:bg-border-muted transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="font-bold text-lg text-primary">{selectedJob.id}</h2>
                <div className="hidden sm:block"><StatusBadge status={selectedJob.status} /></div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded border ${
                selectedJob.priority === "HIGH" ? "text-danger border-danger/20 bg-danger/5" :
                selectedJob.priority === "MEDIUM" ? "text-yellow-600 border-yellow-600/20 bg-yellow-600/5" :
                "text-success border-success/20 bg-success/5"
              }`}>
                {formatPriority(selectedJob.priority)} <span className="hidden sm:inline">Priority</span>
              </span>
            </div>

            <div className="p-4 xl:p-6 space-y-6 overflow-y-auto">
              <div className="sm:hidden mb-4">
                <StatusBadge status={selectedJob.status} />
              </div>

              <div>
                <h3 className="font-bold text-xl text-fg mb-4">{selectedJob.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-border-muted py-4">
                  <div className="flex sm:block items-center justify-between">
                    <p className="text-xs text-fg-muted sm:mb-1">Field / Category</p>
                    <p className="text-sm font-medium text-fg">{selectedJob.category}</p>
                  </div>
                  <div className="flex sm:block items-center justify-between">
                    <p className="text-xs text-fg-muted sm:mb-1">Created</p>
                    <p className="text-sm font-medium text-fg">{selectedJob.dateCreated}</p>
                  </div>
                  <div className="flex sm:block items-center justify-between">
                    <p className="text-xs text-fg-muted sm:mb-1">Deadline</p>
                    <p className="text-sm font-medium text-fg">{selectedJob.deadline}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-bg-light border border-border-muted p-4 rounded-lg flex flex-col items-center justify-center text-center sm:min-h-25">
                  <p className="text-xs text-fg-muted mb-1">Client</p>
                  <p className="text-sm font-bold text-fg">{selectedJob.client.name}</p>
                </div>
                <div className="bg-bg-light border border-border-muted p-4 rounded-lg flex flex-col items-center justify-center text-center sm:min-h-25 hover:border-primary transition-colors cursor-pointer group">
                  <p className="text-xs text-fg-muted mb-1">Technician</p>
                  <p className="text-sm font-bold text-fg">{selectedJob.assignedTech.name}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-fg mb-2">Issue Description</h4>
                <div className="bg-bg-light border border-border-muted rounded-lg p-4 text-sm text-fg leading-relaxed">
                  {selectedJob.description}
                </div>
              </div>

              {canReassign && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 xl:p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <UserRoundCog size={18} className="text-primary shrink-0" />
                    <h4 className="font-bold text-fg">Reassign Technician</h4>
                  </div>
                  <p className="text-sm text-fg-muted mb-4">
                    Currently assigned to <span className="font-medium text-fg">{selectedJob.assignedTech.name}</span>.
                    Only pending jobs can be reassigned.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-fg mb-1">New technician</label>
                      <select
                        value={reassignTechnicianId}
                        onChange={(e) => setReassignTechnicianId(e.target.value)}
                        className="w-full border border-border rounded-md p-2 text-sm bg-bg-base focus:outline-none focus:border-primary"
                      >
                        <option value="">Select a technician…</option>
                        {technicians.map((tech) => (
                          <option
                            key={tech.rawId}
                            value={tech.rawId}
                            disabled={tech.rawId === selectedJob.assignedTech.rawId}
                          >
                            {tech.name} ({tech.id}) — {tech.statusLabel}
                          </option>
                        ))}
                      </select>
                      {technicians.length === 0 && (
                        <p className="text-xs text-fg-muted mt-1">No active technicians available.</p>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      className="w-full justify-center"
                      disabled={
                        !reassignTechnicianId ||
                        reassigning ||
                        reassignTechnicianId === selectedJob.assignedTech.rawId
                      }
                      onClick={() =>
                        run(async () => {
                          await reassignJob({
                            variables: {
                              id: selectedJob.rawId,
                              technicianId: reassignTechnicianId,
                            },
                          });
                          setReassignTechnicianId("");
                        })
                      }
                    >
                      {reassigning ? "Reassigning…" : "Reassign Job"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border-muted space-y-3 pb-8 xl:pb-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="secondary" disabled title="Editing coming soon" className="w-full justify-center">
                    <Edit size={16} className="mr-2" /> Edit Details
                  </Button>

                  <select
                    value={selectedJob.priority}
                    disabled={!canChangePriority || changingPriority}
                    onChange={(e) => run(() => changePriority({ variables: { id: selectedJob.rawId, priority: e.target.value } }))}
                    className="w-full border border-border rounded-md p-2 text-sm bg-bg-base focus:outline-none focus:border-primary disabled:opacity-50"
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>

                  <Button
                    variant="primary"
                    disabled={!canVerify || verifying}
                    onClick={() => run(() => verifyJob({ variables: { id: selectedJob.rawId } }))}
                    className="w-full justify-center"
                  >
                    <CheckCircle size={16} className="mr-2" /> {verifying ? "Verifying…" : "Verify & Close"}
                  </Button>

                  {canDelete ? (
                    <Button
                      variant="danger"
                      disabled={deleting}
                      onClick={() => run(async () => {
                        await deleteJob({ variables: { id: selectedJob.rawId } });
                        setSelectedId(null);
                      })}
                      className="w-full justify-center"
                    >
                      <Trash2 size={16} className="mr-2" /> {deleting ? "Deleting…" : "Delete Job"}
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      disabled={!canCancel || cancelling}
                      onClick={() => run(() => cancelJob({ variables: { id: selectedJob.rawId } }))}
                      className="w-full justify-center"
                    >
                      <Trash2 size={16} className="mr-2" /> {cancelling ? "Cancelling…" : "Cancel Job"}
                    </Button>
                  )}
                </div>
                {actionError && <p className="text-sm text-danger">{actionError}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
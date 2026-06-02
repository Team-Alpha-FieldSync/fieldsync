import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Zap, Edit, Briefcase, UserX, ChevronLeft } from "lucide-react";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/StatusBadge";
import { TECHNICIANS_QUERY, JOBS_QUERY } from "../../graphql/queries";
import {
  DEACTIVATE_TECHNICIAN_MUTATION,
  REASSIGN_JOB_MUTATION,
} from "../../graphql/mutations";
import { mapTechnician, type TechNode } from "../../adapters/technician";
import { type JobNode } from "../../adapters/job";

export default function Technicians() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assignJobId, setAssignJobId] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, loading, error } = useQuery<{ technicians: TechNode[] }>(TECHNICIANS_QUERY);
  const { data: jobsData } = useQuery<{ jobs: JobNode[] }>(JOBS_QUERY);

  const technicians = (data?.technicians ?? []).map(mapTechnician);
  const selectedTech = technicians.find((t) => t.rawId === selectedId) ?? null;
  const pendingJobs = (jobsData?.jobs ?? []).filter((j) => j.status === "PENDING");

  const [deactivateTechnician, { loading: deactivating }] = useMutation(
    DEACTIVATE_TECHNICIAN_MUTATION,
    { refetchQueries: [{ query: TECHNICIANS_QUERY }] }
  );
  const [reassignJob, { loading: assigning }] = useMutation(REASSIGN_JOB_MUTATION, {
    refetchQueries: [{ query: TECHNICIANS_QUERY }, { query: JOBS_QUERY }],
  });

  const run = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    }
  };

  const selectTech = (rawId: string) => {
    setSelectedId(rawId);
    setAssignJobId("");
    setActionError(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full p-6 text-fg-muted">Loading technicians…</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-full p-6 text-danger">Failed to load technicians: {error.message}</div>;
  }

  return (
    <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 h-full p-4 xl:p-6">
      {/* LEFT PANEL: All Technicians List */}
      <div className={`${selectedTech ? "hidden xl:flex" : "flex"} flex-col xl:flex-2 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden h-full`}>
        <div className="p-4 xl:p-6 border-b border-border-muted">
          <h2 className="text-lg xl:text-xl font-bold text-fg">
            All Technicians ({technicians.length})
          </h2>
        </div>

        <div className="hidden xl:grid grid-cols-12 gap-4 px-6 py-3 bg-bg-light border-b border-border-muted text-xs font-bold text-fg-muted uppercase tracking-wider">
          <div className="col-span-4">Technician</div>
          <div className="col-span-2 text-center">ID</div>
          <div className="col-span-2">Specialization</div>
          <div className="col-span-3">Current Assignment</div>
          <div className="col-span-1 flex justify-end pr-4">Status</div>
        </div>

        <div className="divide-y divide-border-muted overflow-y-auto">
          {technicians.length === 0 ? (
            <div className="p-12 text-center text-sm text-fg-muted">No technicians yet.</div>
          ) : (
            technicians.map((tech) => (
              <div
                key={tech.rawId}
                onClick={() => selectTech(tech.rawId)}
                className={`flex flex-col xl:grid xl:grid-cols-12 gap-3 xl:gap-4 p-4 xl:px-6 xl:py-4 xl:items-center cursor-pointer transition-colors hover:bg-bg-light ${
                  selectedId === tech.rawId ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                } ${!tech.isActive ? "opacity-60" : ""}`}
              >
                <div className="xl:col-span-4 flex items-start xl:items-center justify-between xl:justify-start gap-3 w-full xl:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-fg-muted font-bold shrink-0">
                      {tech.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-fg truncate">{tech.name}</p>
                      <p className="text-xs text-fg-muted truncate">{tech.email}</p>
                    </div>
                  </div>
                  <div className="xl:hidden shrink-0">
                    <StatusBadge status={tech.status} />
                  </div>
                </div>

                <div className="xl:col-span-2 text-sm text-fg-muted xl:text-center mt-1 xl:mt-0 flex xl:block items-center gap-2">
                  <span className="xl:hidden text-xs font-bold uppercase tracking-wider">ID:</span>
                  {tech.id}
                </div>

                <div className="xl:col-span-2 flex items-center gap-1.5 text-sm text-fg">
                  <Zap size={14} className="text-yellow-500 shrink-0" />
                  {tech.specialization}
                </div>

                <div className="xl:col-span-3 mt-1 xl:mt-0 bg-bg-light xl:bg-transparent p-2 xl:p-0 rounded-md xl:rounded-none border border-border-muted xl:border-transparent">
                  {tech.assignment ? (
                    <div>
                      <p className="text-sm font-medium text-fg truncate">{tech.assignment.title}</p>
                      <p className="text-xs text-fg-muted truncate">{tech.assignment.jobId}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-fg-muted italic">Unassigned</p>
                  )}
                </div>

                <div className="hidden xl:flex col-span-1 justify-end pr-4">
                  <StatusBadge status={tech.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Technician Details */}
      <div className={`${!selectedTech ? "hidden xl:flex" : "flex"} flex-col xl:flex-1 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden h-full`}>
        {!selectedTech ? (
          <div className="p-12 flex flex-col items-center justify-center text-center h-full text-fg-muted">
            <UserX size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-fg mb-2">No Technician Selected</h3>
            <p className="text-sm">
              Click on a technician from the list to view their details, assign jobs, and manage their profile.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 xl:p-6 border-b border-border-muted flex justify-between items-center">
              <div className="flex items-center gap-2 xl:gap-0">
                <button
                  onClick={() => setSelectedId(null)}
                  className="xl:hidden p-1.5 -ml-2 rounded-lg text-fg-muted hover:bg-border-muted transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="font-bold text-lg text-fg">Technician Details</h2>
              </div>
              <div className="flex items-center gap-2">
                {!selectedTech.isActive && (
                  <span className="text-xs font-bold px-2 py-1 rounded border text-danger border-danger/20 bg-danger/5">
                    Deactivated
                  </span>
                )}
                <StatusBadge status={selectedTech.status} />
              </div>
            </div>

            <div className="p-4 xl:p-6 space-y-6 overflow-y-auto">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-border flex items-center justify-center text-xl text-fg-muted font-bold shrink-0">
                  {selectedTech.name.charAt(0)}
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h3 className="font-bold text-lg xl:text-xl text-fg truncate">{selectedTech.name}</h3>
                  <p className="text-sm text-fg-muted">ID: {selectedTech.id}</p>
                  <p className="text-sm text-fg-muted">{selectedTech.specialization} Technician</p>
                  <p className="text-sm text-fg-muted truncate">{selectedTech.phone}</p>
                  <p className="text-sm text-fg-muted truncate">{selectedTech.email}</p>
                </div>
              </div>

              {/* Assignment Panel */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 xl:p-5">
                <h4 className="font-bold text-fg mb-4">Assignment Panel</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-fg mb-1">Select Job (pending only)</label>
                    <select
                      value={assignJobId}
                      onChange={(e) => setAssignJobId(e.target.value)}
                      className="w-full border border-border rounded-md p-2 text-sm bg-bg-base focus:outline-none focus:border-primary"
                    >
                      <option value="">Select a job...</option>
                      {pendingJobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.code} — {job.title}
                        </option>
                      ))}
                    </select>
                    {pendingJobs.length === 0 && (
                      <p className="text-xs text-fg-muted mt-1">No pending jobs available to assign.</p>
                    )}
                  </div>

                  {/* Priority, deadline and instructions are not yet wired to the backend */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-50">
                    <div>
                      <label className="block text-xs font-medium text-fg mb-1">Priority</label>
                      <select disabled className="w-full border border-border rounded-md p-2 text-sm bg-bg-base">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-fg mb-1">Deadline</label>
                      <input type="date" disabled className="w-full border border-border rounded-md p-2 text-sm bg-bg-base" />
                    </div>
                  </div>
                  <div className="opacity-50">
                    <label className="block text-xs font-medium text-fg mb-1">Note/ Instructions</label>
                    <textarea rows={3} disabled className="w-full border border-border rounded-md p-2 text-sm bg-bg-base resize-none"></textarea>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full py-2.5"
                    disabled={!assignJobId || assigning}
                    onClick={() => run(async () => {
                      await reassignJob({ variables: { id: assignJobId, technicianId: selectedTech.rawId } });
                      setAssignJobId("");
                    })}
                  >
                    {assigning ? "Assigning…" : "Assign Job"}
                  </Button>
                  {actionError && <p className="text-sm text-danger">{actionError}</p>}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button className="flex sm:flex-col items-center justify-center gap-3 sm:gap-2 p-3 sm:p-4 border border-border-muted rounded-lg hover:border-primary hover:text-primary transition-colors text-fg-muted" disabled title="Editing coming soon">
                  <Edit size={20} className="sm:mb-1 shrink-0" />
                  <span className="text-xs font-medium">Edit Profile</span>
                </button>
                <button className="flex sm:flex-col items-center justify-center gap-3 sm:gap-2 p-3 sm:p-4 border border-border-muted rounded-lg hover:border-primary hover:text-primary transition-colors text-fg-muted" disabled title="Coming soon">
                  <Briefcase size={20} className="sm:mb-1 shrink-0" />
                  <span className="text-xs font-medium">Job History</span>
                </button>
                <button
                  onClick={() => run(() => deactivateTechnician({ variables: { id: selectedTech.rawId } }))}
                  disabled={!selectedTech.isActive || deactivating}
                  className="flex sm:flex-col items-center justify-center gap-3 sm:gap-2 p-3 sm:p-4 border border-border-muted rounded-lg hover:text-danger hover:border-danger transition-colors text-fg-muted bg-danger/5 sm:bg-transparent disabled:opacity-50 disabled:hover:text-fg-muted disabled:hover:border-border-muted"
                >
                  <UserX size={20} className="sm:mb-1 shrink-0" />
                  <span className="text-xs font-medium text-center leading-tight">
                    {selectedTech.isActive ? <>Deactivate <span className="sm:hidden">Account</span></> : "Deactivated"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Trash2,
  Edit,
  ChevronLeft,
} from "lucide-react";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/StatusBadge";
import { formatPriority } from "../../utils/formatters";
import { JOBS_QUERY } from "../../graphql/queries";
import { mapJob, type JobNode, type JobView } from "../../adapters/job";

export default function Jobs() {
  const [selectedJob, setSelectedJob] = useState<JobView | null>(null);

  const { data, loading, error } = useQuery<{ jobs: JobNode[] }>(JOBS_QUERY);
  const jobs = (data?.jobs ?? []).map(mapJob);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-fg-muted">
        Loading jobs…
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-danger">
        Failed to load jobs: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 h-full p-4 xl:p-6">
      {/* LEFT PANEL: All Jobs List */}
      <div className={`${selectedJob ? "hidden xl:flex" : "flex"} flex-col xl:flex-2 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden h-full`}>
        <div className="p-4 xl:p-6 border-b border-border-muted flex justify-between items-center">
          <h2 className="text-lg xl:text-xl font-bold text-fg">All Jobs ({jobs.length})</h2>
        </div>

        {/* 12-Column Table Headers (Hidden on Mobile) */}
        <div className="hidden xl:grid grid-cols-12 gap-4 px-6 py-3 bg-bg-light border-b border-border-muted text-xs font-bold text-fg-muted uppercase tracking-wider">
          <div className="col-span-3">Job Info</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-3">Assigned Tech</div>
          <div className="col-span-2">Timeline</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* List Rows */}
        <div className="divide-y divide-border-muted overflow-y-auto">
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-sm text-fg-muted">No jobs found.</div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.rawId}
                onClick={() => setSelectedJob(job)}
                className={`flex flex-col xl:grid xl:grid-cols-12 gap-3 xl:gap-4 p-4 xl:px-6 xl:py-4 xl:items-center cursor-pointer transition-colors hover:bg-bg-light ${
                  selectedJob?.rawId === job.rawId ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                }`}
              >
                {/* Job Info Col */}
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

                {/* Client Col */}
                <div className="xl:col-span-2 text-sm text-fg truncate flex items-center gap-2">
                  <span className="text-xs font-bold text-fg-muted uppercase xl:hidden">Client:</span>
                  {job.client.name}
                </div>

                {/* Tech Col */}
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

                {/* Timeline Col */}
                <div className="xl:col-span-2 flex flex-row xl:flex-col gap-4 xl:gap-1 mt-2 xl:mt-0">
                  <div className="flex items-center gap-1.5 text-xs text-fg-muted truncate">
                    <Calendar size={12} className="shrink-0" /> {job.dateCreated}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-fg-muted truncate">
                    <Clock size={12} className="shrink-0" /> {job.deadline}
                  </div>
                </div>

                {/* Status Col (Desktop Only) */}
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
            {/* Detail Header */}
            <div className="p-4 xl:p-6 border-b border-border-muted flex justify-between items-center bg-bg-light/50">
              <div className="flex items-center gap-2 xl:gap-3">
                <button
                  onClick={() => setSelectedJob(null)}
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

              {/* Title & Meta Info */}
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

              {/* Assignment Boxes */}
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

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-fg mb-2">Issue Description</h4>
                <div className="bg-bg-light border border-border-muted rounded-lg p-4 text-sm text-fg leading-relaxed">
                  {selectedJob.description}
                </div>
              </div>

              {/* Action Buttons — wired in Phase 5 using selectedJob.rawId */}
              <div className="pt-4 border-t border-border-muted grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8 xl:pb-0">
                <Button variant="secondary" className="w-full justify-center">
                  <Edit size={16} className="mr-2" /> Edit Details
                </Button>
                <Button variant="secondary" className="w-full justify-center">
                  Change Priority
                </Button>
                <Button variant="primary" className="w-full justify-center">
                  <CheckCircle size={16} className="mr-2" /> Verify & Close
                </Button>
                <Button variant="danger" className="w-full justify-center">
                  <Trash2 size={16} className="mr-2" /> Delete Job
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
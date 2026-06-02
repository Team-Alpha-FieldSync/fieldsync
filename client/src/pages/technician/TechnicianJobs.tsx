import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Phone,
  Navigation,
  FileText,
  Play,
  ChevronLeft,
} from "lucide-react";
import { useQuery } from "@apollo/client/react";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/StatusBadge";
import { formatPriority } from "../../utils/formatters";
import { MY_JOBS_QUERY } from "../../graphql/queries";
import { mapMyJob, type JobNode, type MyJobView } from "../../adapters/job";

export default function TechnicianJobs() {
  const [selectedJob, setSelectedJob] = useState<MyJobView | null>(null);

  const { data, loading, error } = useQuery<{ myJobs: JobNode[] }>(MY_JOBS_QUERY);
  const myJobs = (data?.myJobs ?? []).map(mapMyJob);
  const activeCount = myJobs.filter(
    (j) => j.status === "PENDING" || j.status === "IN_PROGRESS"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-fg-muted">
        Loading your jobs…
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
      {/* LEFT PANEL: My Jobs List */}
      <div className={`${selectedJob ? "hidden xl:flex" : "flex"} flex-col xl:flex-3 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden h-full`}>
        <div className="p-4 xl:p-6 border-b border-border-muted flex justify-between items-center">
          <h2 className="text-lg xl:text-xl font-bold text-fg">My Assigned Jobs</h2>
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
            {activeCount} Active
          </span>
        </div>

        {/* Desktop Table Headers - Hidden on mobile/tablet */}
        <div className="hidden xl:grid grid-cols-12 gap-4 px-6 py-3 bg-bg-light border-b border-border-muted text-xs font-bold text-fg-muted uppercase tracking-wider">
          <div className="col-span-4">Job Info</div>
          <div className="col-span-3">Client & Location</div>
          <div className="col-span-3">Schedule</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* List Rows */}
        <div className="divide-y divide-border-muted overflow-y-auto">
          {myJobs.length === 0 ? (
            <div className="p-12 text-center text-sm text-fg-muted">
              You have no assigned jobs.
            </div>
          ) : (
            myJobs.map((job) => (
              <div
                key={job.rawId}
                onClick={() => setSelectedJob(job)}
                className={`flex flex-col xl:grid xl:grid-cols-12 gap-3 xl:gap-4 p-4 xl:px-6 xl:py-4 xl:items-center cursor-pointer transition-colors hover:bg-bg-light ${
                  selectedJob?.rawId === job.rawId
                    ? "bg-primary/5 border-l-4 border-l-primary"
                    : "border-l-4 border-l-transparent"
                }`}
              >
                {/* Job Info */}
                <div className="w-full xl:col-span-4 xl:pr-2 overflow-hidden">
                  <div className="flex justify-between items-start w-full mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{job.id}</span>
                      {job.priority === "HIGH" && <AlertCircle size={12} className="text-danger shrink-0" />}
                    </div>
                    <div className="xl:hidden">
                      <StatusBadge status={job.status} />
                    </div>
                  </div>
                  <p className="font-bold text-sm text-fg truncate">{job.title}</p>
                  <p className="text-xs text-fg-muted mt-1 truncate">{job.category}</p>
                </div>

                {/* Client & Location */}
                <div className="w-full xl:col-span-3 xl:pr-2 overflow-hidden mt-1 xl:mt-0">
                  <p className="text-sm font-medium text-fg truncate">{job.client.name}</p>
                  <p className="text-xs text-fg-muted flex items-center gap-1 mt-1 truncate">
                    <MapPin size={12} className="shrink-0" /> {job.client.address.split(",")[0]}
                  </p>
                </div>

                {/* Schedule */}
                <div className="w-full xl:col-span-3 flex xl:flex-col gap-4 xl:gap-1 mt-2 xl:mt-0">
                  <div className="flex items-center gap-1.5 text-xs text-fg-muted truncate">
                    <Calendar size={12} className="shrink-0" /> {job.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-fg truncate font-medium">
                    <Clock size={12} className="shrink-0" /> {job.timeWindow}
                  </div>
                </div>

                {/* Status Col - Visible only on desktop */}
                <div className="hidden xl:flex col-span-2 justify-end">
                  <StatusBadge status={job.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Execution Details */}
      <div className={`${!selectedJob ? "hidden xl:flex" : "flex"} flex-col xl:flex-2 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden h-full`}>
        {!selectedJob ? (
          <div className="p-12 flex flex-col items-center justify-center text-center h-full text-fg-muted">
            <MapPin size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-fg mb-2">Select a Job</h3>
            <p className="text-sm">
              Choose an assignment from your list to view site details, get directions, and update your progress.
            </p>
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
                selectedJob.priority === "HIGH" ? "text-danger border-danger/20 bg-danger/5"
                  : selectedJob.priority === "MEDIUM" ? "text-yellow-600 border-yellow-600/20 bg-yellow-600/5"
                  : "text-success border-success/20 bg-success/5"
              }`}>
                {formatPriority(selectedJob.priority)} <span className="hidden sm:inline">Priority</span>
              </span>
            </div>

            <div className="p-4 xl:p-6 space-y-6 overflow-y-auto">
              <div className="sm:hidden mb-4">
                <StatusBadge status={selectedJob.status} />
              </div>

              {/* Title & Timing */}
              <div>
                <h3 className="font-bold text-xl text-fg mb-2">{selectedJob.title}</h3>
                <div className="flex flex-wrap items-center gap-3 xl:gap-4 text-sm text-fg-muted">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {selectedJob.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {selectedJob.timeWindow}</span>
                </div>
              </div>

              {/* Client & Location Cards */}
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-bg-light border border-border-muted p-4 rounded-lg flex items-center justify-between group">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-xs text-fg-muted mb-0.5">Service Location</p>
                      <p className="text-sm font-bold text-fg">{selectedJob.client.name}</p>
                      <p className="text-sm text-fg-muted pr-2">{selectedJob.client.address}</p>
                    </div>
                  </div>
                  <button className="p-2 shrink-0 bg-white border border-border-muted rounded-full text-fg hover:text-primary hover:border-primary transition-colors shadow-sm">
                    <Navigation size={18} />
                  </button>
                </div>

                <div className="bg-bg-light border border-border-muted p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-bold text-xs mt-1">
                      {selectedJob.client.contactPerson.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-fg-muted mb-0.5">Site Contact</p>
                      <p className="text-sm font-bold text-fg">{selectedJob.client.contactPerson}</p>
                      <p className="text-sm text-fg-muted">{selectedJob.client.phone}</p>
                    </div>
                  </div>
                  <button className="p-2 shrink-0 bg-white border border-border-muted rounded-full text-fg hover:text-green-600 hover:border-green-600 transition-colors shadow-sm">
                    <Phone size={18} />
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-fg mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-fg-muted" /> Work Orders & Notes
                </h4>
                <div className="bg-bg-light border border-border-muted rounded-lg p-4 text-sm text-fg leading-relaxed">
                  {selectedJob.description}
                </div>
              </div>

              {/* Execution Actions — wired in Phase 5 */}
              <div className="pt-6 border-t border-border-muted flex flex-col gap-3 pb-8 xl:pb-0">
                {selectedJob.status === "PENDING" && (
                  <Button variant="primary" className="w-full justify-center py-3 text-base">
                    <Play size={18} className="mr-2 fill-current" /> Start Job
                  </Button>
                )}
                {selectedJob.status === "IN_PROGRESS" && (
                  <Button variant="primary" className="w-full justify-center py-3 text-base bg-green-600 hover:bg-green-700">
                    <CheckCircle size={18} className="mr-2" /> Mark as Complete
                  </Button>
                )}
                {selectedJob.status === "COMPLETED" && (
                  <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg text-sm text-center font-medium flex items-center justify-center gap-2">
                    <CheckCircle size={18} /> Job Completed Successfully
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  <Button variant="secondary" className="w-full justify-center">
                    <FileText size={16} className="mr-2" /> Add Notes
                  </Button>
                  <Button variant="secondary" className="w-full justify-center text-danger hover:border-danger hover:bg-danger/5">
                    <AlertCircle size={16} className="mr-2" /> Report Issue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
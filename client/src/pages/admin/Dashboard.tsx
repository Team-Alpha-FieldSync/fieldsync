import {
  Briefcase,
  Clock,
  CheckCircle,
  Users,
  Plus,
  FileText,
  UserPlus,
  MapPin,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import StatusBadge from "../../components/StatusBadge";
import { formatPriority } from "../../utils/formatters";
import {
  DASHBOARD_STATS_QUERY,
  JOBS_QUERY,
  TECHNICIANS_QUERY,
} from "../../graphql/queries";
import { mapJob, type JobNode } from "../../adapters/job";
import { mapTechnician, type TechNode } from "../../adapters/technician";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddJobModal from "../../components/AddJobModal";
import AddTechnicianModal from "../../components/AddTechnicianModal";

type DashboardStats = {
  totalJobs: number;
  activeTechnicians: number;
  pendingJobs: number;
  completedJobs: number;
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Dashboard() {
  const { data: statsData, loading, error } = useQuery<{ dashboardStats: DashboardStats }>(
    DASHBOARD_STATS_QUERY
  );
  const { data: jobsData } = useQuery<{ jobs: JobNode[] }>(JOBS_QUERY);
  const { data: techData } = useQuery<{ technicians: TechNode[] }>(TECHNICIANS_QUERY);

  const navigate = useNavigate();
  const [showAddJob, setShowAddJob] = useState(false);
  const [showAddTech, setShowAddTech] = useState(false);

  const stats = statsData?.dashboardStats;
  const recentJobs = (jobsData?.jobs ?? []).map(mapJob).slice(0, 5);
  const techActivity = (techData?.technicians ?? []).map(mapTechnician);

  const summaryStats = [
    { title: "Total Jobs", count: String(stats?.totalJobs ?? 0), icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Technicians", count: String(stats?.activeTechnicians ?? 0), icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Pending Jobs", count: String(stats?.pendingJobs ?? 0), icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Completed Jobs", count: String(stats?.completedJobs ?? 0), icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-fg-muted">
        Loading dashboard…
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-danger">
        Failed to load dashboard: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4 xl:space-y-6 p-4 xl:p-6">
      {/* TOP ROW: 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
        {summaryStats.map((stat, index) => (
          <div
            key={index}
            className="bg-bg-base border border-border-muted rounded-xl p-4 xl:p-6 shadow-sm flex items-start gap-4 hover:border-primary transition-colors cursor-default"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-fg-muted">{stat.title}</p>
              <h3 className="text-2xl font-bold text-fg mt-1">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE ROW: Recent Jobs & Tech Activity */}
      <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 xl:gap-6">
        {/* Left Widget: Recent Jobs */}
        <div className="xl:col-span-2 bg-bg-base border border-border-muted rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 xl:p-5 border-b border-border-muted flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg xl:text-xl font-bold text-fg">Recent Jobs</h2>
          </div>

          {/* MOBILE/TABLET VIEW: Card Layout */}
          <div className="xl:hidden flex flex-col divide-y divide-border-muted">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div key={job.rawId} className="p-4 flex flex-col gap-3 hover:bg-bg-light transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-primary block mb-0.5">{job.id}</span>
                      <span className="font-bold text-sm text-fg">{job.client.name}</span>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-fg-muted">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} /> {job.client.address}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserPlus size={14} /> {job.assignedTech.name}
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between items-center border-t border-border-muted mt-1">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-fg-muted">
                      <Calendar size={14} /> {job.dateCreated}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${
                      job.priority === "HIGH" ? "text-danger border-danger/20 bg-danger/5"
                        : job.priority === "MEDIUM" ? "text-yellow-600 border-yellow-600/20 bg-yellow-600/5"
                        : "text-success border-success/20 bg-success/5"
                    }`}>
                      {formatPriority(job.priority)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-fg-muted">No recent jobs found.</div>
            )}
          </div>

          {/* DESKTOP VIEW: Table Layout */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-border-muted text-fg font-semibold">
                <tr>
                  <th className="p-4">Job ID</th>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Assigned Technician</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Date Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <tr key={job.rawId} className="hover:bg-bg-light transition-colors text-fg-muted">
                      <td className="p-4 font-medium text-fg">{job.id}</td>
                      <td className="p-4">{job.client.name}</td>
                      <td className="p-4">{job.client.address}</td>
                      <td className="p-4">{job.assignedTech.name}</td>
                      <td className="p-4"><StatusBadge status={job.status} /></td>
                      <td className="p-4">{formatPriority(job.priority)}</td>
                      <td className="p-4">{job.dateCreated}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-fg-muted">No recent jobs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Widget: Technician Activity */}
        <div className="xl:col-span-1 bg-bg-base border border-border-muted rounded-xl shadow-sm flex flex-col">
          <div className="p-4 xl:p-5 border-b border-border-muted flex justify-between items-center">
            <h2 className="text-lg xl:text-xl font-bold text-fg">Technician Activity</h2>
            <Link to="/admin/technicians" className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors">
              View All
            </Link>
          </div>

          <div className="p-4 xl:p-5 space-y-4 overflow-y-auto max-h-100">
            {techActivity.length === 0 ? (
              <p className="text-sm text-fg-muted text-center py-6">No technicians yet.</p>
            ) : (
              techActivity.map((tech) => (
                <div key={tech.rawId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-muted last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-bold flex items-center justify-center shrink-0">
                      {initialsOf(tech.name)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-sm text-fg truncate">{tech.name}</h4>
                      <p className="text-xs text-fg-muted truncate">{tech.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-auto w-full pl-13 sm:pl-0">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${tech.status === "AVAILABLE" ? "text-green-600" : "text-fg-muted"}`}>
                      <span className={`w-2 h-2 rounded-full ${tech.status === "AVAILABLE" ? "bg-green-500" : "bg-gray-400"}`}></span>
                      {tech.statusLabel}
                    </div>
                    <span className="font-bold text-sm text-fg truncate max-w-32">
                      {tech.assignment ? tech.assignment.jobId : "Idle"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Charts & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
        <div className="bg-bg-base border border-border-muted rounded-xl p-4 xl:p-5 shadow-sm min-h-50 flex flex-col">
          <h3 className="font-bold text-fg mb-auto">Jobs Completed</h3>
          <div className="flex-1 flex items-center justify-center text-sm text-fg-muted border-2 border-dashed border-border-muted rounded-lg mt-4 bg-bg-light/50">
            Graph Diagram Area
          </div>
        </div>

        <div className="bg-bg-base border border-border-muted rounded-xl p-4 xl:p-5 shadow-sm min-h-50 flex flex-col">
          <h3 className="font-bold text-fg mb-auto">Status Distribution</h3>
          <div className="flex-1 flex items-center justify-center text-sm text-fg-muted border-2 border-dashed border-border-muted rounded-lg mt-4 bg-bg-light/50">
            Distribution Circle Area
          </div>
        </div>

        <div className="bg-bg-base border border-border-muted rounded-xl p-4 xl:p-5 shadow-sm min-h-50 flex flex-col">
          <h3 className="font-bold text-fg mb-auto">Technician Workload</h3>
          <div className="flex-1 flex items-center justify-center text-sm text-fg-muted border-2 border-dashed border-border-muted rounded-lg mt-4 bg-bg-light/50">
            Bar Graph Area
          </div>
        </div>

        <div className="bg-bg-base border border-border-muted rounded-xl p-4 xl:p-5 shadow-sm min-h-50 flex flex-col">
          <h3 className="font-bold text-fg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <button onClick={() => setShowAddJob(true)} className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-2 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted bg-bg-light/30 hover:bg-bg-light">
              <Plus size={20} className="text-green-700" />
              <span className="text-[11px] font-semibold text-center">Add Job</span>
            </button>
            <button onClick={() => setShowAddTech(true)} className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-2 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted bg-bg-light/30 hover:bg-bg-light">
              <UserPlus size={20} className="text-green-700" />
              <span className="text-[11px] font-semibold text-center">Add Tech</span>
            </button>
            <button onClick={() => navigate("/admin/jobs")} className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-2 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted bg-bg-light/30 hover:bg-bg-light">
              <FileText size={20} className="text-green-700" />
              <span className="text-[11px] font-semibold text-center">View Jobs</span>
            </button>
            <button onClick={() => navigate("/admin/technicians")} className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-2 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted bg-bg-light/30 hover:bg-bg-light">
              <Briefcase size={20} className="text-green-700" />
              <span className="text-[11px] font-semibold text-center">Assign</span>
            </button>
          </div>
        </div>
      </div>

      <AddJobModal isOpen={showAddJob} onClose={() => setShowAddJob(false)} />
      <AddTechnicianModal isOpen={showAddTech} onClose={() => setShowAddTech(false)} />
    </div>
  );
}
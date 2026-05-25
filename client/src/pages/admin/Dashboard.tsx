import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  Users,
  Search,
  Plus,
  ChevronDown,
  FileText,
  UserPlus,
  MapPin,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge"; 

// --- Mock Data ---
const summaryStats = [
  { title: "Total Jobs", count: "230", trend: "12.5%", isPositive: true, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Active Technicians", count: "110", trend: "8.3%", isPositive: true, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "Pending Jobs", count: "80", trend: "15.7%", isPositive: false, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Completed Jobs", count: "150", trend: "18.2%", isPositive: true, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
];

const recentJobs = [
  { id: "JOB-101", client: "Acme Corp", location: "New York, NY", tech: "Michael Smith", status: "pending" as const, priority: "High", date: "Oct 24, 2023" },
  { id: "JOB-102", client: "Globex", location: "Boston, MA", tech: "Unassigned", status: "in-progress" as const, priority: "Medium", date: "Oct 23, 2023" },
];

const techActivity = [
  { name: "Michael Smith", location: "New York, NY", status: "Available", jobs: 3, initials: "MS" }
];

export default function Dashboard() {
  return (
    // Adjusted outer padding and spacing for mobile
    <div className="space-y-4 xl:space-y-6 p-4 xl:p-6">
      

      {/* TOP ROW: 4 Summary Cards                   */}
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
            <p className="text-xs text-fg-muted mt-4 font-medium">
              <span className={stat.isPositive ? "text-blue-500" : "text-orange-500"}>
                {stat.trend}
              </span>{" "}
              vs last week
            </p>
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* MIDDLE ROW: Recent Jobs & Tech Activity    */}
      {/* ========================================== */}
      <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 xl:gap-6">
        
        {/* Left Widget: Recent Jobs */}
        <div className="xl:col-span-2 bg-bg-base border border-border-muted rounded-xl shadow-sm flex flex-col overflow-hidden">
          
          {/* Header & Controls (Responsive stacking) */}
          <div className="p-4 xl:p-5 border-b border-border-muted flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg xl:text-xl font-bold text-fg">Recent Jobs</h2>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 border border-border-muted rounded-lg text-sm text-fg-muted bg-bg-light cursor-pointer">
                All Status <ChevronDown size={16} />
              </div>
              
              <div className="relative flex-1 sm:w-48">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
                <input 
                  type="text" 
                  placeholder="Search jobs..." 
                  className="w-full pl-9 pr-3 py-2 border border-border-muted rounded-lg text-sm bg-bg-light focus:outline-none focus:border-primary"
                />
              </div>

              <button className="flex items-center justify-center gap-2 bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Plus size={16} /> Add Job
              </button>
            </div>
          </div>
          
          {/* MOBILE/TABLET VIEW: Card Layout */}
          <div className="xl:hidden flex flex-col divide-y divide-border-muted">
            {recentJobs.length > 0 ? recentJobs.map((job, idx) => (
              <div key={idx} className="p-4 flex flex-col gap-3 hover:bg-bg-light transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-primary block mb-0.5">{job.id}</span>
                    <span className="font-bold text-sm text-fg">{job.client}</span>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-fg-muted">
                  <div className="flex items-center gap-1.5"><MapPin size={14}/> {job.location}</div>
                  <div className="flex items-center gap-1.5"><UserPlus size={14}/> {job.tech}</div>
                </div>

                <div className="pt-3 flex justify-between items-center border-t border-border-muted mt-1">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-fg-muted">
                    <Calendar size={14}/> {job.date}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded border ${
                    job.priority === "High" ? "text-danger border-danger/20 bg-danger/5" : 
                    job.priority === "Medium" ? "text-yellow-600 border-yellow-600/20 bg-yellow-600/5" : 
                    "text-success border-success/20 bg-success/5"
                  }`}>
                    {job.priority}
                  </span>
                </div>
              </div>
            )) : (
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
                {recentJobs.length > 0 ? recentJobs.map((job, idx) => (
                  <tr key={idx} className="hover:bg-bg-light transition-colors text-fg-muted">
                    <td className="p-4 font-medium text-fg">{job.id}</td>
                    <td className="p-4">{job.client}</td>
                    <td className="p-4">{job.location}</td>
                    <td className="p-4">{job.tech}</td>
                    <td className="p-4"><StatusBadge status={job.status} /></td>
                    <td className="p-4">{job.priority}</td>
                    <td className="p-4">{job.date}</td>
                  </tr>
                )) : (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={7} className="p-6"></td></tr>
                  ))
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
          
          <div className="p-4 xl:p-5 space-y-4 overflow-y-auto max-h-[400px]">
            {techActivity.map((tech, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-muted last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-bold flex items-center justify-center shrink-0">
                    {tech.initials}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-fg truncate">{tech.name}</h4>
                    <p className="text-xs text-fg-muted truncate">{tech.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-auto w-full pl-13 sm:pl-0">
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    {tech.status}
                  </div>
                  <span className="font-bold text-sm text-fg">{tech.jobs} Jobs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* BOTTOM ROW: Charts & Quick Actions         */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
        
        {/* Jobs Completed Chart Placeholder */}
        <div className="bg-bg-base border border-border-muted rounded-xl p-4 xl:p-5 shadow-sm min-h-[200px] flex flex-col">
          <h3 className="font-bold text-fg mb-auto">Jobs Completed</h3>
          <div className="flex-1 flex items-center justify-center text-sm text-fg-muted border-2 border-dashed border-border-muted rounded-lg mt-4 bg-bg-light/50">
            Graph Diagram Area
          </div>
        </div>

        {/* Job Status Distribution Chart Placeholder */}
        <div className="bg-bg-base border border-border-muted rounded-xl p-4 xl:p-5 shadow-sm min-h-[200px] flex flex-col">
          <h3 className="font-bold text-fg mb-auto">Status Distribution</h3>
          <div className="flex-1 flex items-center justify-center text-sm text-fg-muted border-2 border-dashed border-border-muted rounded-lg mt-4 bg-bg-light/50">
            Distribution Circle Area
          </div>
        </div>

        {/* Technician Workload Chart Placeholder */}
        <div className="bg-bg-base border border-border-muted rounded-xl p-4 xl:p-5 shadow-sm min-h-[200px] flex flex-col">
          <h3 className="font-bold text-fg mb-auto">Technician Workload</h3>
          <div className="flex-1 flex items-center justify-center text-sm text-fg-muted border-2 border-dashed border-border-muted rounded-lg mt-4 bg-bg-light/50">
            Bar Graph Area
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-bg-base border border-border-muted rounded-xl p-4 xl:p-5 shadow-sm min-h-[200px] flex flex-col">
          <h3 className="font-bold text-fg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <button className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-2 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted bg-bg-light/30 hover:bg-bg-light">
              <Plus size={20} className="text-green-700" />
              <span className="text-[11px] font-semibold text-center">Add Job</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-2 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted bg-bg-light/30 hover:bg-bg-light">
              <UserPlus size={20} className="text-green-700" />
              <span className="text-[11px] font-semibold text-center">Add Tech</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-2 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted bg-bg-light/30 hover:bg-bg-light">
              <FileText size={20} className="text-green-700" />
              <span className="text-[11px] font-semibold text-center">Report</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-2 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted bg-bg-light/30 hover:bg-bg-light">
              <Briefcase size={20} className="text-green-700" />
              <span className="text-[11px] font-semibold text-center">Assign</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
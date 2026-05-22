import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  Users,
  Search,
  Plus,
  ChevronDown,
  FileText,
  UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge"; // Assuming you still need this for the table

// --- Mock Data ---
const summaryStats = [
  { title: "Total Jobs", count: "230", trend: "12.5%", isPositive: true, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Active Technicians", count: "110", trend: "8.3%", isPositive: true, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "Pending Jobs", count: "80", trend: "15.7%", isPositive: false, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Completed Jobs", count: "150", trend: "18.2%", isPositive: true, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
];

const recentJobs = [
  // Empty array to mimic the blank table rows in the wireframe, 
  // or add mock data that fits the new columns
  { id: "JOB-101", client: "Acme Corp", location: "New York, NY", tech: "Michael Smith", status: "pending" as const, priority: "High", date: "Oct 24, 2023" },
  { id: "JOB-102", client: "Globex", location: "Boston, MA", tech: "Unassigned", status: "in-progress" as const, priority: "Medium", date: "Oct 23, 2023" },
];

const techActivity = [
  { name: "Michael Smith", location: "New York, NY", status: "Available", jobs: 3, initials: "MS" }
];

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      
     
      {/* TOP ROW: 4 Summary Cards                  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => (
          <div key={index} className="bg-bg-base border border-border-muted rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-primary transition-colors cursor-default">
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

      {/* MIDDLE ROW: Recent Jobs & Tech Activity   */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Widget: Recent Jobs (Takes up 2/3 of space) */}
        <div className="lg:col-span-2 bg-bg-base border border-border-muted rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-border-muted flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-fg">Recent Jobs</h2>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Filter Dropdown */}
              <div className="flex items-center gap-2 px-3 py-2 border border-border-muted rounded-lg text-sm text-fg-muted bg-bg-light cursor-pointer">
                All Status <ChevronDown size={16} />
              </div>
              
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-48">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
                <input 
                  type="text" 
                  placeholder="Search jobs..." 
                  className="w-full pl-9 pr-3 py-2 border border-border-muted rounded-lg text-sm bg-bg-light focus:outline-none focus:border-primary"
                />
              </div>

              {/* Add Job Button */}
              <button className="flex items-center gap-2 bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Plus size={16} /> Add Job
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
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
                  // Empty rows to match mockup look
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={7} className="p-6"></td></tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Widget: Technician Activity (Takes up 1/3 space) */}
        <div className="lg:col-span-1 bg-bg-base border border-border-muted rounded-xl shadow-sm flex flex-col">
          <div className="p-5 border-b border-border-muted flex justify-between items-center">
            <h2 className="text-xl font-bold text-fg">Technician Activity</h2>
            <Link to="/admin/technicians" className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors">
              View All
            </Link>
          </div>
          
          <div className="p-5 space-y-4">
            {techActivity.map((tech, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-border-muted last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-bold flex items-center justify-center">
                    {tech.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-fg">{tech.name}</h4>
                    <p className="text-xs text-fg-muted">{tech.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
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


      {/* BOTTOM ROW: Charts & Quick Actions        */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Jobs Completed Chart Placeholder */}
        <div className="bg-bg-base border border-border-muted rounded-xl p-5 shadow-sm min-h-25 flex flex-col">
          <h3 className="font-bold text-fg mb-auto">Jobs Completed</h3>
          <div className="flex-1 flex items-center justify-center text-sm text-fg-muted">
            A graph diagram is here
          </div>
        </div>

        {/* Job Status Distribution Chart Placeholder */}
        <div className="bg-bg-base border border-border-muted rounded-xl p-5 shadow-sm min-h-25 flex flex-col">
          <h3 className="font-bold text-fg mb-auto">Job Status Distribution</h3>
          <div className="flex-1 flex items-center justify-center text-sm text-fg-muted">
            A distribution circle is here
          </div>
        </div>

        {/* Technician Workload Chart Placeholder */}
        <div className="bg-bg-base border border-border-muted rounded-xl p-5 shadow-sm min-h-25 flex flex-col">
          <h3 className="font-bold text-fg mb-auto">Technician Workload</h3>
          <div className="flex-1 flex items-center justify-center text-sm text-fg-muted">
            A bar graph is here
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-bg-base border border-border-muted rounded-xl p-5 shadow-sm min-h-25 flex flex-col">
          <h3 className="font-bold text-fg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <button className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-3 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted">
              <Plus size={24} className="text-green-700" />
              <span className="text-xs font-semibold">Add Job</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-3 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted">
              <UserPlus size={24} className="text-green-700" />
              <span className="text-xs font-semibold">Add Technician</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-3 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted">
              <FileText size={24} className="text-green-700" />
              <span className="text-xs font-semibold">Generate Report</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 border border-border-muted rounded-lg p-3 hover:border-green-600 hover:text-green-700 transition-colors text-fg-muted">
              <Briefcase size={24} className="text-green-700" />
              <span className="text-xs font-semibold">Assign Job</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
import { 
  Briefcase, 
  Clock, 
  CheckCircle,
  Calendar,
  MapPin,
  ArrowRight,
  Phone
} from "lucide-react";
import StatusBadge from "../../components/StatusBadge"; 

// --- Mock Data Tailored for a Technician ---
const summaryStats = [
  { title: "Jobs Today", count: "4", subtitle: "2 remaining", icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "In Progress", count: "1", subtitle: "Acme Corp", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
  { title: "Completed Today", count: "1", subtitle: "On schedule", icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
  { title: "Pending Reports", count: "2", subtitle: "Requires attention", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const myJobs = [
  { id: "JOB-101", time: "08:00 AM", client: "Stark Industries", location: "Manhattan, NY", status: "completed" as const, priority: "Medium" },
  { id: "JOB-102", time: "11:30 AM", client: "Acme Corp", location: "Brooklyn, NY", status: "in-progress" as const, priority: "High" },
  { id: "JOB-103", time: "02:00 PM", client: "Globex", location: "Queens, NY", status: "pending" as const, priority: "Medium" },
  { id: "JOB-104", time: "04:30 PM", client: "Wayne Ent.", location: "Staten Island, NY", status: "pending" as const, priority: "Low" },
];

export default function TechnicianDashboard() {
  return (
    <div className="space-y-4 xl:space-y-6 p-4 xl:p-6">
      
      {/* TOP ROW: 4 Summary Cards                   */}
      {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
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
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* MIDDLE ROW: Schedule & Current Job Widget  */}
      <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 xl:gap-6">
        
        {/* Right Widget: Current Job */}
        <div className="order-1 xl:order-2 xl:col-span-1 bg-bg-base border border-border-muted rounded-xl shadow-sm p-4 xl:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4 xl:mb-6">
            <h2 className="text-lg xl:text-xl font-bold text-fg">Current Job</h2>
            <StatusBadge status="in-progress" />
          </div>

          <div className="space-y-4 xl:space-y-6 flex-1">
            {/* Job Details */}
            <div>
              <p className="text-sm text-fg-muted font-medium mb-1">JOB-102</p>
              <h3 className="text-xl xl:text-2xl font-bold text-fg">Acme Corp</h3>
              <p className="text-sm text-fg-muted mt-1">HVAC System Maintenance & Filter Replacement</p>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3 bg-bg-light p-3 xl:p-4 rounded-lg border border-border-muted">
              <MapPin className="text-primary shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-fg">123 Tech Boulevard</p>
                <p className="text-xs text-fg-muted">Brooklyn, NY 11201</p>
                <button className="text-primary text-xs font-semibold mt-2 hover:underline">
                  Get Directions
                </button>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-3 p-2 xl:p-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <span className="font-bold text-sm">JD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-fg">John Doe</p>
                <p className="text-xs text-fg-muted">Site Manager</p>
              </div>
              <button className="p-2 bg-bg-light border border-border-muted rounded-full hover:text-primary transition-colors shrink-0">
                <Phone size={16} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              Update Job Status <ArrowRight size={16} />
            </button>
            <button className="w-full py-2.5 bg-bg-light border border-border-muted hover:bg-border-muted text-fg rounded-lg text-sm font-medium transition-colors">
              Add Field Notes
            </button>
          </div>
        </div>

        {/* Left Widget: My Schedule */}
        {/* MOBILE: order-2 puts it below Current Job. DESKTOP: order-1 puts it on the left */}
        <div className="order-2 xl:order-1 xl:col-span-2 bg-bg-base border border-border-muted rounded-xl shadow-sm flex flex-col">
          <div className="p-4 xl:p-5 border-b border-border-muted flex justify-between items-center">
            <h2 className="text-lg xl:text-xl font-bold text-fg">Today's Schedule</h2>
          </div>
          
          {/* MOBILE/TABLET VIEW: Card Layout */}
          <div className="xl:hidden flex flex-col divide-y divide-border-muted">
            {myJobs.map((job, idx) => (
              <div key={idx} className="p-4 flex flex-col gap-3 hover:bg-bg-light transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-primary block mb-0.5">{job.id}</span>
                    <span className="font-bold text-sm text-fg">{job.client}</span>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs text-fg-muted">
                  <div className="flex items-center gap-1.5"><Clock size={14}/> {job.time}</div>
                  <div className="flex items-center gap-1.5"><MapPin size={14}/> {job.location}</div>
                </div>

                <div className="pt-3 flex justify-between items-center border-t border-border-muted mt-1">
                  <span className={`text-xs font-bold px-2 py-1 rounded border ${
                    job.priority === "High" ? "text-danger border-danger/20 bg-danger/5" : 
                    job.priority === "Medium" ? "text-yellow-600 border-yellow-600/20 bg-yellow-600/5" : 
                    "text-success border-success/20 bg-success/5"
                  }`}>
                    {job.priority} Priority
                  </span>
                  <button className="text-primary hover:text-primary/80 font-medium text-sm">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Table Layout */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="border-b border-border-muted text-fg font-semibold bg-bg-light/50">
                <tr>
                  <th className="p-4">Time</th>
                  <th className="p-4">Job ID</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {myJobs.map((job, idx) => (
                  <tr key={idx} className="hover:bg-bg-light transition-colors text-fg-muted">
                    <td className="p-4 font-medium text-fg">{job.time}</td>
                    <td className="p-4">{job.id}</td>
                    <td className="p-4">{job.client}</td>
                    <td className="p-4">{job.location}</td>
                    <td className="p-4"><StatusBadge status={job.status} /></td>
                    <td className="p-4">{job.priority}</td>
                    <td className="p-4 text-right">
                      <button className="text-primary hover:text-primary/80 font-medium text-sm">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}

import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  Paperclip, 
  History, 
  CreditCard,
  Edit,
  MoreVertical,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button"; // Adjust path as needed
import StatusBadge from "../../components/StatusBadge"; // Adjust path as needed

// --- Detailed Mock Data ---
const jobDetail = {
  id: "JOB-1475",
  title: "Internet Connectivity Failure",
  category: "Networking",
  status: "in-progress" as const,
  priority: "High",
  dateCreated: "Oct 24, 2026",
  scheduledDate: "Oct 25, 2026",
  timeWindow: "08:00 AM - 10:00 AM",
  description: "Multiple users are unable to connect to the system. WIFI is down in the entire building and the router shows a red light. Customers complained about frequent connectivity issues in the last week. Please perform a full diagnostic on the main switch.",
  client: {
    name: "Robert Shoal",
    company: "Shoal Enterprises",
    phone: "+1 (234) 567-8900",
    email: "robert@shoalent.com",
    address: "123 Tech Park, Bldg 4",
    city: "New York, NY 10001"
  },
  assignedTech: {
    name: "Marcus Johnson",
    id: "TCH 1001",
    phone: "+1 (555) 123-4567"
  },
  financials: {
    estimatedCost: "$450.00",
    invoiced: false,
    partsRequired: "Router XJ-900 (Pending Approval)"
  },
  timeline: [
    { time: "Today, 08:15 AM", action: "Job marked as In Progress", user: "Marcus Johnson" },
    { time: "Yesterday, 04:30 PM", action: "Assigned to Marcus Johnson", user: "Admin Sarah" },
    { time: "Yesterday, 04:15 PM", action: "Job Priority upgraded to High", user: "Admin Sarah" },
    { time: "Yesterday, 02:00 PM", action: "Job Created", user: "System/Client Portal" }
  ]
};

export default function AdminJobDetails() {
  return (
    <div className="p-4 xl:p-8 space-y-6 max-w-7xl mx-auto h-full overflow-y-auto">
      
      {/* ========================================== */}
      {/* HEADER: Back Button & Actions              */}
      {/* ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/jobs" 
            className="p-2 bg-bg-light border border-border-muted rounded-lg text-fg-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-fg">{jobDetail.id}</h1>
              <StatusBadge status={jobDetail.status} />
              <span className="bg-danger/10 text-danger text-xs font-bold px-2 py-1 rounded border border-danger/20">
                {jobDetail.priority} Priority
              </span>
            </div>
            <p className="text-sm text-fg-muted mt-1">{jobDetail.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" className="hidden sm:flex">
            <Edit size={16} className="mr-2" /> Edit Job
          </Button>
          <Button variant="primary">
             Assign/Reassign Tech
          </Button>
          <button className="p-2 border border-border-muted rounded-lg text-fg-muted hover:bg-bg-light transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* MAIN GRID LAYOUT                           */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Main Information (Takes up 2/3 width on desktop) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Section: Description & Notes */}
          <div className="bg-bg-base border border-border-muted rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-fg mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-primary" /> Issue Description
            </h2>
            <p className="text-sm text-fg leading-relaxed bg-bg-light p-4 rounded-lg border border-border-muted">
              {jobDetail.description}
            </p>
            
            {/* Field Notes Placeholder */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-fg mb-3">Technician Field Notes</h3>
              <div className="text-sm text-fg-muted italic p-4 border-2 border-dashed border-border-muted rounded-lg text-center bg-bg-light/50">
                No field notes added yet. Notes will appear here once the technician updates the job.
              </div>
            </div>
          </div>

          {/* Section: Attachments */}
          <div className="bg-bg-base border border-border-muted rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-fg mb-4 flex items-center gap-2">
              <Paperclip size={20} className="text-primary" /> Attachments & Photos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="aspect-square bg-bg-light border border-border-muted rounded-lg flex items-center justify-center text-fg-muted hover:border-primary transition-colors cursor-pointer">
                <span className="text-xs font-medium">+ Add Photo</span>
              </div>
              {/* Mocking an existing photo */}
              <div className="aspect-square bg-gray-200 border border-border-muted rounded-lg relative overflow-hidden group cursor-pointer">
                 <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?fit=crop&w=200&h=200" alt="Router" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-white text-xs font-medium">View</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Section: Activity Timeline */}
          <div className="bg-bg-base border border-border-muted rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-fg mb-6 flex items-center gap-2">
              <History size={20} className="text-primary" /> Audit Log & Timeline
            </h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border-muted">
              {jobDetail.timeline.map((event, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary bg-bg-base shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-bg-light border border-border-muted p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-fg">{event.action}</span>
                    </div>
                    <div className="text-xs text-fg-muted flex justify-between">
                      <span>{event.user}</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Meta Data (Takes up 1/3 width on desktop) */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Schedule Widget */}
          <div className="bg-bg-base border border-border-muted rounded-xl shadow-sm p-5">
            <h3 className="text-xs font-bold text-fg-muted uppercase tracking-wider mb-4">Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-fg">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary"><Calendar size={16} /></div>
                <div>
                  <p className="text-xs text-fg-muted mb-0.5">Scheduled Date</p>
                  <p className="font-medium">{jobDetail.scheduledDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-fg">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary"><Clock size={16} /></div>
                <div>
                  <p className="text-xs text-fg-muted mb-0.5">Time Window</p>
                  <p className="font-medium">{jobDetail.timeWindow}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Widget */}
          <div className="bg-bg-base border border-border-muted rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-fg-muted uppercase tracking-wider">Client Details</h3>
              <button className="text-primary text-xs font-medium hover:underline">View Profile</button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-fg">{jobDetail.client.company}</p>
                <p className="text-sm text-fg-muted">ATTN: {jobDetail.client.name}</p>
              </div>
              <div className="space-y-2 text-sm text-fg">
                <div className="flex items-center gap-2"><Phone size={14} className="text-fg-muted"/> {jobDetail.client.phone}</div>
                <div className="flex items-center gap-2"><Mail size={14} className="text-fg-muted"/> {jobDetail.client.email}</div>
              </div>
              <div className="pt-3 border-t border-border-muted">
                <p className="text-xs text-fg-muted mb-1">Service Location</p>
                <div className="flex items-start gap-2 text-sm text-fg">
                  <MapPin size={16} className="text-primary shrink-0 mt-0.5"/>
                  <p>{jobDetail.client.address}<br/>{jobDetail.client.city}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Widget */}
          <div className="bg-bg-base border border-border-muted rounded-xl shadow-sm p-5">
            <h3 className="text-xs font-bold text-fg-muted uppercase tracking-wider mb-4">Assigned Technician</h3>
            <div className="flex items-center justify-between p-3 bg-bg-light border border-border-muted rounded-lg group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                  {jobDetail.assignedTech.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm text-fg">{jobDetail.assignedTech.name}</p>
                  <p className="text-xs text-fg-muted">{jobDetail.assignedTech.phone}</p>
                </div>
              </div>
              <Button variant="secondary" className="px-2 py-1 h-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Change
              </Button>
            </div>
          </div>

          {/* Financials / Parts Widget (Admin Only Info) */}
          <div className="bg-bg-base border border-border-muted rounded-xl shadow-sm p-5">
            <h3 className="text-xs font-bold text-fg-muted uppercase tracking-wider mb-4">Financials & Parts</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CreditCard size={18} />
                  <span className="text-sm font-bold">Est. Revenue</span>
                </div>
                <span className="font-bold text-green-800">{jobDetail.financials.estimatedCost}</span>
              </div>
              
              <div>
                <p className="text-xs text-fg-muted mb-1 flex items-center justify-between">
                  Parts Requested 
                  <span className="text-orange-500 font-medium">Approval Required</span>
                </p>
                <div className="p-3 bg-bg-light border border-border-muted rounded-lg text-sm text-fg flex items-center justify-between">
                  <span>{jobDetail.financials.partsRequired}</span>
                  <button className="text-primary font-bold text-xs hover:underline">Approve</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
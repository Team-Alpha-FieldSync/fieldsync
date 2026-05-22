import { useState } from "react";
import { Calendar, Clock, MapPin, AlertCircle, UserPlus, CheckCircle, Trash2, Edit } from "lucide-react";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/StatusBadge";

// 1. Define the Job structure
type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  client: { name: string; phone: string; address: string };
  assignedTech: { name: string; id: string } | null;
  status: "success" | "pending" | "error" | "in-progress";
  priority: "High" | "Medium" | "Low";
  dateCreated: string;
  deadline: string;
};

// 2. Mock Data
const mockJobs: Job[] = [
  {
    id: "JOB-1475",
    title: "Internet Connectivity Failure",
    description: "Multiple users are unable to connect to the system. WIFI is down in the entire building and the router shows a red light. Customers complained about frequent connectivity issues in the last week. Monitor for 24 hours after fix.",
    category: "Networking",
    client: { name: "Robert Shoal", phone: "+1 234 567 8900", address: "123 Tech Park, Bldg 4" },
    assignedTech: { name: "John Smith", id: "TCH 1001" },
    status: "in-progress",
    priority: "High",
    dateCreated: "2026-06-14",
    deadline: "2026-07-04",
  },
  {
    id: "JOB-1476",
    title: "Server Rack Power Failure",
    description: "Main server rack in the basement is completely unresponsive. Suspected blown fuse or faulty PDU.",
    category: "Electrical",
    client: { name: "Sarah Connor", phone: "+1 987 654 3210", address: "Cyberdyne Systems HQ" },
    assignedTech: null,
    status: "pending",
    priority: "High",
    dateCreated: "2026-06-15",
    deadline: "2026-06-16",
  },
  {
    id: "JOB-1477",
    title: "Routine HVAC Maintenance",
    description: "Quarterly filter replacement and system diagnostic for the rooftop units.",
    category: "HVAC",
    client: { name: "Acme Corp", phone: "+1 555 123 4567", address: "99 Industrial Way" },
    assignedTech: { name: "Mike Johnson", id: "TCH 1045" },
    status: "success",
    priority: "Low",
    dateCreated: "2026-06-10",
    deadline: "2026-06-20",
  }
];

export default function Jobs() {
  // 3. State to track the currently clicked job
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <div className="flex gap-6 h-full">
      

      {/* LEFT PANEL: All Jobs List                 */}
      <div className="flex-2 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border-muted flex justify-between items-center">
          <h2 className="text-xl font-bold text-fg">All Jobs ({mockJobs.length})</h2>
        </div>

        {/* 12-Column Table Headers */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-bg-light border-b border-border-muted text-xs font-bold text-fg-muted uppercase tracking-wider">
          {/* Changed from 4 to 3 */}
          <div className="col-span-3">Job Info</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-3">Assigned Tech</div>
          <div className="col-span-2">Timeline</div>
          {/* Changed from 1 to 2, removed weird padding */}
          <div className="col-span-2 text-right">Status</div> 
        </div>


        {/* UPGRADED: Technician List Rows            */}
        <div className="divide-y divide-border-muted overflow-y-auto">
          {mockJobs.map((job) => (
            <div 
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer transition-colors hover:bg-bg-light ${
                selectedJob?.id === job.id ? "bg-primary/5 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
              }`}
            >
              {/* Job Info Col (Now 3/12) */}
              <div className="col-span-3 pr-2 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary">{job.id}</span>
                  {job.priority === "High" && <AlertCircle size={12} className="text-danger shrink-0" />}
                </div>
                <p className="font-bold text-sm text-fg truncate">{job.title}</p>
                <p className="text-xs text-fg-muted flex items-center gap-1 mt-1 truncate">
                  <MapPin size={12} className="shrink-0" /> {job.client.address}
                </p>
              </div>
              
              {/* Client Col (2/12) */}
              <div className="col-span-2 text-sm text-fg truncate">
                {job.client.name}
              </div>
              
              {/* Tech Col (3/12) */}
              <div className="col-span-3">
                {job.assignedTech ? (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs text-fg-muted font-bold shrink-0">
                      {job.assignedTech.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-fg truncate">{job.assignedTech.name}</p>
                      <p className="text-xs text-fg-muted truncate">{job.assignedTech.id}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-fg-muted italic">Unassigned</span>
                )}
              </div>

              {/* Timeline Col (2/12) */}
              <div className="col-span-2 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-fg-muted truncate">
                  <Calendar size={12} className="shrink-0" /> {job.dateCreated}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-fg-muted truncate">
                  <Clock size={12} className="shrink-0" /> {job.deadline}
                </div>
              </div>

              {/* Status Col (Now 2/12 - plenty of room for "In Progress"!) */}
              <div className="col-span-2 flex justify-end">
                <StatusBadge status={job.status} />
              </div>
            </div>
          ))}
        </div>
        </div>

 
      {/* RIGHT PANEL: Job Details                  */}
      <div className="flex-1 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {!selectedJob ? (
          <div className="p-12 flex flex-col items-center justify-center text-center h-full text-fg-muted">
            <Calendar size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-fg mb-2">No Job Selected</h3>
            <p className="text-sm">Select a job from the list to view its details, update its status, or manage assignments.</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            
            {/* Detail Header */}
            <div className="p-6 border-b border-border-muted flex justify-between items-center bg-bg-light/50">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-lg text-primary">{selectedJob.id}</h2>
                <StatusBadge status={selectedJob.status} />
              </div>
              <span className={`text-xs font-bold ${
                selectedJob.priority === 'High' ? 'text-danger' : 
                selectedJob.priority === 'Medium' ? 'text-yellow-500' : 'text-success'
              }`}>
                {selectedJob.priority} Priority
              </span>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* Title & Meta Info */}
              <div>
                <h3 className="font-bold text-xl text-fg mb-4">{selectedJob.title}</h3>
                <div className="grid grid-cols-3 gap-4 border-y border-border-muted py-4">
                  <div>
                    <p className="text-xs text-fg-muted mb-1">Field / Category</p>
                    <p className="text-sm font-medium text-fg">{selectedJob.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-fg-muted mb-1">Created</p>
                    <p className="text-sm font-medium text-fg">{selectedJob.dateCreated}</p>
                  </div>
                  <div>
                    <p className="text-xs text-fg-muted mb-1">Deadline</p>
                    <p className="text-sm font-medium text-fg">{selectedJob.deadline}</p>
                  </div>
                </div>
              </div>

              {/* Assignment Boxes */}
              <div className="grid grid-cols-2 gap-4">
                {/* Client Box */}
                <div className="bg-bg-light border border-border-muted p-4 rounded-lg flex flex-col items-center justify-center text-center min-h-25">
                  <p className="text-xs text-fg-muted mb-1">Client</p>
                  <p className="text-sm font-bold text-fg">{selectedJob.client.name}</p>
                </div>
                
                {/* Technician Box */}
                <div className="bg-bg-light border border-border-muted p-4 rounded-lg flex flex-col items-center justify-center text-center min-h-25 hover:border-primary transition-colors cursor-pointer group">
                  {selectedJob.assignedTech ? (
                    <>
                      <p className="text-xs text-fg-muted mb-1">Technician</p>
                      <p className="text-sm font-bold text-fg">{selectedJob.assignedTech.name}</p>
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} className="text-primary mb-1 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-primary">+ Assign Tech</p>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-fg mb-2">Issue Description</h4>
                <div className="bg-bg-light border border-border-muted rounded-lg p-4 text-sm text-fg leading-relaxed">
                  {selectedJob.description}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border-muted grid grid-cols-2 gap-3">
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
import { useState } from "react";
import { Zap, Edit, Briefcase, UserX, ChevronLeft } from "lucide-react";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/StatusBadge"; 

// 1. Define what a Technician looks like
type Technician = {
  id: string;
  name: string;
  email: string;
  specialization: string;
  assignment: { title: string; jobId: string } | null;
  status:
    | "success"
    | "pending"
    | "error"
    | "in-progress"
    | "available"
    | "unavailable"; 
  statusLabel: string;
  phone: string;
};

// 2. Mock Data
const mockTechnicians: Technician[] = [
  {
    id: "TCH 1001",
    name: "John Smith",
    email: "jsmith@fieldsync.com",
    specialization: "Electrical",
    assignment: { title: "Light installation", jobId: "#JOB-1327" },
    status: "available",
    statusLabel: "Available",
    phone: "+233 50 678 4335",
  },
  {
    id: "TCH 1002",
    name: "Sarah Connor",
    email: "sconnor@fieldsync.com",
    specialization: "Networking",
    assignment: null,
    status: "unavailable",
    statusLabel: "Offline",
    phone: "+233 50 111 2222",
  },
];

export default function Technicians() {
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);

  return (
    // Switched to flex-col for mobile, xl:flex-row for desktop. Shrunk padding for mobile.
    <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 h-full p-4 xl:p-6">
      
      {/* LEFT PANEL: All Technicians List           */}
      {/* Hidden on mobile if a tech is selected. Visible on desktop always. */}
      <div className={`${selectedTech ? 'hidden xl:flex' : 'flex'} flex-col xl:flex-2 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden h-full`}>
        <div className="p-4 xl:p-6 border-b border-border-muted">
          <h2 className="text-lg xl:text-xl font-bold text-fg">
            All Technicians ({mockTechnicians.length})
          </h2>
        </div>

        {/* Desktop 12-Column Table Headers - Hidden on Mobile */}
        <div className="hidden xl:grid grid-cols-12 gap-4 px-6 py-3 bg-bg-light border-b border-border-muted text-xs font-bold text-fg-muted uppercase tracking-wider">
          <div className="col-span-4">Technician</div>
          <div className="col-span-2 text-center">ID</div>
          <div className="col-span-2">Specialization</div>
          <div className="col-span-3">Current Assignment</div>
          <div className="col-span-1 flex justify-end pr-4">Status</div>
        </div>

        {/* Technician List Rows */}
        <div className="divide-y divide-border-muted overflow-y-auto">
          {mockTechnicians.map((tech) => (
            <div
              key={tech.id}
              onClick={() => setSelectedTech(tech)}
              // Stacked flex on mobile, 12-col grid on desktop
              className={`flex flex-col xl:grid xl:grid-cols-12 gap-3 xl:gap-4 p-4 xl:px-6 xl:py-4 xl:items-center cursor-pointer transition-colors hover:bg-bg-light ${
                selectedTech?.id === tech.id
                  ? "bg-primary/5 border-l-4 border-l-primary"
                  : "border-l-4 border-l-transparent"
              }`}
            >
              {/* Profile Col */}
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
                {/* Mobile Status Badge (Hidden on Desktop) */}
                <div className="xl:hidden shrink-0">
                  <StatusBadge status={tech.status} />
                </div>
              </div>

              {/* ID Col */}
              <div className="xl:col-span-2 text-sm text-fg-muted xl:text-center mt-1 xl:mt-0 flex xl:block items-center gap-2">
                <span className="xl:hidden text-xs font-bold uppercase tracking-wider">ID:</span>
                {tech.id}
              </div>

              {/* Specialization Col */}
              <div className="xl:col-span-2 flex items-center gap-1.5 text-sm text-fg">
                <Zap size={14} className="text-yellow-500 shrink-0" />
                {tech.specialization}
              </div>

              {/* Assignment Col */}
              <div className="xl:col-span-3 mt-1 xl:mt-0 bg-bg-light xl:bg-transparent p-2 xl:p-0 rounded-md xl:rounded-none border border-border-muted xl:border-transparent">
                {tech.assignment ? (
                  <div>
                    <p className="text-sm font-medium text-fg truncate">
                      {tech.assignment.title}
                    </p>
                    <p className="text-xs text-fg-muted truncate">
                      {tech.assignment.jobId}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-fg-muted italic">Unassigned</p>
                )}
              </div>

              {/* Desktop Status Col (Hidden on Mobile) */}
              <div className="hidden xl:flex col-span-1 justify-end pr-4">
                <StatusBadge status={tech.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: Technician Details            */}
      {/* Hidden on mobile if NO tech is selected. Visible on desktop always. */}
      <div className={`${!selectedTech ? 'hidden xl:flex' : 'flex'} flex-col xl:flex-1 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden h-full`}>
        
        {!selectedTech ? (
          <div className="p-12 flex flex-col items-center justify-center text-center h-full text-fg-muted">
            <UserX size={48} className="mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-fg mb-2">
              No Technician Selected
            </h3>
            <p className="text-sm">
              Click on a technician from the list to view their details, assign
              jobs, and manage their profile.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            
            {/* Header */}
            <div className="p-4 xl:p-6 border-b border-border-muted flex justify-between items-center">
              <div className="flex items-center gap-2 xl:gap-0">
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setSelectedTech(null)}
                  className="xl:hidden p-1.5 -ml-2 rounded-lg text-fg-muted hover:bg-border-muted transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <h2 className="font-bold text-lg text-fg">Technician Details</h2>
              </div>
              <StatusBadge status={selectedTech.status} />
            </div>

            <div className="p-4 xl:p-6 space-y-6 overflow-y-auto">
              
              {/* Profile Info */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-border flex items-center justify-center text-xl text-fg-muted font-bold shrink-0">
                  {selectedTech.name.charAt(0)}
                </div>
                <div className="space-y-1 overflow-hidden">
                  <h3 className="font-bold text-lg xl:text-xl text-fg truncate">
                    {selectedTech.name}
                  </h3>
                  <p className="text-sm text-fg-muted">ID: {selectedTech.id}</p>
                  <p className="text-sm text-fg-muted">{selectedTech.specialization} Technician</p>
                  <p className="text-sm text-fg-muted truncate">{selectedTech.phone}</p>
                  <p className="text-sm text-fg-muted truncate">{selectedTech.email}</p>
                </div>
              </div>

              {/* Assignment Form Panel */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 xl:p-5">
                <h4 className="font-bold text-fg mb-4">Assignment Panel</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-fg mb-1">
                      Select Job
                    </label>
                    <select className="w-full border border-border rounded-md p-2 text-sm bg-bg-base focus:outline-none focus:border-primary">
                      <option>Select a job...</option>
                      <option>Internet connectivity failure</option>
                    </select>
                  </div>
                  
                  {/* Grid becomes 1 col on very small screens, 2 col on SM+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-fg mb-1">
                        Priority
                      </label>
                      <select className="w-full border border-border rounded-md p-2 text-sm bg-bg-base focus:outline-none focus:border-primary">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-fg mb-1">
                        Deadline
                      </label>
                      <input
                        type="date"
                        className="w-full border border-border rounded-md p-2 text-sm bg-bg-base focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-fg mb-1">
                      Note/ Instructions
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-border rounded-md p-2 text-sm bg-bg-base focus:outline-none focus:border-primary resize-none"
                    ></textarea>
                  </div>
                  <Button variant="primary" className="w-full py-2.5">
                    Assign Job
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              {/* Stack vertically on extra small screens, side-by-side on SM+ */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button className="flex sm:flex-col items-center justify-center gap-3 sm:gap-2 p-3 sm:p-4 border border-border-muted rounded-lg hover:border-primary hover:text-primary transition-colors text-fg-muted">
                  <Edit size={20} className="sm:mb-1 shrink-0" />
                  <span className="text-xs font-medium">Edit Profile</span>
                </button>
                <button className="flex sm:flex-col items-center justify-center gap-3 sm:gap-2 p-3 sm:p-4 border border-border-muted rounded-lg hover:border-primary hover:text-primary transition-colors text-fg-muted">
                  <Briefcase size={20} className="sm:mb-1 shrink-0" />
                  <span className="text-xs font-medium">Job History</span>
                </button>
                <button className="flex sm:flex-col items-center justify-center gap-3 sm:gap-2 p-3 sm:p-4 border border-border-muted rounded-lg hover:text-danger hover:border-danger transition-colors text-fg-muted bg-danger/5 sm:bg-transparent">
                  <UserX size={20} className="sm:mb-1 shrink-0" />
                  <span className="text-xs font-medium text-center leading-tight">
                    Deactivate <span className="sm:hidden">Account</span>
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
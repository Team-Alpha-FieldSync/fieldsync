import { useState } from "react";
import { Zap, Edit, Briefcase, UserX } from "lucide-react";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/StatusBadge"; // Assuming this is your custom badge

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

// 2. Mock Data (This will eventually come from your backend!)
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
  // 3. The Magic State: Keeps track of who is currently clicked!
  // Starts as 'null' meaning nobody is selected yet.
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);

  return (
    <div className="flex gap-6 h-full">
      {/* LEFT PANEL: All Technicians List          */}
      <div className="flex-2 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border-muted">
          <h2 className="text-xl font-bold text-fg">
            All Technicians ({mockTechnicians.length})
          </h2>
        </div>

        {/* UPGRADED: 12-Column Table Headers */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-bg-light border-b border-border-muted text-xs font-bold text-fg-muted uppercase tracking-wider">
          <div className="col-span-4">Technician</div>
          {/* Centered ID Header */}
          <div className="col-span-2 text-center">ID</div>
          <div className="col-span-2">Specialization</div>
          <div className="col-span-3">Current Assignment</div>
          <div className="col-span-1 flex justify-end pr-4">Status</div>
        </div>

        {/* Technician List */}
        <div className="divide-y divide-border-muted overflow-y-auto">
          {mockTechnicians.map((tech) => (
            <div
              key={tech.id}
              onClick={() => setSelectedTech(tech)}
              className={`grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer transition-colors hover:bg-bg-light ${
                selectedTech?.id === tech.id
                  ? "bg-primary/5 border-l-4 border-l-primary"
                  : "border-l-4 border-l-transparent"
              }`}
            >
              {/* Profile Col (Gets 4/12 slices of space) */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-fg-muted font-bold">
                  {tech.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm text-fg">{tech.name}</p>
                  <p className="text-xs text-fg-muted">{tech.email}</p>
                </div>
              </div>

              {/* ID Col (Gets 2/12 slices, perfectly centered text) */}
              <div className="col-span-2 text-center text-sm text-fg-muted">
                {tech.id}
              </div>

              {/* Specialization Col (Gets 2/12 slices) */}
              <div className="col-span-2 flex items-center gap-1.5 text-sm text-fg">
                <Zap size={14} className="text-yellow-500" />
                {tech.specialization}
              </div>

              {/* Assignment Col (Gets 3/12 slices) */}
              <div className="col-span-3">
                {tech.assignment ? (
                  <div>
                    <p className="text-sm font-medium text-fg">
                      {tech.assignment.title}
                    </p>
                    <p className="text-xs text-fg-muted">
                      {tech.assignment.jobId}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-fg-muted">Unassigned</p>
                )}
              </div>

              {/* Status Col (Gets 1/12 slice, pushed to the right) */}
              <div className="col-span-1 flex justify-end pr-4">
                <StatusBadge status={tech.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: Technician Details           */}
      <div className="flex-1 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Conditional Rendering: If NO tech is selected */}
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
          /* Conditional Rendering: If a tech IS selected */
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border-muted flex justify-between items-center">
              <h2 className="font-bold text-lg text-fg">Technician details</h2>
              <StatusBadge status={selectedTech.status} />
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Profile Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center text-xl text-fg-muted font-bold shrink-0">
                  {selectedTech.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-fg">
                    {selectedTech.name}
                  </h3>
                  <p className="text-sm text-fg-muted">
                    Technician ID: {selectedTech.id}
                  </p>
                  <p className="text-sm text-fg-muted">
                    {selectedTech.specialization} technician
                  </p>
                  <p className="text-sm text-fg-muted">{selectedTech.phone}</p>
                  <p className="text-sm text-fg-muted">{selectedTech.email}</p>
                </div>
              </div>

              {/* Assignment Form Panel */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
                <h4 className="font-bold text-fg mb-4">Assignment Panel</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-fg mb-1">
                      Select Job
                    </label>
                    <select className="w-full border border-border rounded-md p-2 text-sm bg-bg-base">
                      <option>Select a job...</option>
                      <option>Internet connectivity failure</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-fg mb-1">
                        Priority
                      </label>
                      <select className="w-full border border-border rounded-md p-2 text-sm bg-bg-base">
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
                        className="w-full border border-border rounded-md p-2 text-sm bg-bg-base"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-fg mb-1">
                      Note/ Instructions
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-border rounded-md p-2 text-sm bg-bg-base"
                    ></textarea>
                  </div>
                  <Button variant="primary" className="w-full">
                    Assign Job
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center justify-center p-4 border border-border-muted rounded-lg hover:border-primary hover:text-primary transition-colors text-fg-muted">
                  <Edit size={24} className="mb-2" />
                  <span className="text-xs font-medium">Edit Profile</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-border-muted rounded-lg hover:border-primary hover:text-primary transition-colors text-fg-muted">
                  <Briefcase size={24} className="mb-2" />
                  <span className="text-xs font-medium">Jobs History</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-border-muted rounded-lg hover:text-danger hover:border-danger transition-colors text-fg-muted">
                  <UserX size={24} className="mb-2" />
                  <span className="text-xs font-medium text-center leading-tight">
                    Deactivate account
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

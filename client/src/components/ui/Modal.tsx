import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; 
  children: React.ReactNode;
}

export default function AddJobModal({ isOpen, onClose }: AddJobModalProps) {
  // Simple state to handle form submission simulation
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    
    setTimeout(() => {
      setIsSubmitting(false);
      onClose(); // Close modal on success
    }, 1000);
  };

  return (
    // Backdrop overlay
    <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center p-4 backdrop-blur-sm">
      
      {/* Modal Card */}
      <div className="bg-bg-base w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-border-muted flex items-center justify-between sticky top-0 bg-bg-base rounded-t-xl z-10">
          <div>
            <h2 className="text-xl font-bold text-fg">Create New Job</h2>
            <p className="text-sm text-fg-muted mt-1">Fill out the details below to dispatch a new service request.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-fg-muted hover:text-fg hover:bg-bg-light rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="add-job-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Job Information */}
            <div>
              <h3 className="text-sm font-bold text-fg mb-3 uppercase tracking-wider">Job Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-fg mb-1">Job Title</label>
                  <input type="text" required placeholder="e.g. Router Connectivity Issue" className="w-full bg-bg-light border border-border-muted rounded-lg px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-primary transition-colors" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">Category</label>
                    <select required className="w-full bg-bg-light border border-border-muted rounded-lg px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-primary transition-colors">
                      <option value="">Select Category...</option>
                      <option value="networking">Networking</option>
                      <option value="electrical">Electrical</option>
                      <option value="hvac">HVAC</option>
                      <option value="plumbing">Plumbing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">Priority</label>
                    <select required className="w-full bg-bg-light border border-border-muted rounded-lg px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-primary transition-colors">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-fg mb-1">Issue Description</label>
                  <textarea required rows={3} placeholder="Describe the problem in detail..." className="w-full bg-bg-light border border-border-muted rounded-lg px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
                </div>
              </div>
            </div>

            <div className="border-t border-border-muted"></div>

            {/* 2. Client & Location */}
            <div>
              <h3 className="text-sm font-bold text-fg mb-3 uppercase tracking-wider">Client & Location</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">Client Name</label>
                    <input type="text" required placeholder="e.g. Acme Corp" className="w-full bg-bg-light border border-border-muted rounded-lg px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-fg mb-1">Contact Phone</label>
                    <input type="tel" required placeholder="+1 (555) 000-0000" className="w-full bg-bg-light border border-border-muted rounded-lg px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-fg mb-1">Service Address</label>
                  <input type="text" required placeholder="123 Main St, City, State" className="w-full bg-bg-light border border-border-muted rounded-lg px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="border-t border-border-muted"></div>

            {/* 3. Scheduling */}
            <div>
              <h3 className="text-sm font-bold text-fg mb-3 uppercase tracking-wider">Scheduling</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-fg mb-1">Date</label>
                  <input type="date" required className="w-full bg-bg-light border border-border-muted rounded-lg px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-fg mb-1">Time Window</label>
                  <select required className="w-full bg-bg-light border border-border-muted rounded-lg px-4 py-2.5 text-sm text-fg focus:outline-none focus:border-primary transition-colors">
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 4PM)</option>
                    <option value="evening">Evening (4PM - 8PM)</option>
                    <option value="emergency">Emergency / ASAP</option>
                  </select>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border-muted bg-bg-base rounded-b-xl flex justify-end gap-3 sticky bottom-0">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          {/* Form attribute connects this button to the form above */}
          <Button variant="primary" form="add-job-form" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Job"}
          </Button>
        </div>

      </div>
    </div>
  );
}
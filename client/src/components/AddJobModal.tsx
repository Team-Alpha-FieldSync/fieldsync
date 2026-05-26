import React from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddJobModal({ isOpen, onClose }: AddJobModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Hook up to your GraphQL mutation later!
    console.log("Form submitted!");
    onClose(); // Close the modal after submitting
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Job">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Job Title
          </label>
          <input
            type="text"
            placeholder="e.g. Internet Connectivity Failure"
            className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            required
          />
        </div>

        {/* Client & Category Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Client Name
            </label>
            <input
              type="text"
              placeholder="Client or Company"
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Category
            </label>
            <select className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary">
              <option>Networking</option>
              <option>Electrical</option>
              <option>HVAC</option>
              <option>Plumbing</option>
            </select>
          </div>
        </div>

        {/* Priority & Deadline Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Priority
            </label>
            <select className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Deadline
            </label>
            <input
              type="date"
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Describe the issue in detail..."
            className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary resize-none"
            required
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border-muted mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Job
          </Button>
        </div>
      </form>
    </Modal>
  );
}

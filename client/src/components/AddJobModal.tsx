import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import {
  CLIENTS_QUERY,
  TECHNICIANS_QUERY,
  JOBS_QUERY,
  DASHBOARD_STATS_QUERY,
} from "../graphql/queries";
import { CREATE_JOB_MUTATION } from "../graphql/mutations";
import { JOB_PRIORITY, JOB_CATEGORY } from "../utils/constants";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UserOption = { id: string; name: string };

const CATEGORY_OPTIONS = [
  { value: JOB_CATEGORY.NETWORKING, label: "Networking" },
  { value: JOB_CATEGORY.ELECTRICAL, label: "Electrical" },
  { value: JOB_CATEGORY.HVAC, label: "HVAC" },
  { value: JOB_CATEGORY.PLUMBING, label: "Plumbing" },
  { value: JOB_CATEGORY.OTHER, label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: JOB_PRIORITY.HIGH, label: "High" },
  { value: JOB_PRIORITY.MEDIUM, label: "Medium" },
  { value: JOB_PRIORITY.LOW, label: "Low" },
];

const INITIAL_FORM = {
  title: "",
  description: "",
  location: "",
  category: JOB_CATEGORY.NETWORKING as string,
  priority: JOB_PRIORITY.MEDIUM as string,
  deadline: "",
  clientId: "",
  technicianId: "",
};

export default function AddJobModal({ isOpen, onClose }: AddJobModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);

  // Populate the dropdowns. Skip while closed to avoid needless fetches.
  const { data: clientsData } = useQuery<{ clients: UserOption[] }>(
    CLIENTS_QUERY,
    { skip: !isOpen }
  );
  const { data: techniciansData } = useQuery<{ technicians: UserOption[] }>(
    TECHNICIANS_QUERY,
    { skip: !isOpen }
  );

  const [createJob, { loading, error }] = useMutation(CREATE_JOB_MUTATION, {
    refetchQueries: [
      { query: JOBS_QUERY },
      { query: DASHBOARD_STATS_QUERY },
    ],
  });

  const clients: UserOption[] = clientsData?.clients ?? [];
  const technicians: UserOption[] = techniciansData?.technicians ?? [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob({
        variables: {
          input: {
            title: form.title,
            description: form.description,
            location: form.location,
            category: form.category,
            priority: form.priority,
            deadline: form.deadline,
            clientId: form.clientId,
            technicianId: form.technicianId,
          },
        },
      });
      setForm(INITIAL_FORM);
      onClose();
    } catch {
      // Error is surfaced through the `error` object below.
    }
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
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Internet Connectivity Failure"
            className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            required
          />
        </div>

        {/* Client & Category Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Client
            </label>
            <select
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
              required
            >
              <option value="" disabled>
                Select a client...
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Technician & Priority Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Technician
            </label>
            <select
              name="technicianId"
              value={form.technicianId}
              onChange={handleChange}
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
              required
            >
              <option value="" disabled>
                Select a technician...
              </option>
              {technicians.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location & Deadline Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. 123 Tech Park, Bldg 4"
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
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
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the issue in detail..."
            className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary resize-none"
            required
          ></textarea>
        </div>

        {error && (
          <p className="text-sm text-danger">
            {error.message}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border-muted mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Creating..." : "Create Job"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

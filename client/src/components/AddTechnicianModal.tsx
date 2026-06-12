import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { CREATE_TECHNICIAN_MUTATION } from "../graphql/mutations";
import { TECHNICIANS_QUERY, MY_NOTIFICATIONS_QUERY } from "../graphql/queries";
import { JOB_CATEGORY } from "../utils/constants";

interface AddTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SPECIALIZATION_OPTIONS = [
  { value: JOB_CATEGORY.NETWORKING, label: "Networking" },
  { value: JOB_CATEGORY.ELECTRICAL, label: "Electrical" },
  { value: JOB_CATEGORY.HVAC, label: "HVAC" },
  { value: JOB_CATEGORY.PLUMBING, label: "Plumbing" },
  { value: JOB_CATEGORY.OTHER, label: "Other" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
  specialization: JOB_CATEGORY.NETWORKING as string,
};

export default function AddTechnicianModal({ isOpen, onClose }: AddTechnicianModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);

  const [createTechnician, { loading, error }] = useMutation(CREATE_TECHNICIAN_MUTATION, {
    refetchQueries: [{ query: TECHNICIANS_QUERY }, { query: MY_NOTIFICATIONS_QUERY }],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTechnician({
        variables: {
          input: {
            name: form.name,
            email: form.email,
            password: form.password,
            phone: form.phone || null,
            specialization: form.specialization,
          },
        },
      });
      setForm(INITIAL_FORM);
      onClose();
    } catch {
      // surfaced via `error`
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Technician">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-fg mb-1">Full Name</label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange}
            placeholder="e.g. John Smith" required
            className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Email</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="jsmith@fieldsync.com" required
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Phone</label>
            <input
              type="tel" name="phone" value={form.phone} onChange={handleChange}
              placeholder="+233 50 000 0000"
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Password</label>
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="Min. 8 characters" required minLength={8}
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Specialization</label>
            <select
              name="specialization" value={form.specialization} onChange={handleChange}
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            >
              {SPECIALIZATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error.message}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-border-muted mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Creating..." : "Create Technician"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
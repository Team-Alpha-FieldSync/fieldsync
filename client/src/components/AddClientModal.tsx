import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { CREATE_CLIENT_MUTATION } from "../graphql/mutations";
import { CLIENTS_QUERY } from "../graphql/queries";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (client: { id: string; name: string }) => void;
}

const INITIAL_FORM = { name: "", email: "", phone: "" };

export default function AddClientModal({ isOpen, onClose, onCreated }: AddClientModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);

  const [createClient, { loading, error }] = useMutation<{
    createClient: { id: string; name: string };
  }>(CREATE_CLIENT_MUTATION, {
    refetchQueries: [{ query: CLIENTS_QUERY }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await createClient({
        variables: {
          input: {
            name: form.name,
            email: form.email,
            phone: form.phone || null,
          },
        },
      });
      if (data?.createClient) onCreated?.(data.createClient);
      setForm(INITIAL_FORM);
      onClose();
    } catch {
      // surfaced via `error`
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Client">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-fg mb-1">Client / Company Name</label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange}
            placeholder="e.g. Acme Corp" required
            className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Email</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="contact@acme.com" required
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Phone</label>
            <input
              type="tel" name="phone" value={form.phone} onChange={handleChange}
              placeholder="+1 555 000 0000"
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error.message}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-border-muted mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Creating..." : "Create Client"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client/react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { UPDATE_CLIENT_MUTATION } from "../graphql/mutations";
import { CLIENTS_QUERY, MY_NOTIFICATIONS_QUERY } from "../graphql/queries";
import type { ClientView } from "../adapters/client";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientView | null;
}

export default function EditClientModal({ isOpen, onClose, client }: EditClientModalProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name,
        email: client.email,
        phone: client.phone === "�" ? "" : client.phone,
      });
    }
  }, [client]);

  const [updateClient, { loading, error }] = useMutation(UPDATE_CLIENT_MUTATION, {
    refetchQueries: [{ query: CLIENTS_QUERY }, { query: MY_NOTIFICATIONS_QUERY }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    try {
      await updateClient({
        variables: {
          id: client.rawId,
          input: {
            name: form.name,
            email: form.email,
            phone: form.phone || null,
          },
        },
      });
      onClose();
    } catch {
      // surfaced via `error`
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Client">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-fg mb-1">Client / Company Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-bg-light border border-border-muted text-sm text-fg rounded-md py-2 px-3 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error.message}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-border-muted mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving�" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

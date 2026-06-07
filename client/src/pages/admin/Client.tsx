import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Edit,
  UserX,
  ChevronLeft,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import { CLIENTS_QUERY } from "../../graphql/queries";
import { DELETE_CLIENT_MUTATION } from "../../graphql/mutations";
import { mapClient, type ClientNode } from "../../adapters/client";
import EditClientModal from "../../components/EditClientModal";

export default function Clients() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data, loading, error } = useQuery<{ clients: ClientNode[] }>(CLIENTS_QUERY);
  const clients = (data?.clients ?? []).map(mapClient);
  const selectedClient = clients.find((c) => c.rawId === selectedId) ?? null;

  const [deleteClient, { loading: isDeleting }] = useMutation(DELETE_CLIENT_MUTATION, {
    refetchQueries: [{ query: CLIENTS_QUERY }],
  });

  const selectClient = (rawId: string | null) => {
    setSelectedId(rawId);
    setActionError(null);
  };

  const run = async (fn: () => Promise<unknown>) => {
    setActionError(null);
    try {
      await fn();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-fg-muted">
        Loading clients…
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-danger">
        Failed to load clients: {error.message}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 h-full p-4 xl:p-6">
        {/* LEFT PANEL: All Clients List */}
        <div
          className={`${selectedClient ? "hidden xl:flex" : "flex"} flex-col xl:flex-2 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden h-full`}
        >
          <div className="p-4 xl:p-6 border-b border-border-muted">
            <h2 className="text-lg xl:text-xl font-bold text-fg">
              All Clients ({clients.length})
            </h2>
          </div>

          <div className="hidden xl:grid grid-cols-12 gap-4 px-6 py-3 bg-bg-light border-b border-border-muted text-xs font-bold text-fg-muted uppercase tracking-wider">
            <div className="col-span-9">Client</div>
            <div className="col-span-3 text-right pr-2">ID</div>
          </div>

          <div className="divide-y divide-border-muted overflow-y-auto">
            {clients.length === 0 ? (
              <div className="p-12 text-center text-sm text-fg-muted">No clients yet.</div>
            ) : (
              clients.map((client) => (
                <div
                  key={client.rawId}
                  onClick={() => selectClient(client.rawId)}
                  className={`flex flex-col xl:grid xl:grid-cols-12 gap-3 xl:gap-4 p-4 xl:px-6 xl:py-4 xl:items-center cursor-pointer transition-colors hover:bg-bg-light ${
                    selectedId === client.rawId
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="xl:col-span-9 flex items-center gap-3 w-full xl:w-auto">
                    <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-fg-muted font-bold shrink-0">
                      {client.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-sm text-fg truncate">{client.name}</p>
                      <p className="text-xs text-fg-muted truncate">{client.email}</p>
                    </div>
                  </div>

                  <div className="xl:col-span-3 text-sm text-fg-muted xl:text-right mt-1 xl:mt-0 flex xl:block items-center justify-between xl:justify-end gap-2 xl:pr-2">
                    <span className="xl:hidden text-xs font-bold uppercase tracking-wider">ID:</span>
                    <span>{client.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Client Details */}
        <div
          className={`${!selectedClient ? "hidden xl:flex" : "flex"} flex-col xl:flex-1 bg-bg-base border border-border-muted rounded-xl shadow-sm overflow-hidden h-full`}
        >
          {!selectedClient ? (
            <div className="p-12 flex flex-col items-center justify-center text-center h-full text-fg-muted">
              <UserX size={48} className="mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-fg mb-2">No Client Selected</h3>
              <p className="text-sm">
                Click on a client from the list to view their details and manage their profile.
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-4 xl:p-6 border-b border-border-muted flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 xl:gap-0">
                  <button
                    onClick={() => selectClient(null)}
                    className="xl:hidden p-1.5 -ml-2 rounded-lg text-fg-muted hover:bg-border-muted transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <h2 className="font-bold text-lg text-fg">Client Details</h2>
                </div>
              </div>

              <div className="p-4 xl:p-6 flex flex-col flex-1 overflow-y-auto">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full bg-border flex items-center justify-center text-xl text-fg-muted font-bold shrink-0">
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div className="space-y-2 overflow-hidden w-full mt-1">
                    <div>
                      <h3 className="font-bold text-lg xl:text-xl text-fg truncate leading-none mb-1">
                        {selectedClient.name}
                      </h3>
                      <p className="text-sm text-fg-muted">ID: {selectedClient.id}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-fg-muted pt-2">
                      <Phone size={16} className="shrink-0" />
                      <span className="truncate">{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-fg-muted">
                      <Mail size={16} className="shrink-0" />
                      <span className="truncate">{selectedClient.email}</span>
                    </div>
                  </div>
                </div>

                {actionError && (
                  <div className="p-3 mb-6 bg-danger/10 border border-danger/20 rounded-md text-sm text-danger">
                    {actionError}
                  </div>
                )}

                <div className="mt-auto pt-6">
                  <h4 className="text-xs font-bold text-fg-muted uppercase tracking-wider mb-3">
                    Manage Client
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setIsEditOpen(true)}
                      className="flex sm:flex-col items-center justify-center gap-3 sm:gap-2 p-3 sm:p-4 border border-border-muted rounded-lg hover:border-primary hover:text-primary transition-colors text-fg-muted bg-bg-base"
                    >
                      <Edit size={20} className="sm:mb-1 shrink-0" />
                      <span className="text-sm sm:text-xs font-medium">Edit Profile</span>
                    </button>

                    <button
                      onClick={() =>
                        run(async () => {
                          await deleteClient({ variables: { id: selectedClient.rawId } });
                          selectClient(null);
                        })
                      }
                      disabled={isDeleting}
                      className="flex sm:flex-col items-center justify-center gap-3 sm:gap-2 p-3 sm:p-4 border border-danger/30 rounded-lg hover:text-bg-light hover:bg-danger transition-colors text-danger bg-danger/5 disabled:opacity-50 disabled:hover:bg-danger/5 disabled:hover:text-danger"
                    >
                      <Trash2 size={20} className="sm:mb-1 shrink-0" />
                      <span className="text-sm sm:text-xs font-medium text-center leading-tight">
                        {isDeleting ? "Deleting…" : "Delete Client"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <EditClientModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        client={selectedClient}
      />
    </>
  );
}

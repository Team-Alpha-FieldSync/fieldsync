export type ClientNode = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  clientCode?: string | null;
  createdAt?: string;
};

export type ClientView = {
  rawId: string;
  id: string;
  name: string;
  email: string;
  phone: string;
};

export function mapClient(node: ClientNode): ClientView {
  return {
    rawId: node.id,
    id: node.clientCode ?? node.id,
    name: node.name,
    email: node.email,
    phone: node.phone ?? "—",
  };
}

import type { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client/react";
import AuthProvider from "../auth/AuthProvider";
import client from "../graphql/client";

type Props = {
  children: ReactNode;
};

export default function AppProvider({ children }: Props) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider >
        {children}
      </AuthProvider>
    </ApolloProvider>
  );
}
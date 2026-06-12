import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { API } from "../utils/constants";
import { getToken, removeToken } from "../utils/token";

const httpLink = new HttpLink({
  uri: API.GRAPHQL_URL,
});

//Auth Link - runs before every request
//Adds the JWT to the headers if one exists in localStorage
const authLink = new SetContextLink((prevContext) => {
  const token = getToken();

  return {
    ...prevContext,
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

//Error Link - centralizes GraphQL/network error logging and session expiry.
const errorLink = new ErrorLink(({ error, operation }) => {
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      if (import.meta.env.DEV) {
        console.error(
          `[GraphQL error] op=${operation.operationName} code=${err.extensions?.code ?? "?"}: ${err.message}`
        );
      }

      //Session is missing/expired -> drop the token and send the user to login
      if (err.extensions?.code === "UNAUTHENTICATED") {
        removeToken();
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }
    }
  } else if (import.meta.env.DEV) {
    console.error(`[Network error] op=${operation.operationName}:`, error);
  }
});

//Apollo Client Instance - composes the links and adds an in-memory cache.
//errorLink is first so it observes errors bubbling back up from httpLink.
const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { API } from "../utils/constants";
import { getToken } from "../utils/token";

const httpLink = new HttpLink({
  uri: API.GRAPHQL_URL,
});

//Auth Link - runs before every request
//Adds the JWT to the headers if one exists in localStorage
const authLink = new SetContextLink((prevContext) => {
    const token = getToken();

    return{
        ...prevContext,
        headers: {
            ...prevContext.headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

//Apollo Client Instance - composes the links and adds an in-memory cache.
const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
});

export default client
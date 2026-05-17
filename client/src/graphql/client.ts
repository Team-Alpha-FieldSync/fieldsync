import {ApolloClient, ApolloLink, InMemoryCache, HttpLink,} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';

//GraphQL endpoints: Will read from .env file
//Vite exposes env vars prefixed with VITE_ at build time.
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

//HTTP Link - knows how to send a GraphQL request to the backend.
const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
});

//Auth Link - runs before every request
//Adds the JWT to the headers if one exists in localStorage
const authLink = new SetContextLink((prevContext) => {
    const token = localStorage.getItem("token");

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
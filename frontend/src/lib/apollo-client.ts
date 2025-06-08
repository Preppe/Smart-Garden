import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useAuthStore } from '../stores/authStore';

// HTTP Link
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

// Auth Link - adds JWT token to headers
const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error Link - handles authentication errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED' || message.includes('Unauthorized')) {
        // Clear auth state and redirect to login
        useAuthStore.getState().logout();
        window.location.href = '/auth';
      }
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);

    // Handle 401/403 errors
    if ('statusCode' in networkError && (networkError.statusCode === 401 || networkError.statusCode === 403)) {
      useAuthStore.getState().logout();
      window.location.href = '/auth';
    }
  }
});

// Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add any specific cache policies here if needed
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

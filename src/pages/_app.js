import { ApolloProvider } from '@apollo/client';
import 'normalize.css/normalize.css';
import 'styles/main.scss';
import React from 'react';
import { useApollo } from 'client';
import ThemeStyles from 'components/ThemeStyles/ThemeStyles';

export default function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps);

  return (
    <>
      <ThemeStyles />
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
}

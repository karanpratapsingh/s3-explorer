import { CssBaseline, GeistProvider } from '@geist-ui/core';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import ErrorBoundary from '../components/error-boundary';
import '../styles/globals.css';

const client = new QueryClient();

function App({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <QueryClientProvider client={client}>
      <GeistProvider>
        <ErrorBoundary>
          <Head>
            <link rel='icon' href='/favicon.png' />
          </Head>
          <CssBaseline />
          <Component {...pageProps} />
        </ErrorBoundary>
      </GeistProvider>
    </QueryClientProvider>
  );
}

export default App;

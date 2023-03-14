import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
// import { Web3Provider } from '@providers';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

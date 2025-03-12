import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ 
  children, 
  title = 'GeoBit - A concise daily geoscience newsletter',
  description = 'Get the most important geoscience research and discoveries in a free daily email'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;

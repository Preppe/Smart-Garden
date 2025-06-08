import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface LayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const Layout = ({ children, title, description }: LayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{title} - Orto</title>
        <meta name="description" content={description || `${title} - Sistema di gestione giardino smart`} />
      </Helmet>
      
      <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <Header title={title} description={description} />

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;

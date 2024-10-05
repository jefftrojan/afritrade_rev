import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, LogOut, User, CreditCard, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
// Import the new components
import NewRequests from './neworders';
import ConfirmedRequests from './confirmedorders';
import DeliveredRequests from './status';
import Profile from './profile';
import PaymentOptions from './payment';
import Pending from './delivered';

const Sidebar = ({ expanded, setExpanded, activeSection, setActiveSection }: { 
  expanded: boolean; 
  setExpanded: (expanded: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}) => {
  const [ordersExpanded, setOrdersExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Effect to check if running on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (expanded && window.innerWidth < 1024 && (event.target as HTMLElement).closest('.sidebar') === null) {
        setExpanded(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [expanded, setExpanded]);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    if (isClient && window.innerWidth < 1024) {
      setExpanded(false);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className={`sidebar fixed left-0 top-0 h-full bg-green-800 text-white transition-all duration-300 z-50
                     ${expanded ? 'w-64' : 'w-16'} 
                     lg:relative lg:translate-x-0
                     ${expanded ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <button onClick={() => setExpanded(!expanded)} className="p-4 lg:hidden">
        {expanded ? <X size={24} /> : <Menu size={24} />}
      </button>
      <nav className="mt-8">
        <div className="mb-4">
          <button onClick={() => setOrdersExpanded(!ordersExpanded)} 
                  className="flex items-center w-full p-2 hover:bg-green-700">
            <Package size={20} className="mr-2" />
            <span className={expanded ? 'block' : 'hidden lg:block'}>Client Requests</span>
            {(expanded || (isClient && window.innerWidth >= 1024)) && (
              ordersExpanded ? <ChevronDown size={16} className="ml-auto" /> : <ChevronRight size={16} className="ml-auto" />
            )}
          </button>
          {(expanded || (isClient && window.innerWidth >= 1024)) && ordersExpanded && (
            <div className="ml-4">
              <button onClick={() => handleSectionClick('newRequests')} className={`block w-full text-left p-2 hover:bg-green-700 ${activeSection === 'newRequests' ? 'bg-green-700' : ''}`}>New Delivery Requests</button>
              <button onClick={() => handleSectionClick('confirmedRequests')} className={`block w-full text-left p-2 hover:bg-green-700 ${activeSection === 'confirmedRequests' ? 'bg-green-700' : ''}`}>Accepted Requests</button>
              <button onClick={() => handleSectionClick('deliveredRequests')} className={`block w-full text-left p-2 hover:bg-green-700 ${activeSection === 'deliveredRequests' ? 'bg-green-700' : ''}`}>Delivery Status</button>
              <button onClick={() => handleSectionClick('pendingdeliveries')} className={`block w-full text-left p-2 hover:bg-green-700 ${activeSection === 'pendingdeliveries' ? 'bg-green-700' : ''}`}>Delivered</button>
            </div>
          )}
        </div>
        <div className="mb-4">
          <button onClick={() => handleSectionClick('profile')} className={`flex items-center w-full p-2 hover:bg-green-700 ${activeSection === 'profile' ? 'bg-green-700' : ''}`}>
            <User size={20} className="mr-2" />
            <span className={expanded ? 'block' : 'hidden lg:block'}>Profile</span>
          </button>
        </div>
      </nav>
      <button onClick={handleLogout} className="absolute bottom-4 left-0 flex items-center w-full p-2 hover:bg-green-700">
        <LogOut size={20} className="mr-2" />
        <span className={expanded ? 'block' : 'hidden lg:block'}>Logout</span>
      </button>
    </div>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => (
  <header className="fixed top-0 right-0 left-0 lg:left-16 h-16 bg-white shadow-md flex items-center justify-between px-4 z-40">
    <button onClick={toggleSidebar} className="lg:hidden text-green-700">
      <Menu size={24} />
    </button>
    <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center ml-auto">
      <User size={24} />
    </div>
  </header>
);

const Content = ({ activeSection }: { activeSection: string }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'newRequests':
        return <NewRequests />;
      case 'confirmedRequests':
        return <ConfirmedRequests />;
      case 'deliveredRequests':
        return <DeliveredRequests />;
      case 'pendingdeliveries':
        return <Pending />;
      case 'profile':
        return <Profile />;
      case 'paymentOptions':
        return <PaymentOptions />;
      default:
        return (
          <>
            <NewRequests />
          </>
        );
    }
  };

  return (
    <main className="mt-16 lg:ml-16 p-6">
      {renderContent()}
    </main>
  );
};

const Dashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isClient, setIsClient] = useState(false);

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  // Effect to check if running on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarExpanded(true);
      }
    };

    if (isClient) {
      window.addEventListener('resize', handleResize);
      handleResize();
    }

    return () => {
      if (isClient) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [isClient]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white">
      <Sidebar 
        expanded={sidebarExpanded} 
        setExpanded={setSidebarExpanded} 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <Content activeSection={activeSection} />
      </div>
    </div>
  );
};

export default Dashboard;

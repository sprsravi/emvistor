import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CheckIn from './components/CheckIn';
import VisitorList from './components/VisitorList';
import History from './components/History';
import Reports from './components/Reports';
import { useVisitors } from './hooks/useVisitors';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { visitors, addVisitor, checkOutVisitor, deleteVisitor, getStats, loading, error } = useVisitors();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Please make sure the backend server is running on http://localhost:3001</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            stats={getStats()}
            visitors={visitors}
            onCheckOut={checkOutVisitor}
          />
        );
      case 'checkin':
        return <CheckIn onAddVisitor={addVisitor} />;
      case 'visitors':
        return (
          <VisitorList
            visitors={visitors}
            onCheckOut={checkOutVisitor}
          />
        );
      case 'history':
        return <History visitors={visitors} />;
      case 'reports':
        return <Reports visitors={visitors} />;
      default:
        return <Dashboard stats={getStats()} visitors={visitors} onCheckOut={checkOutVisitor} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 z-50">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Loading...</span>
          </div>
        </div>
      )}
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
import React, { useState, useCallback } from 'react';
import ProductStockOverview from '../components/dashboard/ProductStockOverview';
import TransactionLedger from '../components/dashboard/TransactionLedger';
import SimulateTransactions from '../components/dashboard/SimulateTransactions';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


const DashboardPage: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);  

  const handleEventSent = useCallback(() => {
    setRefreshKey(prev => prev + 1);  
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success("Logout successfully!"); 
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Inventory Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {authState.user?.username || 'User'}!</span>
            <button
              onClick={handleLogout}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1 lg:col-span-1">
            <SimulateTransactions onEventSent={handleEventSent} />
          </div>
          <div className="md:col-span-1 lg:col-span-2">
            <ProductStockOverview key={`stock-${refreshKey}`} /> 
          </div>
        </div>

        <div>
          <TransactionLedger key={`ledger-${refreshKey}`} /> 
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
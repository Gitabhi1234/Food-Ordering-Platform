import React from 'react';
import { useLocation } from 'react-router-dom';
import WeeklyEarningChart from './WeeklyEarningChart';


const AdminDashboard = () => {
  const { state } = useLocation();
  const data = state?.earningsData || [];

  return (
     <div>
       <div className="min-h-screen bg-[#f9fafb] p-6">
        <WeeklyEarningChart data={data} />
    </div>
     </div>
  );
};

export default AdminDashboard;

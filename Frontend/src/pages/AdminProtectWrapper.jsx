import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDataContext from '../context/AdminDataContext';
import axios from 'axios';

const AdminProtectWrapper = ({ children }) => {
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { admin, setAdmin } = React.useContext(AdminDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/admin-login');
    }
  }, [token, navigate]);

  axios.get(`${import.meta.env.VITE_BASE_URL}/admins/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => {
      if (response.status === 200) {
        const data = response.data;
        setAdmin(data.admin);
        setIsLoading(false);
      }
    })
    .catch(error => {
      console.error('Error fetching admin profile:', error);
      localStorage.removeItem('token');
      navigate('/admin-login');
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader">Loading</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectWrapper;
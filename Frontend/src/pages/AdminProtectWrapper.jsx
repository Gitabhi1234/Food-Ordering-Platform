import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminDataContext from "../context/AdminDataContext";

const AdminProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const { setAdmin } = useContext(AdminDataContext);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    const fetchAdmin = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admins/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;

          setAdmin(data.admin || data);

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);

        localStorage.removeItem("token");

        navigate("/admin-login", { replace: true });
      }
    };

    fetchAdmin();
  }, [token, navigate, setAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminProtectWrapper;
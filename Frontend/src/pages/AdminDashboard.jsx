import React, { useEffect, useState } from "react";
import axios from "axios";
import WeeklyEarningChart from "./WeeklyEarningChart";

const AdminDashboard = () => {
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWeeklyEarnings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/dashboard/weekly-earnings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data);

      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchWeeklyEarnings();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <WeeklyEarningChart data={data} />
    </div>
  );
};

export default AdminDashboard;
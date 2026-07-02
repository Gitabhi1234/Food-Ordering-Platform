import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setUserDetails(response.data);
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleGoBack = () => {
    navigate("/user-home");
  };

  const statusGroups = {
    Accepted: "✅ Accepted",
    Pending: "⌛ Pending",
    Rejected: "❌ Rejected",
    Dispatched: " Packed",
    Delivered: " Delivered",
  };

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <div className="min-h-screen bg-[#f9fafb] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleGoBack}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
          >
            ← Go Back
          </button>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          👤 User Profile
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Profile Details
          </h2>
          <div className="text-gray-600 space-y-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {userDetails?.fullname?.firstname || "N/A"}{" "}
              {userDetails?.fullname?.lastname || ""}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {userDetails?.email || "N/A"}
            </p>
          </div>
        </div>

        <div className="mb-6 flex gap-4 flex-wrap justify-center">
          {Object.keys(statusGroups).map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                activeTab === status
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(status)}
            >
              {statusGroups[status]}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            {statusGroups[activeTab]} Orders
          </h2>

          {filteredOrders.length === 0 ? (
            <p className="text-gray-500 text-center">
              No {activeTab.toLowerCase()} orders.
            </p>
          ) : (
            filteredOrders.map((order, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-5 mb-6 bg-gray-50"
              >
                <div className="mb-3">
                  <p className="text-gray-700 break-all">
                    <span className="font-medium">Order ID:</span>{" "}
                    {order.orderId ? (
                      <>
                        {order.orderId.slice(0, -4)}
                        <span className="font-bold">
                          {order.orderId.slice(-4)}
                        </span>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Order Date:</span>{" "}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Status:</span> {order.status}
                  </p>
                </div>
                <div className="mt-4 space-y-4">
                  <h3 className="font-semibold text-gray-600">Items:</h3>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 bg-white p-3 rounded-md shadow-sm"
                    >
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="text-gray-700 space-y-1">
                        <p>
                          <span className="font-medium">Item Name:</span>{" "}
                          {item.name}
                        </p>
                        <p>
                          <span className="font-medium">Price:</span> ₹
                          {item.price.toFixed(2)}
                        </p>
                        <p>
                          <span className="font-medium">Quantity:</span>{" "}
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

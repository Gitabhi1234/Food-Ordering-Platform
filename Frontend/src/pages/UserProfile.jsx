import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Placed");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
    Placed: "Placed",
    Accepted: "Accepted",
    Rejected: "Rejected",
    Dispatched: "Dispatched",
    Delivered: "Delivered",
  };

  const filteredOrders = orders.filter(
    (order) => order.status === activeTab
  );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">

      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-6">

          <button
            onClick={handleGoBack}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            ← Go Back
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>

        </div>

        <h1 className="text-3xl font-bold text-center mb-8">
          👤 User Profile
        </h1>

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-xl font-bold mb-4">
            Profile Details
          </h2>

          <p>
            <span className="font-semibold">
              Name :
            </span>{" "}
            {userDetails.first_name} {userDetails.last_name}
          </p>

          <p>
            <span className="font-semibold">
              Email :
            </span>{" "}
            {userDetails.email}
          </p>

        </div>

        <div className="flex justify-center gap-3 flex-wrap mb-8">

          {Object.keys(statusGroups).map((status) => (

            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2 rounded-full border transition ${
                activeTab === status
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {statusGroups[status]}
            </button>

          ))}

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold text-center mb-6">
            {statusGroups[activeTab]} Orders
          </h2>

          {filteredOrders.length === 0 ? (

            <p className="text-center text-gray-500">
              No {activeTab} Orders Found
            </p>

          ) : (

            filteredOrders.map((order) => (

              <div
                key={order.id}
                className="border rounded-xl p-5 mb-6 bg-gray-50"
              >

                <div className="space-y-2 mb-5">

                  <p>
                    <span className="font-semibold">
                      Order ID :
                    </span>{" "}
                    #{order.id}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Order Date :
                    </span>{" "}
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Status :
                    </span>{" "}
                    {order.status}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Delivery Address :
                    </span>{" "}
                    {order.selected_location}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Total :
                    </span>{" "}
                    ₹{order.total_price.toFixed(2)}
                  </p>

                </div>

                <h3 className="font-bold mb-3">
                  Ordered Items
                </h3>

                {(order.order_items || []).map((item) => (

                  <div
                    key={item.id}
                    className="flex gap-4 items-center border rounded-lg p-3 mb-3 bg-white"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />

                    <div>

                      <h4 className="font-semibold text-lg">
                        {item.name}
                      </h4>

                      <p>
                        Price : ₹{item.price}
                      </p>

                      <p>
                        Quantity : {item.quantity}
                      </p>

                      <p className="font-semibold text-green-600">
                        Total : ₹
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
};

export default UserProfile;
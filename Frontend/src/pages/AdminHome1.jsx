import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OrderDecisionPanel from "../components/OrderDecisionPanel";

const AdminHome1 = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [pendingOrder, setPendingOrder] = useState(null);

  const token = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/orders/coming-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data.orders || response.data;

        setOrders(data);

        const firstPending = data.find(
          (o) => o.status === "Placed"
        );

        setPendingOrder(firstPending || null);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setPendingOrder(null);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 10000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const acceptedOrders = [...orders]
  .filter((order) =>
    ["Accepted", "Dispatched", "Delivered"].includes(order.status)
  )
  .sort((a, b) => {
    if (a.status === "Delivered" && b.status !== "Delivered") return 1;
    if (a.status !== "Delivered" && b.status === "Delivered") return -1;

    return new Date(b.created_at) - new Date(a.created_at);
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin-login");
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/orders/${orderId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col">

      <div className="flex justify-between items-center mb-4">

        <img
          className="w-16"
          src="https://cdn-icons-png.flaticon.com/128/3063/3063822.png"
          alt="Logo"
        />

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/admin-home")}
            className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded"
          >
            Adjust Your Items
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded"
          >
            Logout
          </button>

        </div>

      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">
        Orders Dashboard
      </h1>

      {acceptedOrders.length === 0 ? (

        <p className="text-center text-lg">
          No orders found.
        </p>

      ) : (

        <div className="overflow-x-auto mb-4">

          {acceptedOrders.map((order) => (

            <div
              key={order.id}
              className="mb-6 border rounded bg-white p-4 shadow-sm border-green-400"
            >

              <div className="mb-3 flex justify-between items-center">

                <span className="font-bold text-black">
                  Order ID : {order.id}
                </span>

                <span className="px-2 py-1 rounded text-xs font-semibold bg-green-200 text-green-800">
                  {order.status}
                </span>

              </div>

              <div className="text-sm text-gray-600 mb-3">

                <p>
                  Time :{" "}
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : "N/A"}
                </p>

                <p>
                  Address :{" "}
                  {order.selected_location || "N/A"}
                </p>

              </div>

              <table className="w-full border text-sm mb-4">

                <thead>

                  <tr>

                    <th className="border px-2 py-2">
                      Item Name
                    </th>

                    <th className="border px-2 py-2">
                      Quantity
                    </th>

                    <th className="border px-2 py-2">
                      Price
                    </th>

                    <th className="border px-2 py-2">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {(order.order_items || []).map((item, index) => (

                    <tr key={index}>

                      <td className="border px-2 py-2">
                        {item.name}
                      </td>

                      <td className="border px-2 py-2 text-center">
                        {item.quantity}
                      </td>

                      <td className="border px-2 py-2 text-center">
                        ₹{item.price}
                      </td>

                      <td className="border px-2 py-2 text-center">
                        ₹{(
                          item.quantity * item.price
                        ).toFixed(2)}
                      </td>

                    </tr>

                  ))}

                  <tr>

                    <td
                      colSpan={3}
                      className="border px-2 py-2 font-bold"
                    >
                      Grand Total
                    </td>

                    <td className="border px-2 py-2 font-bold text-center">
                      ₹
                      {order.total_price
                        ? order.total_price.toFixed(2)
                        : (
                            order.order_items || []
                          )
                            .reduce(
                              (sum, item) =>
                                sum +
                                item.price *
                                  item.quantity,
                              0
                            )
                            .toFixed(2)}
                    </td>

                  </tr>

                </tbody>

              </table>

              <div className="flex gap-3">

                {order.status === "Accepted" && (

                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        order.id,
                        "Dispatched"
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Dispatch
                  </button>

                )}

                {order.status === "Dispatched" && (

                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        order.id,
                        "Delivered"
                      )
                    }
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Mark Delivered
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

      {pendingOrder && (

        <OrderDecisionPanel
          order={pendingOrder}
          setDecisionPanelOpen={setPendingOrder}
          refreshOrders={fetchOrders}
        />

      )}

    </div>
  );
};

export default AdminHome1;
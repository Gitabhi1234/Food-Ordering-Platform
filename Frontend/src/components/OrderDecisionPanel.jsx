import React from "react";
import axios from "axios";

const OrderDecisionPanel = ({
  order,
  setDecisionPanelOpen,
  refreshOrders,
}) => {
  if (!order) return null;

  const token = localStorage.getItem("token");

  const handleUpdateOrderStatus = async (status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/orders/${order.id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      refreshOrders();
      setDecisionPanelOpen(null);

    } catch (error) {
      console.error("Failed to update order status:", error);

      alert(
        error.response?.data?.detail ||
        "Failed to update order status."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-[550px] p-6">

        <h2 className="text-2xl font-bold mb-5">
          New Incoming Order
        </h2>

        <div className="space-y-2 mb-5">

          <p>
            <span className="font-semibold">Order ID:</span>{" "}
            {order.id}
          </p>

          <p>
            <span className="font-semibold">Status:</span>{" "}
            {order.status}
          </p>

          <p>
            <span className="font-semibold">Delivery Address:</span>{" "}
            {order.selected_location}
          </p>

          <p>
            <span className="font-semibold">Order Time:</span>{" "}
            {order.created_at
              ? new Date(order.created_at).toLocaleString()
              : "N/A"}
          </p>

        </div>

        <table className="w-full border mb-5">

          <thead className="bg-gray-100">

            <tr>

              <th className="border p-2">
                Item
              </th>

              <th className="border p-2">
                Qty
              </th>

              <th className="border p-2">
                Price
              </th>

              <th className="border p-2">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {(order.order_items || []).map((item, index) => (

              <tr key={index}>

                <td className="border p-2">
                  {item.name}
                </td>

                <td className="border p-2 text-center">
                  {item.quantity}
                </td>

                <td className="border p-2 text-center">
                  ₹{item.price}
                </td>

                <td className="border p-2 text-center">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="flex justify-between items-center mb-5">

          <h3 className="font-bold text-xl">
            Total :
          </h3>

          <h3 className="font-bold text-xl text-green-600">
            ₹{order.total_price}
          </h3>

        </div>

        {order.status === "Placed" ? (

          <div className="flex gap-4">

            <button
              onClick={() => handleUpdateOrderStatus("Accepted")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
            >
              Accept Order
            </button>

            <button
              onClick={() => handleUpdateOrderStatus("Rejected")}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
            >
              Reject Order
            </button>

          </div>

        ) : (

          <button
            onClick={() => setDecisionPanelOpen(null)}
            className="w-full bg-gray-300 py-3 rounded-lg"
          >
            Close
          </button>

        )}

      </div>

    </div>
  );
};

export default OrderDecisionPanel;
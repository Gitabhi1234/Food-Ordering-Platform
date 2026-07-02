import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OrderDecisionPanel from '../components/OrderDecisionPanel';

const AdminHome1 = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [pendingOrder, setPendingOrder] = useState(null);
  const token = localStorage.getItem('token');

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admins/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200 && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
        const firstPending = response.data.orders.find((o) => o.status === 'Pending');
        setPendingOrder(firstPending || null);
      } else {
        setOrders([]);
        setPendingOrder(null);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
      setPendingOrder(null);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const acceptedOrders = orders
    .filter((order) => order.status === 'Accepted' || order.status === 'Dispatched')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/admins/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
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
            onClick={() => navigate('/admin-home')}
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
        <p className="text-center text-lg">No accepted orders found.</p>
      ) : (
        <div className="overflow-x-auto mb-4">
          {acceptedOrders.map((order) => (
            <div
              key={order.orderId}
              className="mb-6 border rounded bg-white p-2 shadow-sm border-green-400"
            >
              <div className="mb-2 flex justify-between items-center">
                <span className="font-bold text-black">
                  Order ID: {order.orderId}
                </span>

                <span className="px-2 py-1 rounded text-xs font-semibold bg-green-200 text-green-800">
                  {order.status}
                </span>
              </div>

              <div className="text-sm text-gray-500 mb-2">
                <p>
                  Time:{' '}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : 'N/A'}
                </p>

                <p>Address: {order.selectedLocation || 'N/A'}</p>
              </div>

              <table className="min-w-full border text-sm mb-2">
                <thead>
                  <tr>
                    <th className="px-2 py-1 border">Item Name</th>
                    <th className="px-2 py-1 border">Quantity</th>
                    <th className="px-2 py-1 border">Price (₹)</th>
                    <th className="px-2 py-1 border">Sub Total (₹)</th>
                  </tr>
                </thead>

                <tbody>
                  {(order.cartItems || []).map((item, index) => (
                    <tr key={index}>
                      <td className="px-2 py-1 border">{item.name}</td>
                      <td className="px-2 py-1 border">{item.quantity}</td>
                      <td className="px-2 py-1 border">{item.price}</td>
                      <td className="px-2 py-1 border">
                        {(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={3} className="px-2 py-1 border font-bold">
                      Order Total
                    </td>

                    <td className="px-2 py-1 border font-bold">
                      {(order.cartItems || []).reduce(
                        (sum, item) =>
                          sum + (item.price || 0) * (item.quantity || 0),
                        0
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex gap-4">
                {order.status === 'Accepted' && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(order.orderId, 'Dispatched')
                    }
                    className="bg-blue-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Dispatch
                  </button>
                )}

                {order.status === 'Dispatched' && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(order.orderId, 'Delivered')
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
          setDecisionPanelOpen={() => setPendingOrder(null)}
          refreshOrders={fetchOrders}
        />
      )}
    </div>
  );
};

export default AdminHome1;
import React from 'react';
import axios from 'axios';

const OrderDecisionPanel = ({ order, setDecisionPanelOpen, refreshOrders }) => {
  if (!order) return null;

  const token = localStorage.getItem('token');

  const handleUpdateOrderStatus = async (status) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admins/update-order-status`,
        { orderId: order.orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshOrders();
      setDecisionPanelOpen(null);
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status.');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div style={{
        background: '#fff', borderRadius: 8, padding: 24, minWidth: 300, boxShadow: '0 2px 8px #0002'
      }}>
        <h2 style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12 }}>Order Decision</h2>
        <div style={{ marginBottom: 12 }}>
          <div><b>Order ID:</b> {order.orderId}</div>
          <div><b>Status:</b> {order.status}</div>
        </div>
        <table style={{ width: '100%', marginBottom: 12, fontSize: 14, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: 4 }}>Item</th>
              <th style={{ border: '1px solid #ddd', padding: 4 }}>Qty</th>
              <th style={{ border: '1px solid #ddd', padding: 4 }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {(order.cartItems || []).map((item, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #ddd', padding: 4 }}>{item.name}</td>
                <td style={{ border: '1px solid #ddd', padding: 4 }}>{item.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: 4 }}>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {order.status === 'Pending' ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4 }}
              onClick={() => handleUpdateOrderStatus('Accepted')}
            >
              Accept
            </button>
            <button
              style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4 }}
              onClick={() => handleUpdateOrderStatus('Rejected')}
            >
              Reject
            </button>
            <button
              style={{ background: '#e5e7eb', border: 'none', padding: '8px 16px', borderRadius: 4 }}
              onClick={() => setDecisionPanelOpen(null)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            style={{ background: '#e5e7eb', border: 'none', padding: '8px 16px', borderRadius: 4 }}
            onClick={() => setDecisionPanelOpen(null)}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDecisionPanel;

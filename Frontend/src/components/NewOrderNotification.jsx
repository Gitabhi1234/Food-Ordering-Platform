import React from 'react';

const NewOrderNotification = ({ order, onViewOrder }) => {
  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">New Order Received!</h3>
      <p className="mb-1">Order ID: {order.orderId}</p>
      <p className="mb-4">
        Total: ₹{order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}
      </p>
      <div className="flex justify-center">
        <button
          onClick={onViewOrder}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          View Order
        </button>
      </div>
    </div>
  );
};

export default NewOrderNotification;
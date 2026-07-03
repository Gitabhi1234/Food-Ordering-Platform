import React from "react";
import { useNavigate } from "react-router-dom";

const OrderAccepted = ({
  orderId,
  selectedLocation,
  totalPrice,
  status = "Placed",
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">

        <button
          onClick={() => navigate("/user-home")}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
        >
          <i className="ri-close-line"></i>
        </button>

        <div className="flex flex-col items-center">

          <img
            src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
            alt="Success"
            className="w-28 mb-4"
          />

          <h2 className="text-3xl font-bold text-green-600">
            Order Placed!
          </h2>

          <p className="text-gray-500 mt-2 text-center">
            Your order has been placed successfully and is waiting for restaurant confirmation.
          </p>

        </div>

        <div className="mt-8 border rounded-xl divide-y">

          <div className="flex justify-between p-4">
            <span className="font-medium">Order ID</span>
            <span className="font-semibold">
              #{orderId || "N/A"}
            </span>
          </div>

          <div className="flex justify-between p-4">
            <span className="font-medium">Status</span>
            <span className="text-blue-600 font-semibold">
              {status}
            </span>
          </div>

          <div className="p-4">
            <p className="font-medium mb-1">
              Delivery Address
            </p>

            <p className="text-gray-600 text-sm">
              {selectedLocation}
            </p>
          </div>

          <div className="flex justify-between p-4">
            <span className="font-medium">
              Total Amount
            </span>

            <span className="text-green-600 font-bold text-lg">
              ₹{Number(totalPrice || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between p-4">
            <span className="font-medium">
              Estimated Delivery
            </span>

            <span className="font-semibold">
              25-35 mins
            </span>
          </div>

        </div>

        <button
          onClick={() => navigate("/user-home")}
          className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
};

export default OrderAccepted;
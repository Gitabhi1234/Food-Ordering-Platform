import React from "react";
import { useNavigate } from "react-router-dom";

const OrderAccepted = ({ selectedLocation, totalPrice }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/user-home"); // Redirect to user home
  };

  return (
    <div>
      <h5
        onClick={handleGoBack}
        className="absolute top-0 text-center w-[93%]"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="font-semibold mb-5 p-3 text-2xl text-green-500">
        Your Order Has Been Accepted
      </h3>
      <div className="flex justify-center gap-2 items-center flex-col">
        <img
          className="h-24"
          src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
          alt="Order accepted image"
        />
        <div className="w-full mt-5">
          <div className="flex gap-5 items-center p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-line"></i>
            <div className="flex flex-col">
              <h3 className="font-bold">
                {selectedLocation ? selectedLocation : "562/11-A"}
              </h3>
              <p className="text-sm -mt-1 text-gray-600">
                {selectedLocation
                  ? "Selected location"
                  : "Hotel Chhava, Chhatrapati Sambhaji Maharaj Nagar"}
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-center p-3">
            <i className="text-lg ri-money-rupee-circle-line"></i>
            <div className="flex gap-2">
              <h3 className="font-semibold">Total Price :- </h3>
              <h2>₹{totalPrice ? totalPrice.toFixed(2) : "0.00"}</h2>
            </div>
          </div>
        </div>
        <button
          onClick={handleGoBack}
          className="bg-green-500 hover:bg-green-600 mt-5 p-2 font-bold text-lg text-white border-2 rounded-xl w-full h-full border-black"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderAccepted;
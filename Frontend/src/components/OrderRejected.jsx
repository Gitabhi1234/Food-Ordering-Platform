import React from "react";
import { useNavigate } from "react-router-dom";

const OrderRejected = ({ selectedLocation, totalPrice }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/user-home");
  };

  return (
    <div>
      <h5
        onClick={handleGoBack}
        className="absolute top-0 text-center w-[93%]"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="font-semibold mb-5 p-3 text-2xl text-red-500">
        Your Order Has Been Rejected Due to Unavailability of the Partner
      </h3>

      <div className="flex justify-center gap-2 items-center flex-col">
        <img
          className="h-24"
          src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png"
          alt="Order rejected"
        />

        <div className="w-full mt-5">
          <div className="flex gap-5 items-center p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-line"></i>

            <div className="flex flex-col">
              <h3 className="font-bold">
                {selectedLocation || "Delivery Location"}
              </h3>

              <p className="text-sm -mt-1 text-gray-600">
                {selectedLocation || "Location not available"}
              </p>
            </div>
          </div>

          <div className="flex gap-5 items-center p-3">
            <i className="text-lg ri-money-rupee-circle-line"></i>

            <div className="flex gap-2">
              <h3 className="font-semibold">
                Total Price :-
              </h3>

              <h2>
                ₹{Number(totalPrice || 0).toFixed(2)}
              </h2>
            </div>
          </div>
        </div>

        <button
          onClick={handleGoBack}
          className="bg-gray-500 hover:bg-gray-600 mt-5 p-2 font-bold text-lg text-white border-2 rounded-xl w-full border-black"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderRejected;
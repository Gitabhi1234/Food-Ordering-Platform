import React, { useEffect, useState } from "react";
import axios from "axios";

const ConfirmOrder = ({
  setConfirmOrderPanel,
  setLookingForAcceptancePanel,
  setOrderId,
  selectedLocation,
  totalPrice,
  setTotalPrice
}) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/cart`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchedCartItems = response.data.cartItems;

        if (Array.isArray(fetchedCartItems)) {
          const computedTotal = fetchedCartItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );

          setCartItems(fetchedCartItems);
          setTotalPrice(computedTotal);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [setTotalPrice]);

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("token");

    try {
      const adminResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admins/getadmin`,
        { cartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const adminId = adminResponse.data.adminId;

      if (!adminId) {
        console.error("No admin found for the selected items.");
        return;
      }

      const orderData = {
        cartItems,
        totalPrice,
        selectedLocation,
        adminId,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admins/send-order`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const returnedOrderId = response.data.orderId;

        if (returnedOrderId) {
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/users/cart/confirm`,
            { orderId: returnedOrderId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setOrderId(returnedOrderId);
          setConfirmOrderPanel(false);
          setLookingForAcceptancePanel(true);
        }
      }
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  return (
    <div>
      <h5
        onClick={() => setConfirmOrderPanel(false)}
        className="absolute top-0 text-center w-[93%]"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="font-semibold mb-5 p-3 text-2xl">Confirm Your Order</h3>
      <div className="flex justify-center gap-2 items-center flex-col">
        <img
          className="h-24"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi_aWDFShDagKlHGeUT87aKYCRp_hTWs1t_g&s"
          alt="Food ready image"
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
          onClick={handleConfirmOrder}
          className="bg-green-500 hover:bg-green-600 mt-5 p-2 font-bold text-lg text-white border-2 rounded-xl w-full h-full border-black"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default ConfirmOrder;

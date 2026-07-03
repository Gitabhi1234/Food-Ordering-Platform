import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const ConfirmOrder = ({
  setConfirmOrderPanel,
  setLookingForAcceptancePanel,
  setOrderId,
  selectedLocation
}) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const items = res.data.cartItems || [];

      setCartItems(items);

      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      setTotalPrice(total);

    } catch (err) {
      console.error("Cart Fetch Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!selectedLocation) {
      alert("Please select a delivery location.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/orders/`,
        {
          selected_location: selectedLocation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrderId(
        response.data.order_id || response.data.id
      );

      setConfirmOrderPanel(false);

      setLookingForAcceptancePanel(true);

    } catch (err) {
      console.error("Order Error:", err);

      alert(
        err.response?.data?.detail ||
        "Unable to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-t-3xl shadow-xl p-6">

      <button
        onClick={() => setConfirmOrderPanel(false)}
        className="absolute top-3 left-1/2 -translate-x-1/2"
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-500"></i>
      </button>

      <h2 className="text-2xl font-bold mt-8 mb-6">
        Confirm Order
      </h2>

      <img
        src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
        alt="Food"
        className="w-28 mx-auto mb-6"
      />

      <div className="space-y-4 max-h-64 overflow-y-auto">

        {cartItems.map((item) => (

          <div
            key={item.id}
            className="flex justify-between items-center border rounded-xl p-3"
          >

            <div className="flex items-center gap-3">

              <img
                src={item.image}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover"
              />

              <div>

                <h4 className="font-semibold">
                  {item.name}
                </h4>

                <p className="text-sm text-gray-500">
                  Qty : {item.quantity}
                </p>

              </div>

            </div>

            <h3 className="font-bold">
              ₹{(item.price * item.quantity).toFixed(2)}
            </h3>

          </div>

        ))}

      </div>

      <div className="border-t mt-6 pt-5 space-y-3">

        <div className="flex justify-between">

          <span className="font-semibold">
            Delivery Address
          </span>

          <span className="text-gray-600">
            {selectedLocation || "Not Selected"}
          </span>

        </div>

        <div className="flex justify-between text-2xl font-bold">

          <span>Total</span>

          <span>
            ₹{totalPrice.toFixed(2)}
          </span>

        </div>

      </div>

      <button
        disabled={loading}
        onClick={handleConfirmOrder}
        className="w-full mt-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-xl text-lg font-semibold"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

    </div>
  );
};

export default ConfirmOrder;
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CartPanel = ({
  cartItems = [],
  setCartPanelOpen,
  setLocationPanelOpen,
  onRemove = () => {},
}) => {
  const navigate = useNavigate();

  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/users/cart/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onRemove(itemId);

    } catch (error) {
      console.error("Remove Cart Item Error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="relative bg-white rounded-t-3xl shadow-xl p-5 w-full max-w-lg mx-auto">

      <button
        onClick={() => setCartPanelOpen(false)}
        className="absolute top-3 left-1/2 -translate-x-1/2"
      >
        <i className="ri-arrow-down-wide-line text-3xl text-gray-500"></i>
      </button>

      <h2 className="text-2xl font-bold mt-8 mb-6">
        Your Cart
      </h2>

      {cartItems.length === 0 ? (

        <div className="text-center py-12">

          <div className="text-6xl">
            🛒
          </div>

          <h3 className="text-xl font-semibold mt-4">
            Your Cart is Empty
          </h3>

          <p className="text-gray-500 mt-2">
            Add some delicious food to continue.
          </p>

        </div>

      ) : (

        <>
          <div className="space-y-4 max-h-96 overflow-y-auto">

            {cartItems.map((item) => (

              <div
                key={item.id}
                className="flex justify-between items-center border rounded-xl p-3 shadow-sm"
              >

                <div className="flex gap-3 items-center">

                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/60"
                    }
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  <div>

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Quantity : {item.quantity}
                    </p>

                    <p className="text-green-600 font-medium">
                      ₹{item.price}
                    </p>

                  </div>

                </div>

                <div className="flex flex-col items-end gap-3">

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="ri-delete-bin-6-line text-xl"></i>
                  </button>

                  <span className="font-bold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>

                </div>

              </div>

            ))}

          </div>

          <div className="border-t mt-6 pt-4">

            <div className="flex justify-between text-xl font-bold">

              <span>Total</span>

              <span>
                ₹{totalPrice.toFixed(2)}
              </span>

            </div>

            <button
              onClick={() => {
                setCartPanelOpen(false);
                setLocationPanelOpen(true);
              }}
              className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
            >
              Proceed To Checkout
            </button>

          </div>

        </>

      )}

    </div>
  );
};

export default CartPanel;
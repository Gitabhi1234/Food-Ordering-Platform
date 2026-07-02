import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPanel = ({
  cartItems = [],
  setCartPanelOpen,
  onRemove = () => {}  // default no-op function
}) => {
  const navigate = useNavigate();

  const handleRemoveItem = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Unauthorized");
      return;
    }
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/users/cart/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        // Update UI instantly by removing item from parent state
        onRemove(itemId);
      }
    } catch (error) {
      console.error("Error removing item:", error);
     
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="relative p-4 bg-white rounded shadow-md w-full max-w-md m-auto">
      <button
        onClick={() => setCartPanelOpen(false)}
        className="absolute top-3 text-center p-3 w-[93%] cursor-pointer focus:outline-none"
      >
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
      </button>

      <h3 className="font-semibold mb-5 text-2xl">Cart:</h3>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div
              key={item.id || index} // Use a unique key
              className="flex gap-2 h-14 justify-between mb-2 items-center rounded-xl p-3 border-2 border-black w-full"
            >
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleRemoveItem(item.itemId)}
                  className="focus:outline-none"
                  aria-label="Remove item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 2h4a1 1 0 011 1v2H9V3a1 1 0 011-1z"
                    />
                  </svg>
                </button>
                <h4 className="w-full">
                  {item.name} (x{item.quantity})
                </h4>
              </div>
              <h4 className="font-semibold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </h4>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <>
          <div className="mb-2">
            <h4 className="text-xl font-bold">
              Total: ₹{totalPrice.toFixed(2)}
            </h4>
          </div>

          <button
            onClick={() => navigate("/home")}
            className="flex h-14 mb-2 items-center justify-center rounded-xl p-3 w-full bg-blue-500 focus:outline-none"
          >
            <span className="font-semibold text-lg text-white">Proceed To Confirm</span>
          </button>
        </>
      )}
    </div>
  );
};

export default CartPanel;

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CartPanel from '../components/CartPanel';
import ConfirmOrder from '../components/ConfirmOrder';

const UserHome = () => {
  const [admins, setAdmins] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartPanelOpen, setCartPanelOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [confirmOrderPanel, setConfirmOrderPanel] = useState(false);
  const [acceptedOrderPanel, setAcceptedOrderPanel] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cartHotelId, setCartHotelId] = useState(null);
  const [warning, setWarning] = useState('');

  const cartPanelRef = useRef(null);

 useEffect(() => {
  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admins/all`
      );

      if (response.status === 200) {
        setAdmins(response.data.admins);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  fetchAdmins();
}, []);
useEffect(() => {
  const fetchCartItems = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/cart`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          const items = response.data.cartItems;
          setCartItems(items);
          setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));

          if (items.length > 0) {
            setCartHotelId(items[0].adminId);
          }
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    }
  };

  fetchCartItems();
}, []);

 const handleAddToCart = async (item, adminId) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  if (!item.available) return;

  if (cartHotelId && cartHotelId !== adminId) {
    setWarning('You can only order from one hotel at a time.');
    setTimeout(() => setWarning(''), 3000);
    return;
  }

  try {
    const payload = {
      item: {
        itemId: item._id,
        name: item.name,
        price: item.price,
        photo: item.photo || '',
        quantity: 1
      }
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/cart/add`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 201) {
      const items = response.data.cartItems;
      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
      setCartHotelId(adminId);
      setWarning('');
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

 const handleRemoveItemFromCart = (itemId) => {
  setCartItems((prev) => {
    const updated = prev.filter(item => item.itemId !== itemId);
    setCartCount(updated.reduce((sum, item) => sum + item.quantity, 0));
    if (updated.length === 0) setCartHotelId(null);
    return updated;
  });
};

const totalPrice = cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);
  return (
  <div className="min-h-screen flex flex-col bg-gray-50 relative pb-20">
    <div className="flex items-center justify-between px-4 pt-4">
      <img
        className="w-14 ml-2 mb-6"
        src="https://cdn-icons-png.flaticon.com/128/3063/3063822.png"
        alt="Logo"
      />
    </div>

    <div
      ref={cartPanelRef}
      className={`fixed z-10 bottom-0 px-3 py-10 bg-white w-full transition-transform duration-300 ${
        cartPanelOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <CartPanel
        cartItems={cartItems}
        setCartPanelOpen={setCartPanelOpen}
        onRemove={handleRemoveItemFromCart}
      />
    </div>

    <div className="p-4 flex-grow">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">
        Food Menu
      </h1>

      {warning && (
        <div className="bg-yellow-100 text-yellow-800 p-2 mb-4 rounded text-center text-sm">
          {warning}
        </div>
      )}

      {admins.filter(admin => admin.items?.length).length === 0 ? (
        <p className="text-center text-base">No admin items available.</p>
      ) : (
        admins
          .filter(admin => admin.items?.length)
          .map((admin) => (
            <div
              key={admin._id}
              className="mb-6 border border-gray-200 p-5 rounded-xl bg-white shadow-sm"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {admin.hotelname}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {admin.items.map((item) => (
                  <div
                    key={item._id}
                    className="border rounded-xl p-3 bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col shadow hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.photo || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-full h-28 object-cover rounded-md mb-2"
                    />

                    <h3 className="text-base font-medium mb-1">
                      {item.name}
                    </h3>

                    <p className="text-gray-700 text-sm mb-1">
                      ₹{item.price.toFixed(2)}
                    </p>

                    <p className="text-xs text-gray-500 mt-auto">
                      {item.available ? 'Available' : 'Unavailable'}
                    </p>

                    <button
                      onClick={() => handleAddToCart(item, admin._id)}
                      className={`mt-3 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                        item.available
                          ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!item.available}
                    >
                      {item.available ? '+ Add to Cart' : 'Unavailable'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>

    <footer className="fixed bottom-0 left-0 right-0 bg-white p-2 shadow-inner">
      <div className="flex relative justify-evenly items-center bg-zinc-300 rounded-lg p-2">
        <button
          onClick={() => setCartPanelOpen(true)}
          className="flex relative items-center space-x-2 bg-white border border-indigo-300 rounded-full px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-200"
        >
          <div className="bg-gray-100 rounded-full p-1 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 2.293a1 1 0 00.293 1.414l1.414 1.414a1 1 0 001.414-.293L12 13m0 0l3 6m-3-6L9 19"
              />
            </svg>

            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          <span>Cart</span>
        </button>

        <Link
          to="user-profile"
          className="flex items-center space-x-2 bg-white border border-blue-200 rounded-full px-4 py-2 text-sm text-blue-700 hover:bg-blue-200"
        >
          <div className="bg-gray-100 rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A8.966 8.966 0 0112 16c2.21 0 4.21.713 5.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          <span>Profile</span>
        </Link>
      </div>
    </footer>

    {confirmOrderPanel && (
      <ConfirmOrder
        setConfirmOrderPanel={setConfirmOrderPanel}
        setAcceptedOrderPanel={setAcceptedOrderPanel}
        selectedLocation={selectedLocation}
        totalPrice={totalPrice}
      />
    )}
  </div>
);
};

export default UserHome;
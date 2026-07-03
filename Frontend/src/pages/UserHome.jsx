import React, { useCallback, useEffect } from "react";

import { useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import CartPanel from "../components/CartPanel";
import ConfirmOrder from "../components/ConfirmOrder";
import LocationSearchPanel from "../components/LocationSearchPanel";

const UserHome = () => {
  const token = localStorage.getItem("token");

  const [isAISearch, setIsAISearch] = useState(false);

  const [menuItems, setMenuItems] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [cartItems, setCartItems] = useState([]);

  const [cartCount, setCartCount] = useState(0);

  const [cartPanelOpen, setCartPanelOpen] = useState(false);

  const [confirmOrderPanel, setConfirmOrderPanel] = useState(false);

  const [locationPanelOpen, setLocationPanelOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState("");

  const [cartRestaurantId, setCartRestaurantId] = useState(null);

  const [warning, setWarning] = useState("");

  const [search, setSearch] = useState("");

  
  const [category, setCategory] = useState(0);

  const cartPanelRef = useRef(null);

const filteredMenuItems = isAISearch
  ? menuItems
  : menuItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        category === 0 || item.category_id === category;

      return matchesSearch && matchesCategory;
    });

  const fetchMenu = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/menu/`);

      setMenuItems(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const items = res.data.cartItems || [];

      setCartItems(items);
      setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));

      if (items.length > 0) {
        setCartRestaurantId(items[0].admin_id);
      }
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchMenu(), fetchCart()]);
    };

    loadData();
  }, [fetchMenu, fetchCart]);

  const handleAddToCart = async (item) => {
    if (!token) {
      alert("Please login first.");
      return;
    }

    if (!item.available) {
      return;
    }

    if (cartRestaurantId && cartRestaurantId !== item.admin_id) {
      setWarning("You can order from only one restaurant at a time.");

      setTimeout(() => {
        setWarning("");
      }, 3000);

      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/cart/add`,
        {
          menu_item_id: item.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchCart();

      setCartRestaurantId(item.admin_id);

      setWarning("");
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const handleRemoveItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);

    setCartItems(updated);

    setCartCount(updated.reduce((sum, item) => sum + item.quantity, 0));

    if (updated.length === 0) {
      setCartRestaurantId(null);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

const handleSearch = async () => {
    const query = search.trim();

    if (!query) return;

    setSearchQuery(query); // Save the searched text
    setSearch("");         // Clear only the input

    const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ai/search`,
        { query }
    );

    setMenuItems(response.data);
    console.log("AI Search Results:", response.data);
    setIsAISearch(true);
};

  const categories = [
    { id: 0, name: "All" },
    { id: 1, name: "Pizza" },
    { id: 2, name: "Burger" },
    { id: 3, name: "Chinese" },
    { id: 4, name: "North Indian" },
    { id: 5, name: "South Indian" },
    { id: 6, name: "Dessert" },
    { id: 7, name: "Drinks" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-white shadow-md p-5 sticky top-0 z-20">
        <h1 className="text-3xl font-bold text-center">Food Ordering</h1>

        <div className="mt-5 flex gap-3">
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="flex-1 border rounded-xl p-3 outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-5 rounded-xl"
          >
            Search
          </button>

          <button className="bg-green-600 text-white px-5 rounded-xl">
            <i className="ri-map-pin-line"></i>
          </button>
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full ${
                category === cat.id
                  ? "bg-green-600 text-white"
                  : "bg-white border"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Warning */}

      {warning && (
        <div className="bg-yellow-100 text-yellow-700 p-3 text-center">
          {warning}
        </div>
      )}

      {/* Menu */}

      <div className="p-5">
        {filteredMenuItems.length === 0 ? (
          <h2 className="text-center text-gray-500">No Food Found</h2>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredMenuItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
              >
                <img
                  src={item.image || "https://via.placeholder.com/300"}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{item.name}</h3>

                    <span>₹{item.price}</span>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    {item.description}
                  </p>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    {item.is_vegetarian ? (
                      <span className="bg-green-100 text-green-700 px-2 rounded">
                        Veg
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 rounded">
                        Non Veg
                      </span>
                    )}

                    {item.is_spicy && (
                      <span className="bg-orange-100 text-orange-700 px-2 rounded">
                        🌶 Spicy
                      </span>
                    )}
                  </div>

                  <button
                    disabled={!item.available}
                    onClick={() => handleAddToCart(item)}
                    className={`w-full mt-4 py-2 rounded-xl ${
                      item.available
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {item.available ? "Add To Cart" : "Unavailable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Cart Panel */}

      <div
        ref={cartPanelRef}
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 z-50 ${
          cartPanelOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <CartPanel
          cartItems={cartItems}
          setCartPanelOpen={setCartPanelOpen}
          setLocationPanelOpen={setLocationPanelOpen}
          onRemove={handleRemoveItem}
        />
      </div>

      {/* Location Panel */}

      {locationPanelOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-40">
          <div className="bg-white rounded-t-3xl w-full p-5 max-h-[70vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Select Delivery Location</h2>

              <button onClick={() => setLocationPanelOpen(false)}>✕</button>
            </div>

            <LocationSearchPanel
              setConfirmOrderPanel={setConfirmOrderPanel}
              setPanelopen={setLocationPanelOpen}
              setSelectedLocation={setSelectedLocation}
              searchQuery={search}
            />
          </div>
        </div>
      )}

      {/* Confirm Order */}

      {confirmOrderPanel && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50">
          <div className="bg-white rounded-t-3xl w-full">
            <ConfirmOrder
              setConfirmOrderPanel={setConfirmOrderPanel}
              setLookingForAcceptancePanel={() => {}}
              setOrderId={() => {}}
              selectedLocation={selectedLocation}
              totalPrice={totalPrice}
              setTotalPrice={() => {}}
            />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}

      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
        <div className="flex justify-around">
          <button
            onClick={() => setCartPanelOpen(true)}
            className="relative flex flex-col items-center"
          >
            <i className="ri-shopping-cart-2-line text-2xl"></i>

            {cartCount > 0 && (
              <span className="absolute -top-2 right-0 bg-red-600 text-white text-xs rounded-full px-2">
                {cartCount}
              </span>
            )}

            <span className="text-sm">Cart</span>
          </button>

          <Link to="/user-profile" className="flex flex-col items-center">
            <i className="ri-user-3-line text-2xl"></i>

            <span className="text-sm">Profile</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default UserHome;

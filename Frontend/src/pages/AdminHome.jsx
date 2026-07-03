import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const AdminHome = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState([]);

  const [adminDetails, setAdminDetails] = useState({});

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");

  const [price, setPrice] = useState("");

  const [photo, setPhoto] = useState("");

  const [file, setFile] = useState(null);

  const [isVegetarian, setIsVegetarian] = useState(false);

  const [isSpicy, setIsSpicy] = useState(false);

  const [available, setAvailable] = useState(true);

  const [editingItem, setEditingItem] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },

    multiple: false,

    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];

      if (!selectedFile) return;

      setFile(selectedFile);

      setPhoto(URL.createObjectURL(selectedFile));
    },
  });

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [menuRes, profileRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/menu/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        axios.get(`${import.meta.env.VITE_BASE_URL}/admins/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setItems(menuRes.data.items || menuRes.data);

      setAdminDetails(profileRes.data.admin || profileRes.data);

    } catch (err) {
      console.error("Fetch Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
const submitHandler = async (e) => {
  e.preventDefault();

  const categoryMap = {
    Pizza: 1,
    Burger: 2,
    Biryani: 3,
    Chinese: 4,
    "South Indian": 5,
    "North Indian": 6,
    Dessert: 7,
    Drinks: 8,
  };

  let imageUrl = editingItem?.image || "";

  try {
    // Upload image to Cloudinary
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      imageUrl = uploadResponse.data.imageUrl;
    }

    const menuData = {
      name: name.trim(),
      description: description.trim(),
      category_id: categoryMap[category],
      price: Number(price),
      image: imageUrl,
      is_vegetarian: isVegetarian,
      is_spicy: isSpicy,
      available,
    };

    if (editingItem) {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/menu/${editingItem.id}`,
        menuData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      console.log(menuData);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/menu/`,
        menuData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    await fetchData();

    if (photo.startsWith("blob:")) {
      URL.revokeObjectURL(photo);
    }

    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setPhoto("");
    setFile(null);
    setIsVegetarian(false);
    setIsSpicy(false);
    setAvailable(true);
    setEditingItem(null);

  } catch (err) {
    console.log(err.response?.data || err);
  }
};
const editItem = (item) => {
  setEditingItem(item);

  setName(item.name);
  setDescription(item.description);

  setCategory(
    typeof item.category === "object"
      ? item.category.name
      : item.category
  );

  setPrice(item.price);
  setPhoto(item.image || "");

  setIsVegetarian(item.is_vegetarian);
  setIsSpicy(item.is_spicy);
  setAvailable(item.available);
};

const deleteItem = async (id) => {
  if (!window.confirm("Delete this menu item?")) return;

  try {
    await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/menu/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await fetchData();

  } catch (err) {
    console.error("Delete Error:", err);

    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/admin-login");
    }
  }
};

const toggleAvailability = async (item) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_BASE_URL}/menu/${item.id}/availability`,
      {
        available: !item.available,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await fetchData();

  } catch (err) {
    console.error("Availability Update Error:", err);

    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/admin-login");
    }
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/admin-login", { replace: true });
};

const handleBack = () => {
  navigate("/admin-home1");
};

const handleViewDashboard = () => {
  navigate("/admin-dashboard");
};

if (loading) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <h2 className="text-xl font-semibold">
        Loading Dashboard...
      </h2>
    </div>
  );
}
return (
  <div className="min-h-screen bg-gray-100 p-6">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <img
          src="https://cdn-icons-png.flaticon.com/128/3063/3063822.png"
          className="w-16"
          alt=""
        />

        <div>
          <h1 className="text-2xl font-bold">
            Welcome,{" "}
            {adminDetails.first_name || "Admin"}
          </h1>

          <p className="text-gray-500">
            {adminDetails.email}
          </p>

          {/* Optional */}
          {adminDetails.restaurant_name && (
            <p className="text-sm text-gray-500">
              {adminDetails.restaurant_name}
            </p>
          )}
        </div>
      </div>

      <div className="space-x-3">

        <button
          onClick={handleBack}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Orders
        </button>

        <button
          onClick={handleViewDashboard}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Dashboard
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>
    </div>

    {/* Add Menu */}

    <div className="bg-white rounded-xl shadow p-6 mb-8">

      <h2 className="text-2xl font-bold mb-5">

        {editingItem ? "Edit Menu Item" : "Add Menu Item"}

      </h2>

      <form
        onSubmit={submitHandler}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >

        <input
          required
          className="border rounded p-3"
          placeholder="Food Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          required
          className="border rounded p-3"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <textarea
          required
          rows="3"
          className="border rounded p-3 md:col-span-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          required
          className="border rounded p-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >

          <option value="">Choose Category</option>

          <option>Pizza</option>

          <option>Burger</option>

          <option>Biryani</option>

          <option>Chinese</option>

          <option>South Indian</option>

          <option>North Indian</option>

          <option>Dessert</option>

          <option>Drinks</option>

        </select>

        <div className="flex gap-6 items-center">

          <label className="flex gap-2">

            <input
              type="checkbox"
              checked={isVegetarian}
              onChange={(e) => setIsVegetarian(e.target.checked)}
            />

            Vegetarian

          </label>

          <label className="flex gap-2">

  <input
    type="checkbox"
    checked={isSpicy}
    onChange={(e) => setIsSpicy(e.target.checked)}
  />

  Spicy

</label>

<label className="flex gap-2">

  <input
    type="checkbox"
    checked={available}
    onChange={(e) => setAvailable(e.target.checked)}
  />

  Available

</label>

</div>

<div
  {...getRootProps()}
  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer md:col-span-2"
>

  <input {...getInputProps()} />

  <p>Drag & Drop Food Image</p>

</div>

{photo && (

  <img
    src={photo}
    className="h-24 rounded"
    alt="Food Preview"
  />

)}

<button
  type="submit"
  className="bg-green-600 hover:bg-green-700 text-white rounded py-3 md:col-span-2"
>

  {editingItem ? "Update Menu Item" : "Add Menu Item"}

</button>

</form>

</div>

{/* Inventory */}

<div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-2xl font-bold mb-5">

    Current Menu

  </h2>

  <div className="overflow-auto">

    <table className="w-full">

      <thead>

        <tr className="bg-gray-200">

          <th className="p-3">Image</th>

          <th>Name</th>

          <th>Price</th>

          <th>Veg</th>

          <th>Spicy</th>

          <th>Status</th>

          <th>Actions</th>

        </tr>

      </thead>

      <tbody>

        {items.map((item) => (

          <tr
            key={item.id}
            className="border-b text-center"
          >

            <td className="p-2">

              <img
                src={item.image}
                className="h-14 w-14 rounded mx-auto object-cover"
                alt={item.name}
              />

            </td>

            <td>{item.name}</td>

            

            <td>₹{item.price}</td>

            <td>

              {item.is_vegetarian
                ? "🟢 Veg"
                : "🔴 Non Veg"}

            </td>

            <td>

              {item.is_spicy
                ? "🌶"
                : "-"}

            </td>

            <td>

              {item.available
                ? "Available"
                : "Unavailable"}

            </td>

            <td className="space-x-2">

              <button
                onClick={() => editItem(item)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => toggleAvailability(item)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Toggle
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>

</div>
);

};

export default AdminHome;
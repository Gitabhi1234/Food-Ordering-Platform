import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminDataContext from "../context/AdminDataContext";
import axios from "axios";

const AdminSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [hotelname, setHotelName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { setAdmin } = useContext(AdminDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const adminData = {
      restaurant_name: hotelname.trim(),
      first_name: firstname.trim(),
      last_name: lastname.trim(),
      email: email.trim(),
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admins/register`,
        adminData,
      );

      if (response.status === 201) {
        const data = response.data;

        setAdmin(data.admin);

        localStorage.setItem("token", data.access_token || data.token);

        setSuccess("Account created successfully!");

        setTimeout(() => {
          navigate("/admin-home1");
        }, 1);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        "Registration failed. Please try again.";
      setError(msg);
    }

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setHotelName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-600 to-indigo-800 px-4 py-6 flex flex-col">
      <img
        className="w-14 ml-2 mb-6"
        src="https://cdn-icons-png.flaticon.com/128/3063/3063822.png"
        alt="Logo"
      />

      <div className="flex-1 flex items-start justify-center">
        <div className="bg-white border border-gray-200 shadow-md rounded-xl w-full max-w-sm md:max-w-md p-4 sm:p-6 md:p-8 h-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Admin Signup
          </h2>

          <form onSubmit={submitHandler}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <div className="flex gap-4 mb-4">
              <input
                required
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg bg-gray-100 px-4 py-2 border border-gray-300 w-1/2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                type="text"
                placeholder="First name"
              />

              <input
                required
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg bg-gray-100 px-4 py-2 border border-gray-300 w-1/2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                type="text"
                placeholder="Last name"
              />
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hotel Name
            </label>

            <input
              required
              value={hotelname}
              onChange={(e) => setHotelName(e.target.value)}
              className="mb-4 w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="text"
              placeholder="Your Hotel Name"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="email"
              placeholder="example@gmail.com"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="password"
              placeholder="Password"
            />

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm mb-2">{success}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition duration-200"
            >
              Create Admin Account
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/admin-login"
              className="underline text-emerald-700 hover:text-emerald-900"
            >
              Login here
            </Link>
          </p>

          <p className="text-[10px] mt-6 text-center text-gray-500 leading-tight">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service</span> apply.
          </p>

          <Link
            to="/login"
            className="mt-4 block bg-gray-800 hover:bg-gray-900 text-white text-center font-semibold px-4 py-2 w-full rounded-lg"
          >
            Sign in as User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;

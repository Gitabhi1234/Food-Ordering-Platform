import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminDataContext from "../context/AdminDataContext";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { setAdmin } = useContext(AdminDataContext);

  const submitHandler = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  const admin = {
    email: email.trim(),
    password,
  };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/admins/login`,
      admin
    );

    if (response.status === 200) {
      const data = response.data;

      setAdmin(data.admin || data);

      localStorage.setItem(
        "token",
        data.access_token || data.token
      );

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/admin-home1");
      }, 1000);
    }
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      "Login failed. Please check your credentials.";

    setError(msg);
  }

  setEmail("");
  setPassword("");
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-600 to-indigo-800 px-4 py-6 flex flex-col">
      <img
        className="w-14 ml-2 mb-6"
        src="https://cdn-icons-png.flaticon.com/128/3063/3063822.png"
        alt="Logo"
      />

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white border border-gray-200 shadow-md rounded-xl w-full max-w-md p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Admin Sign In
          </h2>

          <form onSubmit={submitHandler}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="example@gmail.com"
              className="mb-4 w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
              className="mb-4 w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm mb-2">{success}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-gray-600">
            Join as an Admin?{" "}
            <Link
              to="/admin-signup"
              className="underline text-emerald-700 hover:text-emerald-900"
            >
              Register as Admin
            </Link>
          </p>

          <Link
            to="/login"
            className="mt-6 block w-full text-center bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded-lg"
          >
            Sign in as User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

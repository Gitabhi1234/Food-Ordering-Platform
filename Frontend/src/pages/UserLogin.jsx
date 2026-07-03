import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserDataContext from "../context/UserDataContext";

const UserLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        {
          email,
          password,
        }
      );

      // Save JWT
      localStorage.setItem(
        "token",
        response.data.access_token || response.data.token
      );

      // Save user if backend returns it
      if (response.data.user) {
        setUser(response.data.user);
      }

      setSuccess("Login Successful!");

      setTimeout(() => {
        navigate("/user-home");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Invalid Email or Password"
      );
    }

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
            Sign In
          </h2>

          <form onSubmit={submitHandler}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {error && (
              <p className="text-red-600 text-sm mb-3">
                {error}
              </p>
            )}

            {success && (
              <p className="text-green-600 text-sm mb-3">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-5 text-gray-600">
            New here?{" "}
            <Link
              to="/signup"
              className="underline text-emerald-700 hover:text-emerald-900"
            >
              Create New Account
            </Link>
          </p>

          <Link
            to="/admin-login"
            className="mt-6 block w-full text-center bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded-lg"
          >
            Sign in as Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
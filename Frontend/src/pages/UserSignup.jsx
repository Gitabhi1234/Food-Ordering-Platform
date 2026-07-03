import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserDataContext from "../context/UserDataContext";

const UserSignup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess("Account created successfully!");

        if (response.data.user) {
          setUser(response.data.user);
        }

        if (response.data.access_token) {
          localStorage.setItem(
            "token",
            response.data.access_token
          );
        }

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Registration failed."
      );
    }

    setFirstName("");
    setLastName("");
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

        <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">

          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h2>

          <form onSubmit={submitHandler}>

            <label className="block text-sm font-medium mb-1">
              First Name
            </label>

            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg"
            />

            <label className="block text-sm font-medium mb-1">
              Last Name
            </label>

            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg"
            />

            <label className="block text-sm font-medium mb-1">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg"
            />

            <label className="block text-sm font-medium mb-1">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg"
            />

            {error && (
              <p className="text-red-600 mb-3">
                {error}
              </p>
            )}

            {success && (
              <p className="text-green-600 mb-3">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg"
            >
              Sign Up
            </button>

          </form>

          <p className="text-center mt-5">

            Already have an account?

            <Link
              to="/login"
              className="text-emerald-700 ml-1 underline"
            >
              Login
            </Link>

          </p>

          <Link
            to="/admin-login"
            className="block text-center mt-5 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900"
          >
            Sign in as Admin
          </Link>

        </div>

      </div>

    </div>
  );
};

export default UserSignup;
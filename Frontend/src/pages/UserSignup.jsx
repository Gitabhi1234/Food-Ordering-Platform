import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import UserDataContext from "../context/UserDataContext";

const UserSignup = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const newUser = {
      fullname: {
        firstname: firstName.trim(),
        lastname: lastName.trim()
      },
      email: email.trim(),
      password: password
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
      
      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setSuccess("Account created successfully!");
        setTimeout(() => navigate("/user-home"));
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    }

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

          <form onSubmit={submitHandler}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="flex gap-4 mb-4">
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-lg bg-gray-100 px-4 py-2 border border-gray-300 w-1/2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                type="text"
                placeholder="First name"
              />
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-lg bg-gray-100 px-4 py-2 border border-gray-300 w-1/2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
                type="text"
                placeholder="Last name"
              />
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg bg-gray-100 mb-4 px-4 py-2 border border-gray-300 w-full text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="email"
              placeholder="example@gmail.com"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg bg-gray-100 mb-4 px-4 py-2 border border-gray-300 w-full text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              type="password"
              placeholder="Password"
            />

            {error && (
              <p className="text-red-600 text-sm mb-2">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-sm mb-2">{success}</p>
            )}

            <button
              type="submit"
              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold mb-3 px-4 py-2 w-full text-base transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="underline text-emerald-700 hover:text-emerald-900">
              Login here
            </Link>
          </p>

          <p className="text-[10px] mt-6 text-center text-gray-500 leading-tight">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service</span> apply.
          </p>

         <Link
            to="/admin-login"
            className="mt-4 block bg-gray-800 hover:bg-gray-900 text-white text-center font-semibold px-4 py-2 w-full rounded-lg"
          >
            Sign in as Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;

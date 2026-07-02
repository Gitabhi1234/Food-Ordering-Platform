import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className="bg-cover bg-center inset-0 bg-[url(https://plus.unsplash.com/premium_photo-1683619761492-639240d29bb5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen w-full flex justify-between flex-col">
      <img
        className="w-16 ml-8 inset-0"
        src="https://cdn-icons-png.flaticon.com/128/3063/3063822.png"
        alt=""
      />
      <div className="bg-white pb-7 py-5 px-10">
        <h2 className="text-[40px] font-bold">Get Started </h2>
        <Link
          to="/login"
          className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5 "
        >
          continue
        </Link>
      </div>
    </div>
  );
};

export default Start

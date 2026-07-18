import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const change = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const signup = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/signup", values);

      alert(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0F172A]">
      <form
        onSubmit={signup}
        className="w-full max-w-md bg-[#1E293B] border border-gray-700 rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Create your account to continue
        </p>

        <label className="block text-gray-300 mb-2">
          Username
        </label>

        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={values.username}
          onChange={change}
          className="w-full bg-[#111827] text-white border border-gray-600 rounded-lg p-3 mb-5 outline-none focus:border-[#95BF47]"
        />

        <label className="block text-gray-300 mb-2">
          Email
        </label>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={values.email}
          onChange={change}
          className="w-full bg-[#111827] text-white border border-gray-600 rounded-lg p-3 mb-5 outline-none focus:border-[#95BF47]"
        />

        <label className="block text-gray-300 mb-2">
          Password
        </label>

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={values.password}
          onChange={change}
          className="w-full bg-[#111827] text-white border border-gray-600 rounded-lg p-3 mb-6 outline-none focus:border-[#95BF47]"
        />

        <button
          type="submit"
          className="w-full bg-[#95BF47] hover:bg-[#7DA83D] text-black font-semibold py-3 rounded-lg transition cursor-pointer"
        >
          Signup
        </button>

        <p className="text-center text-gray-400 mt-6">
          Already have an account <span> ? </span>
          <Link
            to="/login"
            className="text-[#95BF47] hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
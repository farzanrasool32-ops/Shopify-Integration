import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const change = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", values);

      alert(response.data.message);

      localStorage.setItem("isLoggedIn", "true");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0F172A]">
      <form
        onSubmit={login}
        className="w-full max-w-md bg-[#1E293B] border border-gray-700 rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Login to continue
        </p>

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
          Login
        </button>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account <span> ? </span>
          <Link
            to="/"
            className="text-[#95BF47] hover:underline font-semibold"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaLink, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("token");
  setTimeout(() => {
  navigate("/login");
  }, 1000);
};

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-gray-800 flex flex-col justify-between">

      <div>

        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            Dashboard
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Shopify Integration
          </p>
        </div>

        <div className="flex flex-col p-4 gap-3">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-[#95BF47] text-black font-semibold"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <FaHome />
            Dashboard
          </NavLink>

          <NavLink
            to="/integration"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-[#95BF47] text-black font-semibold"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <FaLink />
            Integration
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-[#95BF47] text-black font-semibold"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <FaBoxOpen />
            Orders
          </NavLink>

        </div>

      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
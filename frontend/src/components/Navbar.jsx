import React from "react";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const changeNavbar = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", changeNavbar);

    return () => {
      window.removeEventListener("scroll", changeNavbar);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-[5px] ${
        isScrolled
          ? "bg-[#111827]/95 backdrop-blur-md shadow-2xl"
          : "bg-[#111827]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#95BF47] flex items-center justify-center shadow-lg">
            <span className="text-black text-xl font-bold">S</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Shopify Integration
            </h1>

            <p className="text-gray-400 text-sm">MERN Dashboard</p>
          </div>
        </div>

        <div className="w-11 h-11 rounded-full bg-[#95BF47] flex items-center justify-center">
          <CgProfile size={30}/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

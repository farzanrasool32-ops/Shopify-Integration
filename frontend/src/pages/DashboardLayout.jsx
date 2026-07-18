import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-20">
        <Sidebar />

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;

import { Route, Routes } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Integration from "./pages/Integration";
import Orders from "./pages/Orders";

import ProtectedRoutes from "./components/ProtectedRoutes";

import DashboardLayout from "./pages/DashboardLayout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoutes>
            <DashboardLayout />
          </ProtectedRoutes>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/integration" element={<Integration />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
    </Routes>
  );
};

export default App;

import React from "react";
import { useEffect, useState } from "react";
import API from "../api/axios";

const Integration = () => {
  const [shop, setShop] = useState("");
  const [connected, setConnected] = useState(false);
  const [storeName, setStoreName] = useState("");

  const getStatus = async () => {
    try {
      const response = await API.get("/integration/status");

      setConnected(response.data.connected);

      if (response.data.connected) {
        setStoreName(response.data.shop);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStatus();
  }, []);

  const connectStore = async () => {
    try {
      const response = await API.post("/integration/connect", {
        shop,
      });

      window.location.href = response.data.url;
    } catch (error) {
      alert(error.response?.data?.message || "Connection Failed");
    }
  };

  const disconnectStore = async () => {
    try {
      const response = await API.post("/integration/disconnect");

      alert(response.data.message);

      setConnected(false);
      setStoreName("");
      setShop("");
    } catch (error) {
      alert(error.response?.data?.message || "Disconnect Failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh]">
      <div className="w-full max-w-2xl bg-[#1E293B] border border-gray-700 rounded-2xl shadow-xl p-10">

        <h1 className="text-3xl font-bold text-white text-center">
          Shopify Store Integration
        </h1>

        <p className="text-gray-400 text-center mt-3 mb-8">
          Connect your Shopify store to start syncing orders.
        </p>

        {connected ? (
          <div className="text-center">

            <h2 className="text-2xl font-bold text-green-400">
               Store Connected
            </h2>

            <p className="text-gray-300 mt-5">
              {storeName}
            </p>

            <button
              onClick={disconnectStore}
              className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition"
            >
              Disconnect Store
            </button>

          </div>
        ) : (
          <>
            <label className="block text-gray-300 mb-2 font-medium">
              Store Domain
            </label>

            <input
              type="text"
              placeholder="farzan-dev-store.myshopify.com"
              value={shop}
              onChange={(e) => setShop(e.target.value)}
              className="w-full bg-[#111827] border border-gray-600 text-white rounded-lg px-4 py-3 outline-none focus:border-[#95BF47]"
            />

            <button
              onClick={connectStore}
              className="w-full mt-6 bg-[#95BF47] hover:bg-[#7DA83D] text-black font-semibold py-3 rounded-lg transition"
            >
              Connect Store
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Integration;
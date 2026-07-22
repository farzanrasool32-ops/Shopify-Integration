import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const response = await API.get("/integration/orders");
      setOrders(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getOrders();
  }, []);

  const syncOrders = async () => {
    try {
      setLoading(true);

      await API.post("integration/orders/sync");

      await getOrders();

      alert("Orders synced successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to sync orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="bg-[#1E293B] rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Shopify Orders</h1>

          <div className="flex gap-3 ites-center">
            <button
              onClick={syncOrders}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Sync Orders
            </button>
          </div>

          <span className="bg-[#95BF47] text-black px-4 py-2 rounded-lg font-semibold">
            Total Orders : {orders.length}
          </span>
        </div>

        {loading ? (
          <h2 className="text-center text-white text-xl">Loading Orders...</h2>
        ) : orders.length === 0 ? (
          <h2 className="text-center text-white text-xl">No Orders Found</h2>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0F172A] text-gray-300">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Currency</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Fulfillment</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b border-gray-700 hover:bg-[#111827] transition"
                  >
                    <td className="p-4 text-white">{order.name}</td>

                    <td className="p-4 text-gray-300">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-gray-300">{order.currency}</td>

                    <td className="p-4 text-white font-semibold">
                      {order.total_price}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.financial_status === "paid"
                            ? "bg-green-600 text-white"
                            : "bg-yellow-500 text-black"
                        }`}
                      >
                        {order.financial_status}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.fulfillment_status === "fulfilled"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {order.fulfillment_status || "unfulfilled"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

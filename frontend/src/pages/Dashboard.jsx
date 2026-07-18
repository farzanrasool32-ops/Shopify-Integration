import { NavLink, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  function integration() {
    setTimeout(() => {
      navigate("/integration");
    }, 1000);
  }
  return (
    <div className="flex justify-center items-center min-h-[75vh]">
      <div className="bg-[#1E293B] border border-gray-700 rounded-2xl shadow-xl p-10 max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Welcome</h1>

        <p className="text-gray-300 text-lg leading-8">
          Welcome to your Shopify Integration Dashboard.
          <br />
          Connect your Shopify store, manage your integration, and view your
          orders using the sidebar.
        </p>

        <div>
          <button
            onClick={integration}
            className="w-full mt-6 bg-[#95BF47] hover:bg-[#7DA83D] text-black font-semibold py-3 rounded-lg transition"
          >
            Go to Integration
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

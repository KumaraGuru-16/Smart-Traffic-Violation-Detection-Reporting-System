import { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user data", err);
      }
    }

    // Fetch reports
    const fetchReports = async () => {
      try {
        const res = await API.get("/reports/my");
        setReports(res.data);

        // Calculate stats
        const statObj = {
          total: res.data.length,
          pending: res.data.filter(r => r.status === "pending").length,
          approved: res.data.filter(r => r.status === "approved").length,
          rejected: res.data.filter(r => r.status === "rejected").length,
        };
        setStats(statObj);
      } catch (err) {
        console.error("ERROR fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Extract location name from stored format "Name [lat,lon]"
  const getLocationName = (location) => {
    if (!location) return "Unknown";
    const match = location.match(/^(.*?)\s*\[.*\]$/);
    return match ? match[1].trim() : location;
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🚗 Traffic Violation System</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* User Profile Card */}
          {user && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Welcome back</p>
                  <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                  <p className="text-gray-600 mt-1">{user.email}</p>
                </div>
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
              </div>
            </div>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm">Total Reports</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</h3>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <p className="text-gray-600 text-sm">Pending</p>
              <h3 className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</h3>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm">Approved</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</h3>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <p className="text-gray-600 text-sm">Rejected</p>
              <h3 className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</h3>
            </div>
          </div>

          {/* Action Button */}
          <div className="mb-8">
            <a
              href="/report"
              className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition transform hover:scale-105"
            >
              ➕ Submit New Report
            </a>
          </div>

          {/* Reports Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">My Traffic Reports</h3>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-600 mt-4">Loading your reports...</p>
              </div>
            ) : reports && reports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((r) => (
                  <div
                    key={r._id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
                  >
                    {/* Image */}
                    {r.image && (
                      <div className="relative bg-gray-200 h-48 overflow-hidden">
                        <img
                          src={`http://localhost:5000/${r.image}`}
                          alt="report"
                          className="w-full h-full object-cover hover:scale-105 transition"
                        />
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-3 py-1 rounded-full text-white text-xs font-bold ${
                              r.status === "pending"
                                ? "bg-yellow-500"
                                : r.status === "approved"
                                ? "bg-green-500"
                                : r.status === "rejected"
                                ? "bg-red-500"
                                : "bg-gray-500"
                            }`}
                          >
                            {r.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                      <p className="text-gray-900 font-semibold mb-2">📍 {getLocationName(r.location)}</p>
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {r.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                        <span>Report #{r._id.substring(0, 8)}</span>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg mb-4">📋 No reports found</p>
                <p className="text-gray-500 mb-6">
                  Help keep roads safe by reporting traffic violations
                </p>
                <a
                  href="/report"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Submit Your First Report
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
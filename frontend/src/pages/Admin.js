import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Admin = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await API.get("/reports");
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
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Extract location name from stored format "Name [lat,lon]"
  const getLocationName = (location) => {
    if (!location) return "Unknown";
    const match = location.match(/^(.*?)\s*\[.*\]$/);
    return match ? match[1].trim() : location;
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await API.put(`/reports/${reportId}`, { status: newStatus });
      fetchReports();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredReports = filter === "all" ? reports : reports.filter(r => r.status === filter);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">👨‍💼 Admin Dashboard</h1>
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
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm">Total Reports</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</h3>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <p className="text-gray-600 text-sm">Pending Review</p>
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

          {/* Reports Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">All Reports</h3>
              <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      filter === status
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-gray-600 mt-4">Loading reports...</p>
              </div>
            ) : filteredReports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Image</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredReports.map((r) => (
                      <tr key={r._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-800">{r.user?.name || "Unknown"}</p>
                            <p className="text-gray-600 text-sm">{r.user?.email || ""}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">📍 {getLocationName(r.location)}</td>
                        <td className="px-6 py-4">
                          <p className="text-gray-700 truncate max-w-xs">{r.description}</p>
                        </td>
                        <td className="px-6 py-4">
                          {r.image && (
                            <a
                              href={`http://localhost:5000/${r.image}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline text-sm"
                            >
                              View Image
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-white text-xs font-bold ${
                              r.status === "pending"
                                ? "bg-yellow-500"
                                : r.status === "approved"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={r.status}
                            onChange={(e) => handleStatusUpdate(r._id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg">No reports found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
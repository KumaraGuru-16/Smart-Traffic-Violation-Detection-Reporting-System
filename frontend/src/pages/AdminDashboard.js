import { useEffect, useState } from "react";
import API from "../services/api";
import AdminMap from "../components/AdminMap";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // "map" or "cards"
  const [selectedReport, setSelectedReport] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReports();

    const interval = setInterval(() => {
      fetchReports();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get("/reports");
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to fetch reports");
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await API.put(`/reports/${id}`, { status });
      setReports((prevReports) =>
        prevReports.map((r) =>
          r._id === id ? { ...r, status } : r
        )
      );
      setSelectedReport((prev) => (prev ? { ...prev, status } : null));
    } catch (err) {
      console.error("Error updating report:", err);
      alert("Failed to update report status");
    } finally {
      setUpdating(false);
    }
  };

  const getLocationName = (location) => {
    if (!location) return "Unknown";
    const match = location.match(/^(.*?)\s*\[.*\]$/);
    return match ? match[1].trim() : location;
  };

  const getCoordinates = (location) => {
    if (!location) return null;
    const match = location.match(/\[(.*?)\]/);
    return match ? match[1] : null;
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const cardStyle = (color) => ({
    background: color === "blue" ? "#3b82f6" : color === "orange" ? "#f97316" : color === "green" ? "#22c55e" : "#ef4444",
    color: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  });

  const filteredReports = reports.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🚨 Traffic Violation Admin Panel
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Controls Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">
                Violation Reports
              </h2>
              <p className="text-gray-300">
                Total: <span className="font-bold text-blue-400">{reports.length}</span> reports
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex gap-3 bg-gray-800 rounded-xl shadow-lg p-2 backdrop-blur">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                  viewMode === "cards"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                📋 Card View
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-6 py-2 rounded-lg font-semibold transition duration-300 ${
                  viewMode === "map"
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                🗺️ Map View
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <div style={cardStyle("blue")}>
              <h2 style={{ fontSize: "2rem", margin: "0 0 8px 0" }}>
                {reports.length}
              </h2>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>Total Reports</p>
            </div>

            <div style={cardStyle("orange")}>
              <h2 style={{ fontSize: "2rem", margin: "0 0 8px 0" }}>
                {reports.filter((r) => r.status === "pending").length}
              </h2>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>Pending</p>
            </div>

            <div style={cardStyle("green")}>
              <h2 style={{ fontSize: "2rem", margin: "0 0 8px 0" }}>
                {reports.filter((r) => r.status === "approved").length}
              </h2>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>Approved</p>
            </div>

            <div style={cardStyle("red")}>
              <h2 style={{ fontSize: "2rem", margin: "0 0 8px 0" }}>
                {reports.filter((r) => r.status === "rejected").length}
              </h2>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>Rejected</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "all"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "pending"
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              Pending
            </button>

            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "approved"
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              Approved
            </button>

            <button
              onClick={() => setFilter("rejected")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "rejected"
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              Rejected
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-200 px-6 py-4 rounded-xl mb-8 backdrop-blur">
              ❌ {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-purple-500 border-t-blue-400 mb-4"></div>
              <p className="text-gray-300 text-lg">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-16 bg-gray-800 rounded-2xl backdrop-blur">
              <p className="text-gray-300 text-xl">📭 No reports found</p>
            </div>
          ) : viewMode === "map" ? (
            <AdminMap reports={reports} selectedReport={selectedReport} onSelectReport={setSelectedReport} />
          ) : (
            /* GRID CARDS LAYOUT */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredReports.map((r) => (
                <div
                  key={r._id}
                  onClick={() => setSelectedReport(r)}
                  className="group cursor-pointer h-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col backdrop-blur border-2" style={{ borderColor: selectedReport?._id === r._id ? "#3b82f6" : "#374151" }}>
                    {/* Image Container */}
                    <div className="relative overflow-hidden h-48 bg-gray-950">
                      <img
                        src={r.image}
                        alt="violation"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          👁️ View Details
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span
                          className={`inline-block px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                            r.status === "approved"
                              ? "bg-green-500 bg-opacity-90"
                              : r.status === "rejected"
                              ? "bg-red-500 bg-opacity-90"
                              : "bg-yellow-500 bg-opacity-90"
                          }`}
                        >
                          {r.status === "approved"
                            ? "✅ APPROVED"
                            : r.status === "rejected"
                            ? "❌ REJECTED"
                            : "⏳ PENDING"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 flex flex-col">
                      {/* Description */}
                      <h3 className="font-bold text-white line-clamp-2 mb-2 group-hover:text-blue-300 transition">
                        {r.description}
                      </h3>

                      {/* Location */}
                      <p className="text-sm text-gray-400 mb-3 truncate">
                        📍 {getLocationName(r.location)}
                      </p>

                      {/* Reporter */}
                      {r.user && (
                        <p className="text-xs text-gray-500 mb-4">
                          👤 {r.user.name}
                        </p>
                      )}

                      {/* Date */}
                      <p className="text-xs text-gray-600 mb-4 mt-auto">
                        📅 {new Date(r.createdAt).toLocaleDateString()}
                      </p>

                      {/* Click Hint */}
                      <div className="text-center text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Click to open details
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL POPUP */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-md w-full border border-gray-700 overflow-hidden animate-in fade-in scale-95 transition-all duration-300">

            {/* Close Button */}
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 z-10 bg-gray-700 hover:bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold transition duration-200"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image */}
              {selectedReport.image && (
                <img
                  src={selectedReport.image}
                  alt="violation"
                  className="w-full h-56 object-cover rounded-2xl mb-6 shadow-lg"
                />
              )}

              {/* Status Badge in Modal */}
              <div className="mb-4">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white ${
                    selectedReport.status === "approved"
                      ? "bg-green-500"
                      : selectedReport.status === "rejected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {selectedReport.status === "approved"
                    ? "✅ APPROVED"
                    : selectedReport.status === "rejected"
                    ? "❌ REJECTED"
                    : "⏳ PENDING"}
                </span>
              </div>

              {/* Description */}
              <h3 className="text-xl font-bold text-white mb-4">
                {selectedReport.description}
              </h3>

              {/* Location */}
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-1">📍 Location</p>
                <p className="text-white font-semibold">
                  {getLocationName(selectedReport.location)}
                </p>
                {getCoordinates(selectedReport.location) && (
                  <p className="text-xs text-blue-400 mt-1">
                    🧭 GPS: {getCoordinates(selectedReport.location)}
                  </p>
                )}
              </div>

              {/* Reporter Info */}
              {selectedReport.user && (
                <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">👤 Reported by</p>
                  <p className="text-white font-semibold">{selectedReport.user.name}</p>
                  <p className="text-sm text-gray-300">{selectedReport.user.email}</p>
                </div>
              )}

              {/* Date */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-1">📅 Reported on</p>
                <p className="text-white">
                  {new Date(selectedReport.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              {selectedReport.status === "pending" && (
                <div className="space-y-3">
                  <p className="text-sm text-blue-300 text-center font-semibold mb-3">
                    ⚡ Approve or reject this report
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        updateStatus(selectedReport._id, "approved")
                      }
                      disabled={updating}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg"
                    >
                      {updating ? "⏳ Updating..." : "✅ Approve"}
                    </button>
                    <button
                      onClick={() =>
                        updateStatus(selectedReport._id, "rejected")
                      }
                      disabled={updating}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg"
                    >
                      {updating ? "⏳ Updating..." : "❌ Reject"}
                    </button>
                  </div>
                </div>
              )}

              {selectedReport.status === "approved" && (
                <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-xl p-4 text-center">
                  <p className="text-green-400 font-semibold">
                    ✅ This report has been approved
                  </p>
                </div>
              )}

              {selectedReport.status === "rejected" && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-xl p-4 text-center">
                  <p className="text-red-400 font-semibold">
                    ❌ This report has been rejected
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

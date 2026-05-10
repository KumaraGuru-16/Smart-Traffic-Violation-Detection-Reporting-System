import { useState, useEffect } from "react";
import API from "../services/api";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await API.get("/reports/my");
      setReports(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reports");
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

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Reports</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="text-center p-6 bg-gray-100 rounded">
          <p className="text-gray-600">No reports submitted yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold">
                  Report #{report._id.substring(0, 8)}
                </h3>
                <span
                  className={`px-3 py-1 rounded text-white text-sm font-semibold ${
                    report.status === "pending"
                      ? "bg-yellow-500"
                      : report.status === "approved"
                      ? "bg-green-500"
                      : report.status === "rejected"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                >
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </div>

              {report.image && (
                <div className="mb-4">
                  <img
                    src={`http://localhost:5000/${report.image}`}
                    alt="Report"
                    className="max-w-full h-auto rounded"
                  />
                </div>
              )}

              <p className="text-gray-700 mb-2">
                <strong>📍 Location:</strong> {getLocationName(report.location)}
              </p>

              <p className="text-gray-700 mb-2">
                <strong>Description:</strong> {report.description}
              </p>

              <p className="text-gray-500 text-sm">
                <strong>Submitted:</strong>{" "}
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;

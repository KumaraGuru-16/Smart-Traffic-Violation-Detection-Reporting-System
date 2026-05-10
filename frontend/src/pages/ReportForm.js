import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const ReportForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    // Show preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    setGeoLoading(true);
    setError("");
    setMessage("");

    if (!navigator.geolocation) {
      setError("❌ Geolocation is not supported by your browser");
      setGeoLoading(false);
      return;
    }

    if (!formData.location.trim()) {
      setError("❌ Please enter a location name first (e.g., Times Square, Main St & 5th Ave)");
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordinates = `[${latitude.toFixed(6)},${longitude.toFixed(6)}]`;

        // Append coordinates to the location name
        const locationWithCoords = `${formData.location.trim()} ${coordinates}`;

        setFormData((prev) => ({
          ...prev,
          location: locationWithCoords,
        }));

        setMessage(`✅ GPS added: ${coordinates}`);
        setGeoLoading(false);
      },
      (err) => {
        let errorMsg = "Failed to get location";

        if (err.code === 1) {
          errorMsg = "❌ Permission denied. Please enable location access.";
        } else if (err.code === 2) {
          errorMsg = "❌ Position unavailable. Try again in an open area.";
        } else if (err.code === 3) {
          errorMsg = "❌ Location request timeout. Please try again.";
        }

        setError(errorMsg);
        setGeoLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!formData.image) {
      setError("Please select an image");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("image", formData.image);

      await API.post("/reports", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Report submitted successfully!");
      setFormData({ description: "", location: "", image: null });
      setImagePreview("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🚗 Traffic Violation System</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Report Traffic Violation</h2>
          <p className="text-gray-600 mb-8">Help keep our roads safe by reporting violations</p>

          {message && (
            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <span className="text-xl mr-3">✅</span>
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <span className="text-xl mr-3">❌</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                📝 Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the traffic violation in detail (e.g., vehicle ran red light, speeding, illegal parking, etc.)"
                rows="4"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                📍 Location Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Times Square, Main St & 5th Ave, Central Park"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={geoLoading}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold px-4 py-3 rounded-lg transition duration-200 whitespace-nowrap flex items-center gap-2"
                >
                  {geoLoading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Getting...
                    </>
                  ) : (
                    <>
                      📡 Add GPS
                    </>
                  )}
                </button>
              </div>
              {formData.location && (
                <p className="text-sm text-blue-600 mt-2 font-semibold">
                  📌 {formData.location}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2">
                📸 Upload Image
              </label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 transition">
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer block">
                  {imagePreview ? (
                    <div>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-40 object-cover rounded-lg mb-3"
                      />
                      <p className="text-blue-600 font-semibold">✓ Image selected</p>
                      <p className="text-gray-600 text-sm">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl mb-2">📤</p>
                      <p className="text-gray-700 font-semibold">Click to upload or drag and drop</p>
                      <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></span>
                  Submitting...
                </span>
              ) : (
                "✅ Submit Report"
              )}
            </button>
          </form>

          <p className="text-gray-600 text-sm text-center mt-6">
            All reports are reviewed by our team within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;

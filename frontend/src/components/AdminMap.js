import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom colored icons for different statuses
const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const yellowIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const blueIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 45],
  iconAnchor: [16, 45],
  popupAnchor: [1, -34],
});

const AdminMap = ({ reports, selectedReport, onSelectReport }) => {
  // Extract coordinates from "Name [lat,lon]" format
  const parseLocation = (location) => {
    if (!location) return null;
    const match = location.match(/\[(.*?)\]/);
    if (!match) return null;
    const coords = match[1].split(",").map((c) => parseFloat(c.trim()));
    return coords.length === 2 ? coords : null;
  };

  // Get location name from "Name [lat,lon]" format
  const getLocationName = (location) => {
    if (!location) return "Unknown";
    const match = location.match(/^(.*?)\s*\[.*\]$/);
    return match ? match[1].trim() : location;
  };

  // Filter reports with valid coordinates
  const reportsWithCoords = reports.filter((r) => parseLocation(r.location));

  if (reportsWithCoords.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
        📍 No reports with location data available
      </div>
    );
  }

  // Calculate center point (average of all coordinates)
  const coords = reportsWithCoords.map((r) => parseLocation(r.location));
  const centerLat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
  const centerLon = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

  return (
    <MapContainer
      center={[centerLat, centerLon]}
      zoom={12}
      style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}
      className="shadow-md"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {reportsWithCoords.map((report) => {
        const position = parseLocation(report.location);
        if (!position) return null;

        // Choose icon based on status or selection
        let icon;
        if (selectedReport?._id === report._id) {
          icon = blueIcon; // Highlight selected marker
        } else {
          icon =
            report.status === "approved"
              ? greenIcon
              : report.status === "rejected"
              ? redIcon
              : yellowIcon;
        }

        return (
          <Marker
            key={report._id}
            position={position}
            icon={icon}
            eventHandlers={{
              click: () => onSelectReport(report),
            }}
          >
            <Popup>
              <div style={{ width: "250px" }}>
                {/* Image */}
                {report.image && (
                  <img
                    src={report.image}
                    alt="violation"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      marginBottom: "10px",
                    }}
                  />
                )}

                {/* Description */}
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  {report.description}
                </p>

                {/* Location */}
                <p style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
                  <strong>📍 Location:</strong> {getLocationName(report.location)}
                </p>

                {/* Status */}
                <p style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        report.status === "approved"
                          ? "green"
                          : report.status === "rejected"
                          ? "red"
                          : "orange",
                    }}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </p>

                {/* Reporter */}
                {report.user && (
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    <strong>👤 Reporter:</strong> {report.user.name}
                  </p>
                )}

                {/* Click to view details */}
                <p
                  style={{
                    fontSize: "11px",
                    color: "#0066cc",
                    fontStyle: "italic",
                    marginTop: "8px",
                    cursor: "pointer",
                  }}
                >
                  ⬇️ Click marker to see full details
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default AdminMap;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReportForm from "./pages/ReportForm";
import MyReports from "./pages/MyReports";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute roleRequired="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/report"
          element={
            <PrivateRoute>
              <ReportForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-reports"
          element={
            <PrivateRoute>
              <MyReports />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
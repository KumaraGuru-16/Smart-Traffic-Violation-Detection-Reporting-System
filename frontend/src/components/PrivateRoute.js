import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
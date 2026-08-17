import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Enquiries from "../pages/Enquiries";
import Users from "../pages/Users";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/users" element={<Users />} />
          </Route>

          {/* Root and Catch-all Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;

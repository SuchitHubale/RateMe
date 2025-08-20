import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { UserDashboard } from "./pages/UserDashboard";
import { StoreOwnerDashboard } from "./pages/StoreOwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

// A helper function to check if the user is authenticated
function isAuthenticated() {
  const user = JSON.parse(localStorage.getItem("user"));
  // Return true if a user object exists and has a role
  return user && user.role;
}

// A component that handles the initial routing based on the user's role
function HomeRoute() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  // Check the user's role and navigate to the correct dashboard
  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/admin-dashboard" />;
    case "OWNER":
      return <Navigate to="/store-owner-dashboard" />;
    case "USER":
      return <Navigate to="/user-dashboard" />;
    default:
      // If the role is not recognized, redirect to login as a safety measure
      return <Navigate to="/login" />;
  }
}

function App() {
  return (
    <Router>
      <Routes>
        {/* The main route now uses HomeRoute to handle the redirection logic */}
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* These routes will be protected within their own components */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/store-owner-dashboard" element={<StoreOwnerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        {/* Optional: fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
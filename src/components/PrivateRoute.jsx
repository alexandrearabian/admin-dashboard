// components/PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/FirebaseConfig";
const ADMIN_EMAIL = import.meta.env.VITE_APP_ADMIN_EMAIL;

function PrivateRoute() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  // If user is not authenticated or is not the admin, redirect to login
  if (!user || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated and is the admin, allow access to the route
  return <Outlet />;
}

export default PrivateRoute;

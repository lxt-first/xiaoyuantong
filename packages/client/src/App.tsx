import { Routes, Route, Navigate } from "react-router-dom";
import type { FC, ReactNode } from "react";
import Home from "./pages/Home";
import ModuleList from "./pages/ModuleList";
import Detail from "./pages/Detail";
import Publish from "./pages/Publish";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Dashboard from "./pages/Dashboard";

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return <Navigate to="/login" replace />;
  try {
    const user = JSON.parse(userStr);
    if (user.role !== "admin") return <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/module/:type" element={<ModuleList />} />
      <Route path="/post/:type/:id" element={<Detail />} />
      <Route path="/publish" element={<ProtectedRoute><Publish /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/search" element={<Search />} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}
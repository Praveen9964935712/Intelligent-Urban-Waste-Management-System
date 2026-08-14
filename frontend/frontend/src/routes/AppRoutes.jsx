import { BrowserRouter, Routes, Route }
from "react-router-dom";

import Login
from "../pages/Login/Login";

import AdminDashboard
from "../pages/Admin/AdminDashboard";

import CitizenDashboard
from "../pages/Citizen/CitizenDashboard";

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/citizen/dashboard"
          element={<CitizenDashboard />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default AppRoutes;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Shows from "./pages/Shows";
import ShowDetails from "./pages/ShowDetails";
import AdminShowForm from "./pages/AdminShowForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserPage from "./pages/UserPage";
//import AdminPage from "./pages/AdminPage";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>

      {/* ✅ Navbar завжди видно */}
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route
          path="/shows"
          element={
            <ProtectedRoute>
              <Shows />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shows/:id"
          element={
            <ProtectedRoute>
              <ShowDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/shows/new"
          element={
            <ProtectedRoute role="admin">
              <AdminShowForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/shows/:id/edit"
          element={
            <ProtectedRoute role="admin">
              <AdminShowForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

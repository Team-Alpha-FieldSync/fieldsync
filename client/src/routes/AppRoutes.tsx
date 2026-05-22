import { Routes, Route } from "react-router-dom";

// pages
import Login from "../pages/auth/Login";
import NotFound from "../pages/common/NotFound";
import Unauthorized from "../pages/common/Unauthorized";


// layouts
import AdminLayout from "../layouts/AdminLayout";
import TechnicianLayout from "../layouts/TechnicianLayout";
import AuthLayout from "../layouts/AuthLayout";

// guards
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import TechnicianRoute from "./TechnicianRoute";

// admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import Jobs from "../pages/admin/Jobs";
import JobDetail from "../pages/admin/JobDetail";
import Technicians from "../pages/admin/Technicians";
import Clients from "../pages/admin/Clients";

// technician pages
import TechDashboard from "../pages/technician/Dashboard";
import TechJobDetail from "../pages/technician/JobDetail";


export default function AppRoutes(){
  return (
    <Routes>
      {/* AUTH */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
             

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }
      >

        <Route index element={<AdminDashboard />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="technicians" element={<Technicians />} />
        <Route path="clients" element={<Clients />} />
        
      </Route>

      {/* TECHNICIAN */}
      <Route
        path="/technician"
        element={
          <ProtectedRoute>
            <TechnicianRoute>
              <TechnicianLayout />
            </TechnicianRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<TechDashboard />} />
        <Route path="jobs/:id" element={<TechJobDetail />} />
      </Route>

      {/* COMMON */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
     
    </Routes>
  );
}
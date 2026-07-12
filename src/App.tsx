import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Features from "./pages/public/Features";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import ChatTutor from "./pages/student/ChatTutor";
import Progress from "./pages/student/Progress";
import Roadmap from "./pages/student/Roadmap";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentManagement from "./pages/admin/StudentManagement";

function App() {
  return (
    <Routes>
      {/* Public marketing site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/chat-tutor" element={<ChatTutor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />

           {/* Authenticated app shell */}
      {/* <Route element={<ProtectedRoute />}> */}
      <Route>
        <Route element={<DashboardLayout />}>
          <Route path="/profile" element={<Profile />} />

          {/* Student-only */}
          {/* <Route element={<ProtectedRoute allowedRoles={["student"]} />}> */}
          <Route>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/roadmap" element={<Roadmap />} />
            <Route path="/student/chat" element={<ChatTutor />} />
            <Route path="/student/progress" element={<Progress />} />
          </Route>

          {/* Admin-only */}
          {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}> */}
          <Route >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<StudentManagement />} />
          </Route>
        </Route>
      </Route>


      


       <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;

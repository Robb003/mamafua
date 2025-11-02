import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import MamafuaDashboard from "./pages/Mamafua/Dashboard";
import Jobs from "./pages/Mamafua/Jobs";
import MamafuaReview from "./pages/Mamafua/MamafuaReview";
import Services from "./pages/Mamafua/Services";
import CustomerDashboard from "./pages/customer/Dashboard";
import Booking from "./pages/customer/Bookings";
import Review from "./pages/customer/Reviews";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./Context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar visible on all pages */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/booking"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review/:mamafuaId/:bookingId"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Review />
              </ProtectedRoute>
            }
          />

          
          <Route
            path="/mamafua/dashboard"
            element={
              <ProtectedRoute allowedRoles={["mamafua"]}>
                <MamafuaDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mamafua/jobs"
            element={
              <ProtectedRoute allowedRoles={["mamafua"]}>
                <Jobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mamafua/reviews"
            element={
              <ProtectedRoute allowedRoles={["mamafua"]}>
                <MamafuaReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mamafua/services"
            element={
              <ProtectedRoute allowedRoles={["mamafua"]}>
                <Services />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

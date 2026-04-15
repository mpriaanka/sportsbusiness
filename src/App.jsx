import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ClientDashboard from './pages/ClientDashboard';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingHistory from './pages/BookingHistory';
import ManagerDashboard, { ManagerSchedules, ManagerBookings, ManagerNotifications, ManagerAnalytics } from './pages/ManagerDashboard';
import AdminDashboard, { AdminSports, AdminCourts, AdminEquipment, AdminManagers, AdminBookings, AdminAnalytics } from './pages/AdminDashboard';

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Client Routes */}
      <Route path="/dashboard" element={<ProtectedRoute roles={['client']}><ClientDashboard /></ProtectedRoute>} />
      <Route path="/book/:sportId" element={<ProtectedRoute roles={['client']}><BookingPage /></ProtectedRoute>} />
      <Route path="/payment/:bookingId" element={<ProtectedRoute roles={['client']}><PaymentPage /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute roles={['client']}><BookingHistory /></ProtectedRoute>} />

      {/* Manager Routes */}
      <Route path="/manager" element={<ProtectedRoute roles={['manager']}><ManagerDashboard /></ProtectedRoute>}>
        <Route path="bookings" element={<ManagerBookings />} />
        <Route path="schedules" element={<ManagerSchedules />} />
        <Route path="notifications" element={<ManagerNotifications />} />
        <Route path="analytics" element={<ManagerAnalytics />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}>
        <Route path="sports" element={<AdminSports />} />
        <Route path="courts" element={<AdminCourts />} />
        <Route path="equipment" element={<AdminEquipment />} />
        <Route path="managers" element={<AdminManagers />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Navbar />
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a3e',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

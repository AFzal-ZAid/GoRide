import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RideProvider } from './contexts/RideContext';
import { SocketProvider } from './contexts/SocketContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RiderDashboard from './pages/rider/RiderDashboard';
import BookRidePage from './pages/rider/BookRidePage';
import RideHistoryPage from './pages/rider/RideHistoryPage';
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverRidesPage from './pages/driver/DriverRidesPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RideProvider>
          <SocketProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Rider Routes */}
              <Route 
                path="/rider/dashboard" 
                element={
                  <ProtectedRoute userType="rider">
                    <RiderDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rider/book" 
                element={
                  <ProtectedRoute userType="rider">
                    <BookRidePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/rider/history" 
                element={
                  <ProtectedRoute userType="rider">
                    <RideHistoryPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Driver Routes */}
              <Route 
                path="/driver/dashboard" 
                element={
                  <ProtectedRoute userType="driver">
                    <DriverDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/driver/rides" 
                element={
                  <ProtectedRoute userType="driver">
                    <DriverRidesPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Shared Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute userType="any">
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback Routes */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </SocketProvider>
        </RideProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
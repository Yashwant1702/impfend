import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Clubs from './pages/Clubs';
import ClubDetails from './pages/ClubDetails';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import Gamification from './pages/Gamification';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';

// Styles
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/clubs"
              element={
                <ProtectedRoute>
                  <Clubs />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/clubs/:id"
              element={
                <ProtectedRoute>
                  <ClubDetails />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetails />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/gamification"
              element={
                <ProtectedRoute>
                  <Gamification />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

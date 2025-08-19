
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './zustand_store/auth_store';
import Layout from './Webpage/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PracticeInterview from './Webpage/PracticeInterview';
import QuestionsDisplay from './Webpage/QuestionsDisplay';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './components/common/NotFound';

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Layout>
                  <Navigate to="/practice" replace />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/practice" 
            element={
              <ProtectedRoute>
                <Layout>
                  <PracticeInterview />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/practice/questions" 
            element={
              <ProtectedRoute>
                <Layout>
                  <QuestionsDisplay />
                </Layout>
              </ProtectedRoute>
            } 
          />
          {/* 404 - Catch all undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

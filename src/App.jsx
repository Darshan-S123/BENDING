import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Dashboard from './pages/Dashboard.jsx';
import AddLoan from './pages/AddLoan.jsx';
import MonthlySettlement from './pages/MonthlySettlement.jsx';
import Reports from './pages/Reports.jsx';
import OverdueManagement from './pages/OverdueManagement.jsx';
import CustomerOverview from './pages/CustomerOverview.jsx';
import Login from './pages/Login.jsx';
import Settings from './pages/Settings.jsx';
import Ledger from './pages/Ledger.jsx';
import Drafts from './pages/Drafts.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './layout/MainLayout.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

const AnimatedRoutes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
        <Route path="/loans" element={<ProtectedRoute><MainLayout><AddLoan /></MainLayout></ProtectedRoute>} />
        <Route path="/drafts" element={<ProtectedRoute><MainLayout><Drafts /></MainLayout></ProtectedRoute>} />
        <Route path="/settlement" element={<ProtectedRoute><MainLayout><MonthlySettlement /></MainLayout></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><MainLayout><Reports /></MainLayout></ProtectedRoute>} />
        <Route path="/ledger" element={<ProtectedRoute><MainLayout><Ledger /></MainLayout></ProtectedRoute>} />

        {/* Supporting Routes */}
        <Route path="/customers" element={<ProtectedRoute><MainLayout><CustomerOverview /></MainLayout></ProtectedRoute>} />
        <Route path="/overdue" element={<ProtectedRoute><MainLayout><OverdueManagement /></MainLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;

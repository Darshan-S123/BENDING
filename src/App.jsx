import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserPlus, CalendarClock, FileText, AlertTriangle, Bell, Users, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard.jsx';
import AddLoan from './pages/AddLoan.jsx';
import MonthlySettlement from './pages/MonthlySettlement.jsx';
import Reports from './pages/Reports.jsx';
import OverdueManagement from './pages/OverdueManagement.jsx';
import CustomerOverview from './pages/CustomerOverview.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { getLoans } from './utils/loanStore.js';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
};

const AppLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      {isAuthenticated && <Sidebar />}
      <div className="content-wrapper" style={{ marginLeft: isAuthenticated ? '280px' : '0' }}>
        {isAuthenticated && <Header />}
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add-loan" element={<ProtectedRoute><AddLoan /></ProtectedRoute>} />
            <Route path="/settlement" element={<ProtectedRoute><MonthlySettlement /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/overdue" element={<ProtectedRoute><OverdueManagement /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><CustomerOverview /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .app-container {
          display: flex;
          min-height: 100vh;
          background: #020617;
          color: #f8fafc;
        }
        .content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .sidebar {
          width: 280px;
          background: #020617;
          border-right: 1px solid rgba(255,255,255,0.1);
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 100;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--accent);
          margin-bottom: 3.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          letter-spacing: -0.02em;
        }
        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.25rem;
          color: #94a3b8;
          text-decoration: none;
          border-radius: 0.75rem;
          font-weight: 500;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-item:hover {
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.03);
        }
        .nav-item.active {
          background: var(--accent);
          color: #000;
          box-shadow: 0 4px 12px rgba(202, 138, 4, 0.2);
        }
        .header {
          height: 80px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          background: rgba(2, 6, 23, 0.8);
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 90;
        }
        .main-content {
          flex: 1;
          padding: 2.5rem;
        }
        .notification-bell {
          position: relative;
          cursor: pointer;
          color: #94a3b8;
        }
        .notification-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid #020617;
        }
      `}</style>
    </div>
  );
};

const Header = () => {
  const [reminders, setReminders] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    try {
      const loans = getLoans();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const monthStr = nextMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      const count = loans.filter(l => l.settlementMonth === monthStr && l.status === 'Pending').length;
      setReminders(count);

      // Auto popup logic
      const today = new Date();
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      if (lastDay.getDate() - today.getDate() <= 5 && count > 0) {
        setShowPopup(true);
      }
    } catch (err) {
      console.error('Header Error:', err);
    }
  }, []);

  return (
    <header className="header">
      <div className="notification-bell" onClick={() => setShowPopup(!showPopup)}>
        <Bell size={24} />
        {reminders > 0 && <span className="notification-dot"></span>}
      </div>
      {showPopup && (
        <div className="glass" style={{ position: 'absolute', top: 70, right: 32, padding: '1rem', borderRadius: '0.75rem', width: 280, zIndex: 200 }}>
          <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Monthly Reminder</h4>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            {reminders} members must settle in the next month. Generate the PDF report soon.
          </p>
          <button onClick={() => setShowPopup(false)} style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Dismiss</button>
        </div>
      )}
    </header>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="logo">
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--accent), #fbbf24)', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(202, 138, 4, 0.3)' }}></div>
        SS FINANCE
      </div>
      <nav className="nav-links">
        <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}><LayoutDashboard size={20} /> Dashboard</Link>
        <Link to="/add-loan" className={`nav-item ${isActive('/add-loan') ? 'active' : ''}`}><UserPlus size={20} /> Add Loan</Link>
        <Link to="/settlement" className={`nav-item ${isActive('/settlement') ? 'active' : ''}`}><CalendarClock size={20} /> Monthly Settlement</Link>
        <Link to="/reports" className={`nav-item ${isActive('/reports') ? 'active' : ''}`}><FileText size={20} /> Reports</Link>
        <Link to="/customers" className={`nav-item ${isActive('/customers') ? 'active' : ''}`}><Users size={20} /> Customer Overview</Link>
        <Link to="/overdue" className={`nav-item ${isActive('/overdue') ? 'active' : ''}`}><AlertTriangle size={20} /> Overdue</Link>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <button onClick={logout} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default App;

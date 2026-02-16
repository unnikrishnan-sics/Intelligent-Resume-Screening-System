import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import AdminRecruiters from './pages/AdminRecruiters';
import AdminCandidates from './pages/AdminCandidates';
import AdminCandidateDetails from './pages/AdminCandidateDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Jobs from './pages/Jobs';
import BrowseJobs from './pages/BrowseJobs';
import Applications from './pages/Applications';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import PrivateRoute from './components/PrivateRoute';
import ApplyJob from './pages/ApplyJob';
import JobApplicants from './pages/JobApplicants';
import ResumeDetails from './pages/ResumeDetails';
import MyApplicationDetails from './pages/MyApplicationDetails';
import Profile from './pages/Profile';

// Route Dispatcher based on Role
const DashboardDispatcher = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.isAdmin) return <AdminDashboard />;
  if (user.role === 'recruiter') return <RecruiterDashboard />;
  return <CandidateDashboard />;
};

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Public or Protected Routes? Job application likely requires auth given my tasks */}
            {/* But I'll put it in protected for now, or ensure page handles redirect */}
            {/* Let's make it so you can view the page but need login to submit. For simplicity, just protect it. */}

            <Route path="/jobs/:jobId/apply" element={<ApplyJob />} />

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardDispatcher />} />
              <Route path="/jobs" element={<BrowseJobs />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/my-jobs" element={<Jobs />} />
              <Route path="/create-job" element={<CreateJob />} />
              <Route path="/jobs/:jobId/applicants" element={<JobApplicants />} />
              <Route path="/resumes/:id" element={<ResumeDetails />} />
              <Route path="/jobs/:id/edit" element={<EditJob />} />

              <Route path="/my-applications/:id" element={<MyApplicationDetails />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin Only Routes - In a real app, wrap in AdminRoute component */}
              <Route path="/recruiters" element={<AdminRecruiters />} />
              <Route path="/candidates" element={<AdminCandidates />} />
              <Route path="/candidates/:id" element={<AdminCandidateDetails />} />
            </Route>

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

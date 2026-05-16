import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { PageTransitionProvider } from './context/PageTransitionContext';
import PageTransition from './components/PageTransition';
import BadgeUnlockToast from './components/profile/BadgeUnlockToast';
import CustomCursor from './components/CustomCursor';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Practice from './pages/Practice';
import Tests from './pages/Tests';
import QuizPage from './pages/QuizPage';
import Classes from './pages/Classes';
import VideoWatch from './pages/VideoWatch';
import Internships from './pages/Internships';
import Profile from './pages/Profile';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import VerifyResetOTP from './pages/VerifyResetOTP';
import ResetPassword from './pages/ResetPassword';
import ForgotEmail from './pages/ForgotEmail';
import VerifyEmailRecoveryOTP from './pages/VerifyEmailRecoveryOTP';

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <PageTransitionProvider>
          <CustomCursor />
          <PageTransition />
          <BadgeUnlockToast />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-email" element={<ForgotEmail />} />
            <Route path="/verify-email-recovery" element={<VerifyEmailRecoveryOTP />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subject/:slug" element={<SubjectDetail />} />

            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/tests/:testId" element={<QuizPage />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/classes/watch/:videoId" element={<VideoWatch />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransitionProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

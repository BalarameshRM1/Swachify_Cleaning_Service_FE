import { useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import ForgotPassword from '../../pages/forgotpassword/ForgotPassword';
import Landing from '../../pages/landing/landingpage';
import PrivacyPolicy from '../../pages/privacy/PrivacyPolicy';
import TermsOfService from '../../pages/terms/TermsOfService';
import { getUserDetails } from '../../utils/helpers/storage';
import RefundPolicy from '../../pages/refund/RefundPolicy';

export const NonSecureRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userData: any = getUserDetails('user');
    const currentPath = window.location.pathname;

    if (userData && !currentPath.startsWith('/app')) {
      navigate('/app/dashboard');
    } else if (!userData && (currentPath === '/' || currentPath === '')) {
      navigate('/landing');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/refund" element={<RefundPolicy />} />
    </Routes>
  );
};
 
import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "../../pages/login/Login";
import { getUserDetails } from "../../utils/helpers/storage"
import { useNavigate, useLocation } from "react-router-dom";
import Register from '../../pages/register/Register';
import ForgotPassword from '../../pages/forgotpassword/ForgotPassword';
import Dashboard from '../../pages/dashboard/Dashboard';


export const NonSecureRoutes = () => {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        let userData: any = getUserDetails()

        if (userData == null && !location.pathname.includes('/app')) {
            navigate('/app/dashboard')
        } else {
            navigate('/login')
        }

    }, [])

    return <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />

    </Routes>
}
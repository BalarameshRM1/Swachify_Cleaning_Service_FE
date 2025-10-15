import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "../../pages/login/Login";
import { getUserDetails } from "../../utils/helpers/storage"
import { useNavigate } from "react-router-dom";
import Register from '../../pages/register/Register';
import ForgotPassword from '../../pages/forgotpassword/ForgotPassword';
import Dashboard from '../../pages/dashboard/Dashboard';


export const NonSecureRoutes = () => {
    const navigate = useNavigate()
    
        useEffect(()=>{
            let userData:any = getUserDetails()
    
            if(userData == null){
                navigate('/app/settings')
            }else{
                navigate('/login')
            }
    
        },[])

    return <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/forgotpassword" element={<ForgotPassword />} />
         <Route path="/dashboard" element={<Dashboard />} />
         
    </Routes>
}
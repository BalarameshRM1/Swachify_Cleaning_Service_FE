import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
// import Login from "../../pages/login/Login";
import { useNavigate} from "react-router-dom";
// import Register from '../../pages/register/Register';
import ForgotPassword from '../../pages/forgotpassword/ForgotPassword';
// import Dashboard from '../../pages/dashboard/Dashboard';
import Landing from '../../pages/landing/landingpage';
import { getUserDetails } from '../../utils/helpers/storage';


export const NonSecureRoutes = () => {
    const navigate = useNavigate()
    
        useEffect(()=>{

            let userData:any = getUserDetails('user')
    
            if(userData != null){
                navigate('/app/dashboard')
            }else{
                navigate('/landing')
            }
        },[])

    return <Routes>
        <Route path="/landing" element={<Landing />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        {/* <Route path='/dashboard' element={<Dashboard/>} /> */}
        {/* <Route path="/services" element={<Services />} /> */}
         
    </Routes>
}
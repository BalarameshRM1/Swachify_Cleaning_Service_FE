import { Routes, Route } from "react-router-dom";
import Dashboard from "../../pages/dashboard/Dashboard";
import LayoutComponent from "../../components/Layout/Layout";
import Settings from "../../pages/settings/settings";
import Register from "../../pages/register/Register";
import Employees from "../../pages/employees/Employees";

export const SecureRoutes = () => { 
    
    return <Routes>
        <Route path="/" element={<LayoutComponent />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            
            <Route path="settings" element={<Settings />} />
        </Route>
    </Routes>
}
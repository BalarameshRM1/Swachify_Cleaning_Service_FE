import { Routes, Route } from "react-router-dom";
import Dashboard from "../../pages/dashboard/Dashboard";
import LayoutComponent from "../../components/Layout/Layout";
import Settings from "../../pages/settings/settings";

export const SecureRoutes = () => {
    
    return <Routes>
        <Route path="/" element={<LayoutComponent />}>
            <Route path="dashboard" element={<Dashboard />} />   
            <Route path="settings" element={<Settings />} />
            {/* <Route path="services" element={<Services />} /> */}
        </Route>
    </Routes>
}
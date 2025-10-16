import { Routes, Route } from "react-router-dom";
import Dashboard from "../../pages/dashboard/Dashboard";
import LayoutComponent from "../../components/Layout/Layout";
import Settings from "../../pages/settings/settings";
import Services from "../../pages/services/Services";
import Tickets from "../../pages/tickets/Tickets";
import Bookings from "../../pages/bookings/Bookings";



export const SecureRoutes = () => {
    
    return <Routes>
        <Route path="/" element={<LayoutComponent />}>
            <Route path="dashboard" element={<Dashboard />} />   
            <Route path="settings" element={<Settings />} />
            <Route path="services" element={<Services />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="bookings" element={<Bookings />} />


        </Route>
    </Routes>
}
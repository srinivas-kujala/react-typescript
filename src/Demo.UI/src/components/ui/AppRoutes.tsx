import { Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import Privacy from "../../pages/Privacy";
import Weather from "../../pages/Weather";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Weather" element={<Weather />} />
            <Route path="/Privacy" element={<Privacy />} />
        </Routes>
    );
};
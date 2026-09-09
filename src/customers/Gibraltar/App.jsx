import { Routes, Route } from "react-router-dom";

import LauncherLayout from "./layouts/LauncherLayout";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./Dashboard";
import LiveView from "../../components/LiveView/LiveView";
import ReportPage from "../../components/Reports/ReportPage";
import { AuthProvider } from "../../modules/Login/context/AuthContext";
import LandingPage from "./LandingPage";

function AppRoutes() {
    return (
        <Routes>
            <Route element={<LauncherLayout/>}>
                <Route
                    path="/"
                    element={<LandingPage />}
                />
            </Route>

            {/* Application */}
            <Route element={<MainLayout/>}>
                <Route
                    path="/dashboard"
                    element={<Dashboard/>}
                />

                <Route
                    path="/live-monitoring"
                    element={<LiveView/>}
                />

                <Route
                    path="/reports"
                    element={<ReportPage/>}
                />

            </Route>
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );

}

export default App;

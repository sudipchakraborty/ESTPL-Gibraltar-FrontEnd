import { Navigate, Routes, Route } from "react-router-dom";

import LauncherLayout from "./layouts/LauncherLayout";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./Dashboard";
import IndustrialWorkspace from "../../components/IndustrialWorkspace/IndustrialWorkspace";
import ReportPage from "../../components/Reports/ReportPage";
import { AuthProvider } from "../../modules/Login/context/AuthContext";

function AppRoutes() {
    return (
        <Routes>
            <Route element={<LauncherLayout/>}>
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
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
                    element={<IndustrialWorkspace/>}
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

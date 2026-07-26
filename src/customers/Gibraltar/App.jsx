import { Routes, Route, useNavigate } from "react-router-dom";

import LauncherLayout from "./layouts/LauncherLayout";
import MainLayout from "./layouts/MainLayout";

import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import IndustrialWorkspace from "../../components/IndustrialWorkspace/IndustrialWorkspace";
import ReportPage from "../../components/Reports/ReportPage";
import ProtectedRoute from "../../components/Auth/ProtectedRoute";
import LoginModal from "../../modules/Login/LoginModal";
import { AuthProvider } from "../../modules/Login/context/AuthContext";
import { useAuth } from "../../modules/Login/hooks/useAuth";

function AuthenticatedRoutes() {
    const { isLoggedIn, login } = useAuth();
    const navigate = useNavigate();

    if (!isLoggedIn) {
        return (
            <LoginModal
                open
                onClose={() => {}}
                onLogin={() => {
                    login();
                    navigate("/", { replace: true });
                }}
            />
        );
    }

    return (

        <Routes>

            {/* Landing */}

            <Route element={<LauncherLayout/>}>

                <Route
                    path="/"
                    element={<LandingPage/>}
                />

            </Route>

            {/* Application */}

            <Route element={<MainLayout/>}>

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }
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
            <AuthenticatedRoutes />
        </AuthProvider>
    );

}

export default App;

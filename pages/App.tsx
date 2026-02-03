import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dashboard } from './Dashboard';
import { Login } from '../components/Login';
import { LandingPage } from '../components/LandingPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { session, loading } = useAuth();

    if (loading) return <div className="flex h-screen items-center justify-center bg-[#f8fafc]">Carregando...</div>;

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const LoginWrapper = () => {
    const { session, loading } = useAuth();

    if (loading) return <div className="flex h-screen items-center justify-center bg-[#f8fafc]">Carregando...</div>;

    if (session) {
        return <Navigate to="/app" replace />;
    }

    return <Login />;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginWrapper />} />
                <Route
                    path="/app"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                {/* Redirect legacy or unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;

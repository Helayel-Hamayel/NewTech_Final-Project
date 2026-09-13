import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./components/common/NotFound";
import LoginPage from "./pages/LoginPage";
import FieldGuardPage from "./pages/FieldGuardPage";
import ResidentPortalPage from "./pages/ResidentPortalPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/resident" element={<ResidentPortalPage />} />
        <Route path="/staff" element={<StaffDashboardPage />} />
        <Route path="/field-guard" element={<FieldGuardPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

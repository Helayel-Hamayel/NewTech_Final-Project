import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./components/common/NotFound";
import LoginPage from "./pages/LoginPage";
import ResidentPage from "./pages/ResidentPage";

import FieldGuardLayout from "./layouts/FieldGuardLayout";
import FieldGuardPage from "./pages/FieldGuardPage";
import FieldGuardReportsPage from "./components/FieldGuard/FieldGuardReportsPage";
import FieldGuardHistoryPage from "./components/FieldGuard/FieldGuardHistoryPage";
import FieldGuardImplementIssuePage from "./components/FieldGuard/FieldGuardImplementIssuePage";
import StaffLayout from "./layouts/StaffLayout";
import StaffPage from "./pages/StaffPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/resident" element={<ResidentPage />} />

        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffPage />} />
        </Route>

        <Route path="/field-guard" element={<FieldGuardLayout />}>
          <Route index element={<FieldGuardPage />} />
          <Route
            path="create-issue"
            element={<FieldGuardImplementIssuePage />}
          />
          <Route path="report" element={<FieldGuardReportsPage />} />
          <Route path="history" element={<FieldGuardHistoryPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

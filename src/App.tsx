import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./components/common/NotFound";
import LoginPage from "./pages/LoginPage";
import ResidentPortalPage from "./pages/ResidentPortalPage";

//todo: fix the loose linking to other implemented pages in different branch, to test and make sure its working
<!-- import FieldGuardLayout from "./layouts/FieldGuardLayout";
import FieldGuardPage from "./pages/fieldGuard/FieldGuardPage";
import FieldGuardReportsPage from "./pages/fieldGuard/FieldGuardReportsPage";
import FieldGuardHistoryPage from "./pages/fieldGuard/FieldGuardHistoryPage";
import FieldGuardImplementIssuePage from "./pages/fieldGuard/FieldGuardImplementIssuePage";
import StaffLayout from "./layouts/StaffLayout";
import StaffDisputePage from "./pages/Staff/StaffDisputePage"; -->

import StaffDashboardPage from "./pages/StaffDashboardPage";
import FieldGuardLayout from "./components/FieldGuard/FieldGuardLayout";
import FieldGuardPage from "./pages/FieldGuardPage";
import FieldGuardReportsPage from "./components/FieldGuard/FieldGuardReportsPage";
import FieldGuardHistoryPage from "./components/FieldGuard/FieldGuardHistoryPage";
import FieldGuardImplementIssuePage from "./components/FieldGuard/FieldGuardImplementIssuePage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/resident" element={<ResidentPortalPage />} />

        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffDisputePage />} />
        </Route>

        <Route path="/field-guard" element={<FieldGuardLayout />}>
          <Route index element={<FieldGuardPage />} />
          <Route path="create-issue" element={<FieldGuardImplementIssuePage />} />
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

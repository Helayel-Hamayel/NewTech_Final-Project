import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import NotFound from "./components/common/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CitationStateProvider } from "./contexts/CitationStateContext";
import LoginPage from "./pages/LoginPage";
import ResidentPage from "./pages/ResidentPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/common/ProtectedRoute.tsx";

import FieldGuardLayout from "./layouts/FieldGuardLayout";
import StaffLayout from "./layouts/StaffLayout";
import StaffPage from "./pages/StaffPage";
import UserProvider from "./contexts/UserContext.tsx";

function App() {
  return (
    <ThemeProvider>
      <CitationStateProvider>
        <UserProvider>
          <BrowserRouter>
            <Toaster
              position="top-center"
              richColors
              closeButton
              duration={4000}
              toastOptions={{
                style: {
                  width: "420px",
                  maxWidth: "calc(100vw - 32px)",
                  padding: "20px 24px",
                  fontSize: "16px",
                  borderRadius: "14px",
                },
              }}
            />
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute allowedRole="RESIDENT" />}>
                <Route path="/resident" element={<ResidentPage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRole="STAFF" />}>
                <Route path="/staff" element={<StaffLayout />}>
                  <Route index element={<StaffPage />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute allowedRole="FIELD_GUARD" />}>
                <Route path="/field-guard" element={<FieldGuardLayout />} />

                <Route path="/field-guard/*" element={<Navigate to="/field-guard" replace />} />
              </Route>

              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </CitationStateProvider>
    </ThemeProvider>
  );
}

export default App;

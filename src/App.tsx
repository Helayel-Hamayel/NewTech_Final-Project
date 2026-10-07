import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./components/common/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CitationStateProvider } from "./contexts/CitationStateContext";
import LoginPage from "./pages/LoginPage";
import ResidentPage from "./pages/ResidentPage";

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
          <ToastContainer
            position="top-center"
            newestOnTop
            closeOnClick
            pauseOnHover
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/resident" element={<ResidentPage />} />

            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<StaffPage />} />
            </Route>

            <Route path="/field-guard" element={<FieldGuardLayout />} />
            <Route
              path="/field-guard/*"
              element={<Navigate to="/field-guard" replace />}
            />

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

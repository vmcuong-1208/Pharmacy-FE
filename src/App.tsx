import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import Login from "./pages/Login";
import Drugs from "./pages/Drugs";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/MainLayout";
import StockIn from "./pages/StockIn";

export default function App() {
  return (
    <ConfigProvider locale={viVN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Drugs />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/stock-in"
            element={
              <PrivateRoute>
                <MainLayout>
                  <StockIn />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

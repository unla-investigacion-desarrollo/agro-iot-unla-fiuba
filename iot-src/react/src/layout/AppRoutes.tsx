import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RolesPage from "../pages/RolesPage";
import { URLs } from "../config/enums";
import LoggedInRoute from "../components/LoggedInRoute/LoggedInRoute";
import GardensPage from "../pages/GardensPage";
import DashboardPage from "../pages/DashboardPage";
import UsersPage from "../pages/UsersPage";
import NotFoundPage from "../pages/NotFoundPage";
import LogoutPage from "../pages/LogoutPage";
import PublicRoute from "../components/PublicRoute/PublicRoute";
import AppLayout from "./AppLayout";
import MetricAcceptationRangesPage from "../pages/MetricAcceptationRangesPage";
import MetricTypesPage from "../pages/MetricTypesPage";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter basename={`${process.env.REACT_APP_PATH}`} >
      <Routes>
        <Route
          path={`${URLs.ROOT}/*`}
          element={
            <AppLayout>
              <LoggedInRoute>
                <DashboardPage />
              </LoggedInRoute>
            </AppLayout>
          }
        />
        <Route
          path={`${URLs.USERS}/*`}
          element={
            <AppLayout>
              <LoggedInRoute>
                <UsersPage />
              </LoggedInRoute>
            </AppLayout>
          }
        />

        <Route
          path={`${URLs.ROLES}/*`}
          element={
            <AppLayout>
              <LoggedInRoute>
                <RolesPage />
              </LoggedInRoute>
            </AppLayout>
          }
        />

        <Route
          path={`${URLs.GARDENS}/*`}
          element={
            <AppLayout>
              <LoggedInRoute>
                <GardensPage />
              </LoggedInRoute>
            </AppLayout>
          }
        />

        <Route
          path={`${URLs.METRIC_ACCEPTATION_RANGES}/*`}
          element={
            <AppLayout>
              <LoggedInRoute>
                <MetricAcceptationRangesPage />
              </LoggedInRoute>
            </AppLayout>
          }
        />

        <Route
          path={`${URLs.METRIC_TYPES}/*`}
          element={
            <AppLayout>
              <LoggedInRoute>
                <MetricTypesPage />
              </LoggedInRoute>
            </AppLayout>
          }
        />

        <Route
          path={URLs.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path={URLs.LOGOUT}
          element={
            <AppLayout>
              <LogoutPage />
            </AppLayout>
          }
        />
        <Route
          path="*"
          element={
            <AppLayout>
              <NotFoundPage />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

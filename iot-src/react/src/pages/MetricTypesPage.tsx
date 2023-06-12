import { Route, Routes } from "react-router-dom";
import { RolesEnum } from "../api/roles/enum";
import AuthorizedRoute from "../components/AuthorizedRoute/AuthorizedRoute";
import MetricTypeDetail from "../components/MetricTypes/MetricTypeDetail";
import MetricTypesGrid from "../components/MetricTypes/MetricTypesGrid";
import { URLs } from "../config/enums";

const MetricTypesPage = () => {
  return (
    <Routes>
      <Route
        path={URLs.ROOT}
        element={
          <AuthorizedRoute roles={[RolesEnum.ADMIN]}>
            <MetricTypesGrid />
          </AuthorizedRoute>
        }
      />
      <Route
        path={URLs.DETAIL}
        element={
          <AuthorizedRoute roles={[RolesEnum.ADMIN]}>
            <MetricTypeDetail />
          </AuthorizedRoute>
        }
      />
    </Routes>
  );
};

export default MetricTypesPage;

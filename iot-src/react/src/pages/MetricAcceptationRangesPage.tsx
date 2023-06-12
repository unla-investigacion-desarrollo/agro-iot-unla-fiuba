import { Route, Routes } from "react-router-dom";
import { RolesEnum } from "../api/roles/enum";
import AuthorizedRoute from "../components/AuthorizedRoute/AuthorizedRoute";
import MetricAcceptationRangeDetail from "../components/MetricAcceptationRanges/MetricAcceptationRangeDetail";
import MetricAcceptationRangesGrid from "../components/MetricAcceptationRanges/MetricAcceptationRangesGrid";
import { URLs } from "../config/enums";

const MetricAcceptationRangesPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path={URLs.ROOT}
        element={
          <AuthorizedRoute roles={[RolesEnum.GARDEN_MANAGER]}>
            <MetricAcceptationRangesGrid />
          </AuthorizedRoute>
        }
      />

      <Route
        path={URLs.NEW}
        element={
          <AuthorizedRoute roles={[RolesEnum.GARDEN_MANAGER]}>
            <MetricAcceptationRangeDetail />
          </AuthorizedRoute>
        }
      />

      <Route
        path={URLs.DETAIL}
        element={
          <AuthorizedRoute roles={[RolesEnum.GARDEN_MANAGER]}>
            <MetricAcceptationRangeDetail />
          </AuthorizedRoute>
        }
      />
    </Routes>
  );
};

export default MetricAcceptationRangesPage;

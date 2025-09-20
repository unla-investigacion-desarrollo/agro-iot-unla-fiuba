import { Route, Routes } from "react-router-dom";
import { RolesEnum } from "../api/roles/enum";
import AuthorizedRoute from "../components/AuthorizedRoute/AuthorizedRoute";
import Dashboard from "../components/Dashboard/Dashboard";
import { URLs } from "../config/enums";

interface Props {}

const DashboardPage: React.FC<Props> = () => {
  return (
    <Routes>
      <Route
        path={URLs.ROOT}
        element={
          <AuthorizedRoute roles={[RolesEnum.GARDEN_MANAGER]}>
            <Dashboard />
          </AuthorizedRoute>
        }
      />
    </Routes>
  );
};

export default DashboardPage;

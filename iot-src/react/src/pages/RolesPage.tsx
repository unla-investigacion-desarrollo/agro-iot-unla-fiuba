import { Route, Routes } from "react-router";
import { RolesEnum } from "../api/roles/enum";
import AuthorizedRoute from "../components/AuthorizedRoute/AuthorizedRoute";
import RoleDetail from "../components/Roles/RoleDetail";
import RolesGrid from "../components/Roles/RolesGrid";
import { URLs } from "../config/enums";

const RolesPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path={URLs.ROOT}
        element={
          <AuthorizedRoute roles={[RolesEnum.ADMIN]}>
            <RolesGrid />
          </AuthorizedRoute>
        }
      />
      <Route
        path={URLs.DETAIL}
        element={
          <AuthorizedRoute roles={[RolesEnum.ADMIN]}>
            <RoleDetail />
          </AuthorizedRoute>
        }
      />
    </Routes>
  );
};

export default RolesPage;

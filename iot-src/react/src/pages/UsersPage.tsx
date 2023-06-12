import { Route, Routes } from "react-router-dom";
import { RolesEnum } from "../api/roles/enum";
import AuthorizedRoute from "../components/AuthorizedRoute/AuthorizedRoute";
import UserDetail from "../components/Users/UserDetail";
import UsersGrid from "../components/Users/UsersGrid";
import { URLs } from "../config/enums";

const UsersPage: React.FC = () => {
  return (
    <Routes>
      <Route
        path={URLs.ROOT}
        element={
          <AuthorizedRoute roles={[RolesEnum.ADMIN]}>
            <UsersGrid />
          </AuthorizedRoute>
        }
      />
      <Route
        path={URLs.NEW}
        element={
          <AuthorizedRoute roles={[RolesEnum.ADMIN]}>
            <UserDetail />
          </AuthorizedRoute>
        }
      />

      <Route
        path={URLs.DETAIL}
        element={
          <AuthorizedRoute roles={[RolesEnum.ADMIN]}>
            <UserDetail />
          </AuthorizedRoute>
        }
      />
    </Routes>
  );
};

export default UsersPage;

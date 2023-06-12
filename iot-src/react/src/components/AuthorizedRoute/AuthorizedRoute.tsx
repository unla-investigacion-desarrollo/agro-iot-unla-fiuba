import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { RolesEnum } from "../../api/roles/enum";
import { URLs } from "../../config/enums";
import { hasPermission } from "../../helpers/permission-helper";
import NotFoundPage from "../../pages/NotFoundPage";
import { IGlobalState } from "../../redux/store";

interface Props {
  children: React.ReactElement;
  roles: RolesEnum[];
}

const AuthorizedRoute: React.FC<Props> = ({ children, roles }) => {
  const { profile } = useSelector((state: IGlobalState) => state.auth);

  if (!profile) return <Navigate to={URLs.LOGIN} />;

  if (hasPermission(roles)) return <>{children}</>;

  return <NotFoundPage />;
};

export default AuthorizedRoute;

import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { URLs } from "../../config/enums";
import { IGlobalState } from "../../redux/store";
import queryString from "query-string";

interface Props {
  children: React.ReactElement;
}

interface SearchParams {
  from?: string;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  const { profile } = useSelector((state: IGlobalState) => state.auth);
  const isLoggedIn = !!profile;

  if (isLoggedIn && window.location.pathname.includes(URLs.LOGIN)) {
    const params = queryString.parse(window.location.search) as SearchParams;
    return <Navigate to={params.from || URLs.ROOT} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

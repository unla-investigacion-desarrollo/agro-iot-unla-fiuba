import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { URLs } from "../../config/enums";
import { IGlobalState } from "../../redux/store";

interface Props {
  children: React.ReactElement;
}

const LoggedInRoute: React.FC<Props> = ({ children }) => {
  const { profile } = useSelector((state: IGlobalState) => state.auth);
  const isLoggedIn = !!profile;

  const from =
    window.location.pathname !== URLs.ROOT
      ? `?from=${window.location.pathname}`
      : "";

  if (!isLoggedIn)
    return <Navigate to={{ pathname: URLs.LOGIN, search: from }} />;

  return <>{children}</>;
};

export default LoggedInRoute;

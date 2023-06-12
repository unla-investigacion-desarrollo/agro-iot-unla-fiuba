import { message } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import AuthService from "../api/auth/AuthService";
import { URLs } from "../config/enums";
import { logout } from "../redux/auth/authSlice";
import store, { IGlobalState } from "../redux/store";

const LogoutPage: React.FC = () => {
  const { profile } = useSelector((state: IGlobalState) => state.auth);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await AuthService.logout();
      } catch (error) {
      } finally {
        AuthService.removeLocalStorage();
        store.dispatch(logout(null));
      }
      message.info("Sesión terminada exitosamente");
    };
    if (!!profile) {
      logoutUser();
    }
  }, [profile]);

  if (!profile) return <Navigate to={URLs.LOGIN} />;

  return <></>;
};

export default LogoutPage;

import { DateTime } from "luxon";
import { getTokenExpiration, isLoggedIn } from "../redux/selectors";
import store from "../redux/store";

export const mustRefreshToken = (): boolean => {
  if (!isLoggedIn(store.getState())) return false;
  const expirationISO = getTokenExpiration(store.getState());

  return !expirationISO
    ? false
    : DateTime.fromISO(expirationISO) <= DateTime.now();
};

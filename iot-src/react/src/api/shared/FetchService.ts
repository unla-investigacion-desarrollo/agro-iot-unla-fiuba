import { API_URL } from "../../config/general-config";
import { mustRefreshToken } from "../../helpers/auth-helper";
import { logout } from "../../redux/auth/authSlice";
import { getAuthToken } from "../../redux/selectors";
import store from "../../redux/store";
import AuthService from "../auth/AuthService";

interface FetchParams {
  url: string;
  body?: object;
  gridParams?: FetchGridParams;
}

export interface FetchGridParams {
  page: number;
  pageSize: number;
  sortField: string;
  sortDirection: string;
  search?: string;
  urlFilters: string;
}

export interface ApiError extends Error {
  status: number;
  message: string;
}

class FetchService {
  static async get<T>(params: FetchParams): Promise<T> {
    if (mustRefreshToken()) await AuthService.refreshToken();

    let { url } = params;
    const headers = this.getHeaders();

    if (params.gridParams) {
      let { page, pageSize, sortField, sortDirection, search, urlFilters } =
        params.gridParams;
      const pageParams = `pageIndex=${page}&pageSize=${pageSize}`;
      const sortParams = `&sortField=${sortField}&sortDirection=${sortDirection}`;
      const searchParam = search ? `&search=${search}` : "";

      url += `${
        !url.includes("?") && "?"
      }${pageParams}${sortParams}${searchParam}${urlFilters ?? ""}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
      headers,
    });
    return FetchService.processResponse<T>(response);
  }

  static async post<T>(params: FetchParams): Promise<T> {
    const { url, body } = params;
    const headers = this.getHeaders();
    const response = await fetch(`${API_URL}${url}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });

    return FetchService.processResponse<T>(response);
  }
  static async put<T>(params: FetchParams): Promise<T> {
    const { url, body } = params;
    const headers = this.getHeaders();
    const response = await fetch(`${API_URL}${url}`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers,
    });

    return FetchService.processResponse<T>(response);
  }
  static async delete<T>(params: FetchParams): Promise<T> {
    const { url, body } = params;
    const headers = this.getHeaders();
    const response = await fetch(`${API_URL}${url}`, {
      method: "DELETE",
      body: JSON.stringify(body),
      headers,
    });

    return FetchService.processResponse<T>(response);
  }

  static getHeaders() {
    const headers = new Headers();
    const jwtToken = getAuthToken(store.getState());
    headers.append("Content-Type", "application/json");
    if (jwtToken) headers.append("Authorization", `Bearer ${jwtToken}`);
    return headers;
  }

  static async processResponse<T>(response: Response) {
    if (response.ok)
      //200 or 201 or 204
      return (await response.json()) as T;

    if (response.status === 400) {
      throw new Error(await response.json());
    }

    if (response.status === 401) {
      AuthService.logout();
      store.dispatch(logout(null));
      AuthService.removeLocalStorage();
    }

    if (response.status === 404) {
      throw new Error("Endpoint not found [404]");
    }

    if (response.status === 405) {
      throw new Error("Method Not Allowed [405]");
    }

    if (response.status === 415) {
      throw new Error("Unsupported Media Type [415]");
    }

    if (response.status === 500) {
      throw new Error("Internal Server Error [500]");
    }

    return {} as T;
  }
}

export default FetchService;

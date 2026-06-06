import api from "../lib/api";

let accessToken: null | string = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};
export const getAccessToken = () => {
  return accessToken;
};

export const silentRefresh = async (): Promise<boolean> => {
  try {
    const res = await api.post("/api/auth/refresh");
    setAccessToken(res.data.accessToken);
    return true;
  } catch {
    return false;
  }
};

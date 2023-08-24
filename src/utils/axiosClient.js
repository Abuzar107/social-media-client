import axios from "axios";
import { setLoading, showToast } from "../redux/slice/appConfigSlice";
import { TOAST_FAILURE } from "../App";
import store from "../redux/store";

import {
  KEY_ACCESS_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "./localStorageManager";

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  store.dispatch(setLoading(true));

  return request;
});

axiosClient.interceptors.response.use(async (response) => {
  store.dispatch(setLoading(false));
  const data = response.data;
  if (data.status === "ok") {
    return data;
  }

  const orignalRequest = response.config;
  const statusCode = data.statusCode;
  const error = data.message;

  store.dispatch(
    showToast({
      type: TOAST_FAILURE,
      message: error,
    })
  );

  //To check later
  if (statusCode === 401 && !orignalRequest._retry) {
    // const response = await axiosClient.get("/auth/refresh");
    // console.log("response from backend", response);

    orignalRequest._retry = true;
    const response = await axios
      .create({
        withCredentials: true,
      })
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`);

    if (response.data.status === "ok") {
      setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
      orignalRequest.headers[
        "Authorization"
      ] = `Bearer ${response.result.accessToken}`;

      return axios(orignalRequest);
    } else {
      removeItem(KEY_ACCESS_TOKEN);
      window.location.replace("/login", "_self");
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
}, async(error) => {
  // store.dispatch(setLoading(false));
  store.dispatch(showToast({
    type: TOAST_FAILURE,
    message: error.message
  }))
  return Promise.reject(error);
})

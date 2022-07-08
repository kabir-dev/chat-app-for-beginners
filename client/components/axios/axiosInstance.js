import axios from "axios";
import decode from "jwt-decode";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useRouter } from "next/router";

let accestoken = Cookies.get("acces");
let refreshtoken = Cookies.get("refresh");

export const instance = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});
export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async function (req) {
  accestoken = Cookies.get("acces");
  refreshtoken = Cookies.get("refresh");

  if (!accestoken) {
    accestoken = Cookies.get("acces");
    req.headers.Authorization = `Bearer ${accestoken}`;
  }

  const user = decode(accestoken);
  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
  if (!isExpired) {
    req.headers.Authorization = `Bearer ${accestoken}`;
    return req;
  }

  const refToken = decode(refreshtoken);
  const isRefExpired = dayjs.unix(refToken.exp).diff(dayjs()) < 1;

  if (!isRefExpired) {
    const { data } = await instance.post("/api/refresh_token", {
      refresh_token: `Bearer ${refreshtoken}`,
    });
    Cookies.set("acces", data.access_token, { expires: 1 });
    Cookies.set("refresh", data.refresh_token, { expires: 1 });
    accestoken = data.access_token;
    refreshtoken = data.refresh_token;
    // console.log("new token", data);
    req.headers.Authorization = `Bearer ${data.access_token}`;
    return req;
  } else {
    Cookies.remove("acces");
    Cookies.remove("refresh");
    const router = useRouter();
    router.push("/");
  }

  req.headers.Authorization = `Bearer ${accestoken}`;
  return req;
});

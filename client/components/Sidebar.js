import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import { axiosInstance } from "./axios/axiosInstance";

export default function Sidebar() {
  const router = useRouter();
  const Logout = async () => {
    try {
      const { data } = await axiosInstance.get("/api/logout");
      Cookies.remove("acces");
      Cookies.remove("refresh");
      router.push("/");
    } catch (error) {
      Cookies.remove("acces");
      Cookies.remove("refresh");
      router.push("/");
    }
  };
  return (
    <div className=" transition duration-1000 ease-in-out ">
      <button
        onClick={Logout}
        className=" w-full my-2 outline-none border-none p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 "
      >
        <div className=" flex">
          <img className=" w-6 h-6" src="logout.png" />
          <p className=" ml-2 dark:text-white">logout</p>
        </div>
      </button>
    </div>
  );
}

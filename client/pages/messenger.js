import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import decode from "jwt-decode";
import { axiosInstance } from "../components/axios/axiosInstance";

import AddConversation from "../components/AddConversation";
import Conversation from "../components/Conversation";
import Message from "../components/Message";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const router = useRouter();

  let token = Cookie.get("acces");
  let userId = token && decode(token).aud;
  const [isLoading, setLoding] = useState(true);
  const [userData, setUserData] = useState();

  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [profileToggle, setProfileToggle] = useState(false);
  const [addConToggle, setaddConToggle] = useState(false);
  const [messageToggle, setMessagrToggle] = useState(false);

  useEffect(() => {
    token = Cookie.get("acces");
    if (!token) {
      setLoding(true);
      router.push("/");
      return;
    }
    //fatch
    const fetcher = async (id) => {
      try {
        const { data } = await axiosInstance.get(`/api/find/user/${id}`);
        setUserData(data);
      } catch (error) {
        setUserData("");
      }
    };
    fetcher(userId);
    setLoding(false);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", (e) => {
      window.screen.availWidth > 1024 && setSidebarToggle(false);
      window.screen.availWidth > 1024 && setProfileToggle(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className=" flex justify-center items-center w-full h-screen dark:bg-slate-800">
        <p className=" dark:text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className=" relative bg-slate-400 dark:bg-slate-700">
      <div className=" rounded-bl-md rounded-br-md border-b border-gray-300 bg-gray-50 h-[10vh] dark:bg-slate-800 dark:border-b dark:border-gray-700">
        <div className="">
          <Navbar
            user={userData}
            sidebarToggle={sidebarToggle}
            profileToggle={profileToggle}
            setSidebarToggle={setSidebarToggle}
            setProfileToggle={setProfileToggle}
          />
        </div>
      </div>
      <div className=" flex relative h-[90vh]">
        {/* profile start */}
        <div
          className={
            profileToggle
              ? "border-r border-gray-300 rounded-lg z-10 w-56 sm:w-80 h-[90vh] absolute top-0 right-0 bg-white shadow-md dark:bg-slate-800 dark:border-l dark:border-gray-700"
              : "border-r border-gray-300 rounded-lg w-56 sm:w-80 md:w-96 h-[90vh] hidden lg:block bg-white shadow-md dark:bg-slate-800 dark:border-r dark:border-gray-700"
          }
        >
          <Profile user={userData} setUserData={setUserData} />
        </div>
        {/* main start */}
        <div
          onClick={() => {
            setSidebarToggle(false);
            setProfileToggle(false);
          }}
          className=" flex w-full"
        >
          <div className=" border-gray-300 rounded-md pt-2 relative w-full sm:w-96 md:w-1/3 bg-white shadow-md dark:bg-slate-800 dark:border-r dark:border-gray-700">
            <Conversation
              userId={userId}
              setaddConToggle={setaddConToggle}
              addConToggle={addConToggle}
              setMessagrToggle={setMessagrToggle}
              messageToggle={messageToggle}
            />
            <div
              className={
                addConToggle
                  ? "w-full absolute left-0 top-0"
                  : "hidden w-full absolute left-0 top-0"
              }
            >
              <AddConversation
                userId={userId}
                setaddConToggle={setaddConToggle}
                addConToggle={addConToggle}
                setMessagrToggle={setMessagrToggle}
                messageToggle={messageToggle}
              />
            </div>
          </div>
          <div
            className={
              messageToggle
                ? " border-x border-gray-300 rounded-lg  w-full sm:w-full md:w-2/3 absolute top-0 left-0  h-[90vh] sm:block sm:relative bg-white shadow-sm dark:border-0 dark:bg-slate-800"
                : "border-x border-gray-300 rounded-lg w-full hidden sm:block sm:w-full md:w-2/3 bg-white shadow-sm dark:border-0 dark:bg-slate-800"
            }
          >
            <Message
              userId={userId}
              setMessagrToggle={setMessagrToggle}
              messageToggle={messageToggle}
            />
          </div>
        </div>

        {/* sidebar start */}
        <div
          className={
            sidebarToggle
              ? "rounded-lg  border-gray-300 w-44 px-1 py-2  h-[90vh] absolute top-0 left-0 translate-x-0 bg-white dark:bg-slate-800  dark:border-r dark:border-gray-700 shadow-md"
              : "rounded-lg border-gray-300 w-44 px-1 py-2  md:w-80 h-[90vh] hidden lg:block bg-white dark:bg-slate-800 dark:border-l dark:border-gray-700 shadow-md"
          }
        >
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

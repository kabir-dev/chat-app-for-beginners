import React from "react";
import Theme from "./Theme";

export default function Navbar({
  user,
  sidebarToggle,
  profileToggle,
  setProfileToggle,
  setSidebarToggle,
}) {
  return (
    <div className=" flex py-3">
      <div className=" w-10 sm:w-44 ">
        <button
          onClick={() => {
            setSidebarToggle(!sidebarToggle);
            setProfileToggle(false);
          }}
          className=" border-none outline-none lg:hidden"
          type="button"
        >
          <div className=" p-1 rounded-md">
            <div className=" w-6 h-1 m-1 bg-black dark:bg-white"></div>
            <div className=" w-6 h-1 m-1 bg-black dark:bg-white"></div>
            <div className=" w-6 h-1 m-1 bg-black dark:bg-white"></div>
          </div>
        </button>
      </div>
      <div className=" sm:mx-4 flex justify-between items-center w-full">
        <div className=" flex items-center">
          <img className=" w-8 h-8" src="chat _there.png" />
          <p className=" ml-2 dark:text-white">Messenger</p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => {
              setProfileToggle(!profileToggle);
              setSidebarToggle(false);
            }}
            className=" flex items-center rounded-full mx-2 md:mx-10 border-none outline-none lg:hidden"
          >
            <img
              className=" w-8 h-8 rounded-md object-cover"
              src={user && `http://localhost:4000/upload/${user.profile_pic}`}
            />
            <p className=" px-2 dark:text-white">{user && user.name}</p>
          </button>

          <span className=" hidden lg:block rounded-full mx-2 md:mx-10">
            <div className=" flex items-center">
              <img
                className=" w-8 h-8 rounded-md object-cover"
                src={user && `http://localhost:4000/upload/${user.profile_pic}`}
              />
              <p className=" px-2 dark:text-white">{user && user.name}</p>
            </div>
          </span>
          <Theme />
        </div>
      </div>
    </div>
  );
}

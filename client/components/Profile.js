import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { axiosInstance } from "./axios/axiosInstance";

export default function Profile({ user, setUserData }) {
  const router = useRouter();
  const [editToggle, seteditToggle] = useState(false);
  const [file, setfile] = useState(null);
  const [name, setname] = useState("");
  const [preview, setPreview] = useState("");

  const previewfile = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreview(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (formData) {
      formData.append("file", file);
    }
    const { data } = await axiosInstance.put("/api/update", formData);
    setUserData(data);
    seteditToggle(false);
  };

  const handleDelete = async () => {
    try {
      const refresh_token = await Cookies.get("refresh");
      const obj = {
        refresh_token: `Bearer ${refresh_token}`,
      };
      const { data } = await axiosInstance.post("/api/delete", obj);
      Cookies.remove("acces");
      Cookies.remove("refresh");
      router.push("/");
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className=" dark:text-white">
      {editToggle && (
        <div>
          <div className=" text-right">
            <button
              onClick={() => seteditToggle(false)}
              className="mt-3 mr-3 p-2 rounded-full outline-none dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
              type="button"
            >
              X
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className=" py-2 px-2">
              <div className="">
                <img
                  className=" w-20 h-20 sm:w-32 sm:h-32 object-cover m-auto rounded-md dark:border dark:border-gray-400 shadow-sm"
                  src={preview}
                />
              </div>
              <input
                className="w-full py-2 file:cursor-pointer file:bg-sky-600 file:py-1 file:text-white file:border-none file:rounded-md file:outline-none outline-none rounded-md shadow-sm"
                type="file"
                name="file"
                accept="image/*"
                onChange={(e) => {
                  setfile(e.target.files[0]);
                  previewfile(e);
                }}
              />
              <input
                className=" w-full my-2 p-1 bg-transparent dark:border outline-none dark:border-gray-500 shadow-sm rounded-md"
                type="text"
                name="neme"
                required
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
              <input
                className=" bg-cyan-700 cursor-pointer text-white py-1 px-4 outline-none shadow-sm rounded-md"
                type="submit"
                value="Save"
              />
            </div>
          </form>
        </div>
      )}
      {!editToggle && user && (
        <div className=" py-6" key={user._id}>
          <div className=" text-center">
            <button
              onClick={() => {
                setname(user.name);
                setPreview(`http://localhost:4000/upload/${user.profile_pic}`);
                seteditToggle(true);
              }}
              className=" w-full block  px-2 py-2  dark:text-white outline-none rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              type="button"
            >
              <div className="flex items-center">
                <img
                  className=" w-8 h-8 rounded-md object-cover"
                  src={`http://localhost:4000/upload/${user.profile_pic}`}
                />
                <p className=" ml-2">Edit profile</p>
              </div>
            </button>
          </div>
          <div className=" mx-1">
            <button
              onClick={() => {
                const isReady = confirm(
                  `${user.name} are you confirm delete permanently your account?`
                );
                if (isReady) {
                  handleDelete();
                }
              }}
              className=" w-full my-2 outline-none border-none p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 "
            >
              <div className=" flex">
                <img className=" w-6 h-6" src="trash.png" />
                <p className=" ml-2 dark:text-white">Delete account</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

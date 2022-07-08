import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { axiosInstance } from "./axios/axiosInstance";
import { useAuth } from "./Context/Auth";

export default function Conversation({
  userId,
  setaddConToggle,
  addConToggle,
  setMessagrToggle,
  messageToggle,
}) {
  const Auth = useAuth();
  const { currentChat, currentCon } = Auth;
  const [chat, setChat] = currentChat;

  const [isLoading, setLoding] = useState(true);
  const [users, setUsers] = currentCon;

  const handleDelete = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/api/conversation/${id}`);
      const filterUser = users.filter((user) => user._id !== id);
      setUsers(filterUser);
    } catch (error) {}
  };

  useEffect(() => {
    const fetcher = async (id) => {
      try {
        const { data } = await axiosInstance.get(`/api/conversation/${id}`);
        setUsers(data);
        setLoding(false);
      } catch (error) {
        setLoding(true);
      }
    };
    fetcher(userId);
  }, []);
  if (isLoading) {
    return (
      <div className=" flex justify-center items-center w-full h-screen dark:bg-slate-800">
        <p className=" dark:text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className=" text-right">
        {/* <input
          className=" w-40 mx-2 p-1 border dark:border-gray-500 outline-none rounded-md dark:bg-transparent dark:text-white"
          type="text"
          name="search"
          placeholder="search"
          autoComplete="off"
        /> */}
        <button
          onClick={() => setaddConToggle(!addConToggle)}
          className=" mr-4 outline-none border-none"
        >
          <span className="rounded-full px-1 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600 text-3xl">
            +
          </span>
        </button>
      </div>
      {!users ||
        (users.length === 0 && (
          <p className=" capitalize h-96 flex justify-center items-center dark:text-white">
            no conversation
          </p>
        ))}
      {users &&
        users.map((user) => (
          <div className="" key={user._id}>
            <div className=" flex justify-between items-center">
              <div
                onClick={() => {
                  setChat(user);
                  setMessagrToggle(true);
                }}
                className=" w-[90%]  relative transition-all duration-75 hover:bg-gray-300 dark:hover:bg-slate-600 p-2 mx-2 my-3 flex rounded-md shadow-sm"
              >
                <img
                  className=" w-8 h-8 rounded-md object-cover"
                  src={
                    user.creator._id === userId
                      ? `http://localhost:4000/upload/${user.participant.profile_pic}`
                      : `http://localhost:4000/upload/${user.creator.profile_pic}`
                  }
                />
                <span className=" ml-2 dark:text-white">
                  {user.creator._id === userId
                    ? user.participant.name
                    : user.creator.name}
                </span>
              </div>
              <div className=" mx-4">
                <button
                  className=" outline-none capitalize"
                  onClick={() => {
                    const currentCon =
                      user.creator._id === userId
                        ? user.participant.name
                        : user.creator.name;
                    const isReady = confirm(
                      `${currentCon} are you confirm delete permanently your conversations?`
                    );
                    if (isReady) {
                      handleDelete(user._id);
                    }
                  }}
                >
                  <img className=" w-6 h-6" src="trash.png" />
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

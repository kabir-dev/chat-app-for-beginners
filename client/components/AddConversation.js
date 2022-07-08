import React, { useEffect, useState } from "react";
import { axiosInstance } from "./axios/axiosInstance";
import { useAuth } from "./Context/Auth";

export default function AddConversation({
  userId,
  addConToggle,
  setaddConToggle,
  setMessagrToggle,
  messageToggle,
}) {
  const Auth = useAuth();
  const { currentCon } = Auth;
  const [users, setUsers] = currentCon;

  const [isLoading, setLoding] = useState(true);
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetcher = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/api/user?search=${searchQuery}`
      );
      setSearchUsers(data);
      setLoding(false);
    } catch (error) {
      setLoding(true);
    }
  };
  const handleChang = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetcher();
  };
  const saveConversation = async (creator, participant) => {
    try {
      const { data } = await axiosInstance.post(`/api/conversation`, {
        creator,
        participant,
      });
      setUsers(data);
      setLoding(false);
    } catch (error) {
      setLoding(true);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className=" w-full bg-white h-96 pt-4 dark:bg-slate-800">
      <div className=" text-right mx-5">
        <button
          onClick={() => {
            setaddConToggle(!addConToggle);
            setSearchQuery("");
            setSearchUsers([]);
          }}
          className="w-8 h-8 rounded-lg outline-none border-none text-center"
        >
          <p className="text-2xl text-red-500 dark:text-white dark:hover:bg-red-500 rounded-md">
            X
          </p>
        </button>
      </div>
      <div className=" text-center mt-4">
        <form onSubmit={handleSubmit}>
          <input
            className="p-1 outline-none border dark:border-gray-500 rounded-md dark:text-white dark:bg-transparent"
            type="text"
            placeholder="name or email"
            autoComplete="off"
            onChange={handleChang}
            value={searchQuery}
            required
          />
          <input
            type="submit"
            className=" bg-indigo-500 text-white capitalize p-1 rounded-md mx-2 outline-none border-none"
            value="search"
          />
        </form>
      </div>
      <div className="">
        {!searchUsers ||
          (searchUsers.length === 0 && (
            <p className=" capitalize h-96 flex justify-center items-center dark:text-white">
              no result found
            </p>
          ))}
        {searchUsers &&
          searchUsers.map((user) => {
            if (user._id !== userId) {
              return (
                <div
                  onClick={() => {
                    saveConversation(userId, user._id);
                    setaddConToggle(!addConToggle);
                  }}
                  key={user._id}
                  className="  relative transition-all duration-75 hover:bg-gray-300 dark:hover:bg-slate-600 p-2 mx-2 my-3 flex rounded-md shadow-sm"
                >
                  <img
                    className=" w-8 h-8 rounded-md object-cover"
                    src={`http://localhost:4000/upload/${user.profile_pic}`}
                  />
                  <span className=" ml-2 dark:text-white">{user.name}</span>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
}

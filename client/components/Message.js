import React, { useEffect, useRef, useState } from "react";
import { axiosInstance } from "./axios/axiosInstance";
import { useAuth } from "./Context/Auth";
import MessageText from "./MessageText";
import io from "socket.io-client";
const socket = io("http://localhost:4000", { transports: ["websocket"] });

export default function Message({ setMessagrToggle, messageToggle, userId }) {
  const Auth = useAuth();
  const { currentChat } = Auth;
  const [chat, setChat] = currentChat;

  const [users, setUsers] = useState([]);

  const [message, setMessage] = useState([]);
  const [sendText, setSendText] = useState("");
  const [socketMessage, setSocketMessage] = useState([]);
  const scroolRef = useRef(null);

  const sendMessage = async (chat) => {
    try {
      const obj = {
        text: sendText,
        creator:
          chat.creator._id === userId ? chat.creator._id : chat.participant._id,
        participant:
          chat.participant._id === userId
            ? chat.creator._id
            : chat.participant._id,
        conversation_id: chat._id,
      };

      const { data } = await axiosInstance.post("/api/message", obj);
      socket.emit("send_message", data);
      setSocketMessage([...socketMessage, data]);
      setSendText("");
    } catch (error) {
      setSendText("");
    }
  };
  const handleDelete = async () => {
    try {
      const { data } = await axiosInstance.delete(`/api/message/${chat._id}`);
      setMessage([]);
      setSocketMessage([]);
      setChat([]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.emit("add_user", userId);
    socket.on("get_users", function (allusers) {
      setUsers([...users, allusers]);
    });

    socket.on("new_message", function (message) {
      setSocketMessage([...socketMessage, message]);
    });
  }, [chat, socketMessage]);

  useEffect(() => {
    //fatch message
    const fetcher = async (id) => {
      try {
        const { data } = await axiosInstance.get(`/api/message/${id}`);
        setMessage(data);
      } catch (error) {
        setMessage([]);
      }
    };
    if (chat._id) {
      fetcher(chat._id);
    }
  }, [chat]);

  useEffect(() => {
    scroolRef.current?.scrollIntoView({ block: "end" });
  }, [message, socketMessage]);

  return (
    <div className="h-[90vh]  relative dark:text-white">
      {chat._id && (
        <div className=" py-1 flex justify-between items-center rounded-tl-md rounded-tr-md dark:bg-slate-700  shadow-sm dark:border-b dark:border-gray-700">
          {chat.creator && (
            <div className=" py-1 px-3 flex items-center">
              <img
                className=" w-12 h-12 rounded-md"
                src={
                  chat.creator._id === userId
                    ? `http://localhost:4000/upload/${chat.participant.profile_pic}`
                    : `http://localhost:4000/upload/${chat.creator.profile_pic}`
                }
              />
              <span className=" pl-4">
                {chat.creator._id === userId
                  ? chat.participant.name
                  : chat.creator.name}
              </span>
            </div>
          )}
          <div className=" mx-1">
            <button
              onClick={() => {
                const currentChatUser =
                  chat.creator._id === userId
                    ? `${chat.creator.name}`
                    : `${chat.participant.name}`;
                const isReady = confirm(
                  `${currentChatUser} are you confirm delete permanently your conversations?`
                );
                if (isReady) {
                  handleDelete();
                }
              }}
              className=" w-full my-2 outline-none border-none p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 "
            >
              <div className="">
                {chat._id && <img className=" w-6 h-6" src="trash.png" />}
              </div>
            </button>
          </div>
        </div>
      )}
      <div className=" pt-1 sm:hidden">
        {messageToggle && (
          <button
            onClick={() => {
              setMessagrToggle(false);
            }}
            className=" p-1 my-2 mx-1 border-none outline-none rounded-md dark:bg-slate-300"
          >
            <img className=" w-6 h-6" src="arrow.png" />
          </button>
        )}
      </div>
      <div className=" h-[80%] no-scrollbar overflow-y-auto px-2 py-2 sm:px-4 md:px-6">
        {!chat._id && (
          <div className=" w-full h-[100%] flex justify-center items-center">
            <div className=" text-center">
              <p className=" dark:text-white">No conversation.</p>
              <p className=" dark:text-white">Place select a conversation</p>
            </div>
          </div>
        )}
        {message &&
          message.map((item) => (
            <div ref={scroolRef} key={item._id}>
              <MessageText
                text={item.text}
                owner={item.creator._id === userId ? true : false}
              />
            </div>
          ))}
        {socketMessage &&
          socketMessage.map((item) => {
            if (
              item.conversation_id &&
              chat._id &&
              item.conversation_id === chat._id
            ) {
              return (
                <div ref={scroolRef} key={item._id}>
                  <MessageText
                    text={item.text}
                    owner={item.creator === userId ? true : false}
                  />
                </div>
              );
            }
          })}
      </div>

      <div className=" w-full absolute bottom-2 left-0">
        <div className="flex justify-center items-center">
          <div>
            <input
              className=" w-72  md:w-96 px-2 py-3 bg-slate-200 dark:bg-slate-700 rounded-lg outline-none text-black dark:text-white"
              name="message"
              type="text"
              autoComplete="off"
              placeholder="write a message..."
              onChange={(e) => setSendText(e.target.value)}
              value={sendText}
            />
          </div>
          <div className=" ml-10 sm:ml-4 md:ml-10 lg:ml-4">
            <button
              onClick={() => sendMessage(chat)}
              className={sendText ? " outline-none border-none" : " invisible"}
            >
              <img className=" mt-2 w-8 h-8" src="send-message.png" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createContext, useContext, useEffect, useState } from "react";

export const ContextProvider = createContext();
export const useAuth = () => {
  return useContext(ContextProvider);
};

export function Auth({ children }) {
  const [chat, setChat] = useState({});
  const [users, setUsers] = useState([]);

  const value = {
    currentChat: [chat, setChat],
    currentCon: [users, setUsers],
  };
  return (
    <ContextProvider.Provider value={value}>
      {children}
    </ContextProvider.Provider>
  );
}

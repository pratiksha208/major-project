import React, { createContext, useState, useContext } from "react";

const GlobalStateContext = createContext();
export const GlobalStateProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState(null);
  return (
    <GlobalStateContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, isError, setIsError, user, setUser }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
export const useGlobalState = () => useContext(GlobalStateContext);

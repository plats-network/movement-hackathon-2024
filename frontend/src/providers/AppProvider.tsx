"use client";


import { clientAccessToken } from "@/lib/http";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AppContext = createContext<{
  user: any | null;
  setUser: (user: any | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};

const AppProvider = ({
  children,
  initialAccessToken = "",
  user: userProp,
}: {
  children: React.ReactNode;
  initialAccessToken?: string;
  user: any | null;
}) => {
  const [user, setUser] = useState<any | null>(userProp);
  useState(() => {
    if (typeof window !== "undefined") {
      clientAccessToken.value = initialAccessToken;
    }
  });

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

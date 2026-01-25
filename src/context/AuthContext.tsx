"use client";

import { createContext, useContext } from "react";
import { trpc } from "../app/_trpc/client";
import { TRPCError } from "@trpc/server";

type User = {
  id: string;
  name: string | null;
  email: string;
  credits?: number;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (ctx === undefined || ctx === null) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Context not found" });
  }

  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const userSessionData = trpc.auth.getSession.useQuery();

  const isLoading = userSessionData.isLoading;

  console.log(userSessionData.data);

  const user = userSessionData.data
    ? {
        id: userSessionData.data.id,
        name: userSessionData.data.name,
        email: userSessionData.data.email,
        credits: userSessionData.data.credits,
      }
    : null;

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

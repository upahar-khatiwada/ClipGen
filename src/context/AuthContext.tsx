"use client";

import { createContext, useContext } from "react";
import { trpc } from "../app/_trpc/client";
import { TRPCError } from "@trpc/server";

type User = {
  id: string;
  name: string | null;
  email: string;
};

type AuthContextType = {
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
});

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (ctx === undefined || ctx === null) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Context not found" });
  }

  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = trpc.auth.getSession.useQuery();

  const user = data ?? null;

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | ClipGen"
}

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return <main>{children}</main>;
};

export default LayoutPage;

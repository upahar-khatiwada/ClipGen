import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Verify Email | ClipGen",
};

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return <main>{children}</main>;
};

export default LayoutPage;

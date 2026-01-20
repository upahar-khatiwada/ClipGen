import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Upgrade | ClipGen",
};

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return <main>{children}</main>;
};

export default LayoutPage;

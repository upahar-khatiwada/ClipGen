import NavBar from "@/src/components/NavBar";
import SideBar from "@/src/components/SideBar";
import React from "react";

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full bg-white text-black">
      <NavBar />

      <div className="flex mt-3 gap-2">
        <SideBar />
        <div className="bg-gray-50 w-full">{children}</div>
      </div>
    </div>
  );
};

export default LayoutPage;

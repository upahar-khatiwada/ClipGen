import NavBar from "@/src/components/NavBar";
import SideBar from "@/src/components/SideBar";
import { AuthProvider } from "@/src/context/AuthContext";
import React from "react";
import { Toaster } from "sonner";

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <div className="flex flex-col w-full bg-white text-black">
        <div className="sticky z-50 top-0 bg-white/70 backdrop-blur-md shadow-md">
          <NavBar />
        </div>

        <div className="flex mt-3 gap-2">
          <div className="hidden md:block md:w-64 h-[calc(100vh-72px)] sticky top-18 bg-slate-50 shadow-md">
            <SideBar />
          </div>
          <div className="bg-gray-50 w-full">
            {children}
            <Toaster position="bottom-right" richColors />
          </div>
        </div>
      </div>
    </AuthProvider>
  );
};

export default LayoutPage;

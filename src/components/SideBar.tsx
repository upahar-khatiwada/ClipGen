"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Plus, Shield, User } from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", icon: <Home className="w-5 h-5" />, href: "/dashboard" },
  { name: "Create New", icon: <Plus className="w-5 h-5" />, href: "/create" },
  { name: "Upgrade", icon: <Shield className="w-5 h-5" />, href: "/upgrade" },
  { name: "Account", icon: <User className="w-5 h-5" />, href: "/account" },
];

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-md h-[calc(100vh-72px)]">
      <div className="flex flex-col mt-0">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`flex cursor-pointer font-semibold items-center gap-3 mb-2 mx-2 px-4 py-3 text-left rounded-xl transition-colors duration-200
                ${isActive ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;

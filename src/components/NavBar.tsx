"use client";

import { User, Clapperboard } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const NavBar = () => {
  return (
    <div className="flex px-3 bg-white py-4 shadow-xl font-bold backdrop-blur-md items-center justify-between">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 text-xl cursor-pointer"
      >
        <Clapperboard className="text-indigo-600" />
        <span className="tracking-tight">ClipGen</span>
      </motion.div>
      <div className="hidden md:block text-sm font-medium text-gray-500">
        Generate short-form content instantly
      </div>

      <div className="flex items-center gap-3">
        <div className="flex gap-2 cursor-pointer items-center justify-center rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 font-semibold">
          <Image src="/svgs/coin.svg" alt="coin" width={23} height={23} />
          <span className="text-[18px]">50</span>
        </div>
        <div className="p-2 cursor-pointer rounded-full bg-gray-100 ring-2 ring-transparent hover:ring-gray-300 transition">
          <User />
        </div>
      </div>
    </div>
  );
};

export default NavBar;

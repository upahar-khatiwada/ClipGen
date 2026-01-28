"use client";

import { User, Clapperboard, CreditCard, LogOut } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { trpc } from "../app/_trpc/client";
import { toast } from "sonner";

const NavBar = () => {
  const [creditsOpen, setCreditsOpen] = useState<boolean>(false);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);

  const creditsRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const { user, isLoading } = useAuth();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        window.location.href = "/login";
      }
    },
    onError: (err) => {
      if (err.data?.code === "INTERNAL_SERVER_ERROR") {
        toast.error("Error while logging out");
      }
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        creditsOpen &&
        creditsRef.current &&
        !creditsRef.current.contains(target)
      ) {
        setCreditsOpen(false);
      }

      if (
        accountOpen &&
        accountRef.current &&
        !accountRef.current.contains(target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [creditsOpen, accountOpen]);

  return (
    <div className="flex px-3 bg-slate-50 py-4 h-15 shadow-xl font-bold backdrop-blur-md items-center justify-between">
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

      <div className="flex items-center gap-3" ref={creditsRef}>
        <button
          onClick={() => {
            setCreditsOpen((prev) => !prev);
            setAccountOpen(false);
          }}
          className="flex gap-2 items-center rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors cursor-pointer"
        >
          <Image src="/svgs/coin.svg" alt="coin" width={23} height={23} />
          {isLoading ? (
            <div className="h-5 w-12 bg-indigo-200 rounded animate-pulse" />
          ) : (
            <span className="text-[18px]">{user?.credits}</span>
          )}
        </button>

        <AnimatePresence>
          {creditsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-15 right-10 w-64 bg-white rounded-xl shadow-xl border p-4 z-50"
            >
              <div className="mb-3">
                <p className="text-sm text-slate-500">Available credits</p>
                <p className="text-2xl font-extrabold text-indigo-600">
                  {user?.credits}
                </p>
              </div>

              <Link href="/upgrade">
                <button
                  onClick={() => setCreditsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
                >
                  <CreditCard size={18} />
                  Buy Credits
                </button>
              </Link>

              <p className="text-xs text-slate-400 text-center mt-2">
                Or upgrade to Pro for unlimited usage
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={accountRef}>
          <button
            className="p-2 cursor-pointer rounded-full bg-gray-100 ring-2 ring-transparent hover:ring-gray-300 transition"
            onClick={() => {
              setAccountOpen((prev) => !prev);
              setCreditsOpen(false);
            }}
          >
            {user?.image ? (
              <Image
                width={30}
                height={30}
                src={user.image}
                alt="avatar"
                className="rounded-full"
              />
            ) : (
              <User />
            )}
          </button>

          <AnimatePresence>
            {accountOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute top-15 right-2 w-64 bg-white rounded-xl shadow-xl border p-4 z-50"
              >
                <div className="mb-3">
                  <p className="text-sm text-slate-500">Signed in as</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>

                <Link href="/account">
                  <button
                    onClick={() => setAccountOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-200 text-indigo-700 py-2 rounded-lg font-semibold transition-colors duration-200 cursor-pointer mb-2"
                  >
                    <User size={18} />
                    View Account
                  </button>
                </Link>

                <button
                  onClick={() => {
                    logoutMutation.mutate();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-200 text-red-600 py-2 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NavBar;

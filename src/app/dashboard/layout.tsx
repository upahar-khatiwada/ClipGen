import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Page",
};

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return <main className="bg-white min-h-screen text-black">{children}</main>;
};

export default LayoutPage;

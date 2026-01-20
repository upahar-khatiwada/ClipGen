import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | ClipGen",
};

const LayoutPage = ({ children }: { children: React.ReactNode }) => {
  return <main>{children}</main>;
};

export default LayoutPage;

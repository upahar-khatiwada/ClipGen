import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src="/ai_short_image.jpg"
          alt="AI short video generator"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div
        className="w-full min-h-screen flex items-center justify-center 
                bg-linear-to-br from-[#c9d1db] to-[#e0e4e7]"
      >
        {children}
      </div>
    </div>
  );
}

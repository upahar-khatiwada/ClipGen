import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
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
        className="w-full h-full flex items-center justify-center 
                bg-linear-to-br from-[#d0d1d3] to-[#e0d7ff]"
      >
        {children}
      </div>
    </div>
  );
}

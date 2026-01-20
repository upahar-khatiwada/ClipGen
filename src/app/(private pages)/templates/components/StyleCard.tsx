"use client";

import Image from "next/image";

interface StyleCardProps {
  id: string;
  label: string;
  img: string;
  selected?: boolean;
  onClick: () => void;
}

const StyleCard = ({
  id,
  label,
  img,
  selected = false,
  onClick,
}: StyleCardProps) => {
  return (
    <button
      key={id}
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden shadow-md transition duration-200 ${
        selected ? "ring-4 ring-indigo-500" : "hover:shadow-xl"
      }`}
    >
      <Image
        src={img}
        alt={label}
        className="w-full object-cover group-hover:scale-105 transition duration-150 cursor-pointer"
        width={120}
        height={90}
      />
      <div className="absolute bottom-0 w-full bg-black/80 text-white text-center py-2 text-sm font-semibold">
        {label}
      </div>
    </button>
  );
};

export default StyleCard;

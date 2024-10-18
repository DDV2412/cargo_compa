import { getInitials } from "@/utils/getInitials";
import React from "react";

const Avatar = ({ name, className }: { name: string; className?: string }) => {
  const initialName = getInitials(name);
  return (
    <div
      className={`w-10 h-10 flex-none rounded-full leading-none bg-neutral-200 dark:bg-neutral-900 text-blue-500 flex justify-center items-center font-bold ${className}`}
    >
      {initialName}
    </div>
  );
};

export default Avatar;

import React from "react";
import animationData from "../assets/images/loading.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="fixed inset-0 w-full h-full z-[999] flex justify-center bg-white/30 dark:bg-neutral-950/30">
      <div className="w-full h-full flex justify-center items-center">
        <Lottie options={defaultOptions} height={150} width={150} />
      </div>
    </div>
  );
};

export default Loading;

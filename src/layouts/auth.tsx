import React, { useEffect } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
      {children}
    </div>
  );
};

export default AuthLayout;

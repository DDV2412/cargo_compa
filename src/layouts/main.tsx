import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React, { useEffect } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidedarIsOpen, setSidebarIsOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarIsOpen(!sidedarIsOpen);
  };

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarIsOpen(false);
    }
  }, []);

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
    <>
      <Sidebar sidebarIsOpen={sidedarIsOpen} toggleSidebar={toggleSidebar} />
      <Header sidebarIsOpen={sidedarIsOpen} toggleSidebar={toggleSidebar} />
      <main className="text-neutral-900">
        <div
          className={`${
            sidedarIsOpen ? "pl-4 lg:pl-[275px]" : "pl-4"
          } transition-all duration-300 pt-28 pr-4 pb-10`}
        >
          {children}
        </div>
      </main>
    </>
  );
};

export default MainLayout;

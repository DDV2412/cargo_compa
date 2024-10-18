import { IconBell, IconInbox, IconMenu2 } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import Button from "./button";
import { useSelector } from "react-redux";
import { User } from "next-auth";

const Header = ({
  sidebarIsOpen,
  toggleSidebar,
}: {
  sidebarIsOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const route = useRouter();
  const { user } = useSelector((state: { user: { user: User } }) => state.user);
  return (
    <header
      className={`p-4 z-40 bg-white fixed top-0 right-0 ${
        sidebarIsOpen ? "left-0 lg:left-[259px]" : "left-0"
      } transition-all duration-300 flex justify-between items-center`}
    >
      <div className="flex justify-start items-center gap-4">
        <button className="flex lg:hidden" onClick={toggleSidebar}>
          <IconMenu2 size="24" />
        </button>
        <div className="hidden lg:block">
          <h1 className="text-3xl font-semibold">
            {route.pathname.startsWith("/shipments/")
              ? "Monitoring"
              : route.pathname.startsWith("/settings/user-management")
              ? "User management"
              : route.pathname === "/settings/profile"
              ? "Profile"
              : route.pathname === "/"
              ? "Dashboard"
              : route.pathname.replace("/", "").charAt(0).toUpperCase() +
                route.pathname.slice(2).toLowerCase()}
          </h1>
          {(route.pathname === "/" && (
            <p className="text-neutral-500 mt-1">
              Welcome back, {user?.name ?? "Cargo Compa"} !
            </p>
          )) ||
            (route.pathname.startsWith("/settings") && (
              <p className="text-neutral-500 mt-1">
                Manage your team members and their account permissions here.
              </p>
            ))}
        </div>
      </div>
      {route.pathname === "/" ? (
        <div className="flex justify-end items-center gap-6">
          <button className="text-neutral-500">
            <IconBell size="30" />
          </button>
          <button className="text-neutral-500">
            <IconInbox size="30" />
          </button>
        </div>
      ) : !route.pathname.startsWith("/settings") ? (
        <Button type={"button"} style={"primary"} ariaLabel={"Add Shipment"}>
          Add Shipment
        </Button>
      ) : null}
    </header>
  );
};

export default Header;

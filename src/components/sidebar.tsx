import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import Logo from "../assets/images/Logo.png";
import { navLink } from "@/utils/navLinks";
import { useRouter } from "next/router";
import Avatar from "./avatar";
import { IconLogout, IconX } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadUserFailure,
  loadUserStart,
  loadUserSuccess,
} from "@/lib/slice/userSlice";
import { User } from "next-auth";

const Sidebar = ({
  sidebarIsOpen,
  toggleSidebar,
}: {
  sidebarIsOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector(
    (state: {
      user: {
        user: User;
      };
    }) => state.user,
  );

  useEffect(() => {
    if (session) {
      const getUser = async () => {
        try {
          dispatch(loadUserStart());
          const response = await fetch(`/api/user/${session?.user?.id}`, {
            headers: {
              referer: `${process.env.NEXTAUTH_URL}`,
              authorization: `Bearer ${session?.accessToken}`,
            },
          });
          const data = await response.json();
          if (data.data === null) {
            return;
          }

          data.data.accessToken = session.accessToken;
          dispatch(
            loadUserSuccess({
              user: data.data,
            }),
          );
        } catch (error: any) {
          dispatch(loadUserFailure(error.message || "Something went wrong!"));
          console.error(error.message || "Something went wrong!");
        }
      };
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <aside
      className={`py-6 z-50 bg-white max-w-full lg:max-w-[259px] border-r-2 border-neutral-100 fixed flex flex-col justify-between left-0 right-0 h-screen ${
        sidebarIsOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="relative">
        <div className="px-3 relative">
          <Link href="/">
            <Image src={Logo} alt="CargoCompa" width={230} height={36} />
          </Link>
          <button
            className="flex lg:hidden absolute top-2 right-6"
            onClick={toggleSidebar}
          >
            <IconX size={20} />
          </button>
        </div>
        <nav className="mt-10">
          <div className="flex flex-col gap-6">
            {navLink
              .filter(
                (link) =>
                  (user?.acceptedDate !== null && user?.role !== "ADMIN") ||
                  user?.role === "ADMIN" ||
                  link.type === "main-menu",
              )
              .map((link, index) => (
                <div
                  key={index}
                  className={`${
                    link.type === "main-menu"
                      ? "pb-5 border-b-2 border-neutral-100"
                      : ""
                  }`}
                >
                  <span key={index} className="text-sm px-3">
                    {link.title}
                  </span>
                  <ul className="flex flex-col gap-6 mt-3 px-3">
                    {link.items
                      .filter(
                        (item) =>
                          (user?.acceptedDate !== null &&
                            user?.role !== "ADMIN") ||
                          user?.role === "ADMIN" ||
                          item.path === "/",
                      )
                      .map((item, indexItem) => (
                        <li key={indexItem} className="w-full">
                          <Link
                            href={
                              item.path === "/settings/profile" &&
                              user?.role === "ADMIN"
                                ? "/settings/user-management"
                                : item.path
                            }
                            className={`w-full text-neutral-500 text-sm px-3 py-2.5 flex justify-start items-center gap-2 rounded-md ${
                              item.path === router.pathname
                                ? "bg-blue-500 !text-white"
                                : ""
                            }`}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
          </div>
        </nav>
      </div>
      <div className="flex justify-between items-start gap-2 px-4">
        <div className="flex justify-start items-center gap-2">
          {session?.user?.image ? (
            <Image
              src={session?.user?.image}
              alt={session?.user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <Avatar name={session?.user.name} />
          )}
          <div className="flex flex-col">
            <p className="">{session?.user.name}</p>
            <p className="text-neutral-500 text-sm">
              {session?.user.role.toLowerCase().slice(0, 1).toUpperCase() +
                session?.user.role.toLowerCase().slice(1)}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            signOut({ callbackUrl: "/sign-in" });
          }}
          className="text-neutral-500"
        >
          <IconLogout size="24" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import Avatar from "@/components/avatar";
import Button from "@/components/button";
import Table, { TableConfigProps } from "@/components/table";
import TextField from "@/components/text-field";
import MainLayout from "@/layouts/main";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  loadAllUsersFailure,
  loadAllUsersStart,
  loadAllUsersSuccess,
} from "@/lib/slice/userSlice";
import { RootState } from "@/lib/store";
import {
  IconDotsVertical,
  IconPlus,
  IconSearch,
  IconSortDescending,
} from "@tabler/icons-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loading from "@/components/loading";
import Image from "next/image";
import { useRouter } from "next/router";

const UserManagement = () => {
  const { users, user, loading } = useSelector(
    (state: RootState) => state.user,
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const [actionOpen, setActionOpen] = React.useState({
    open: false,
    id: "",
  });
  const [deleteUser, setDeleteUser] = React.useState({
    open: false,
    id: "",
  });
  const [search, setSearch] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(users);

  const handleDeleteUser = async (id: string) => {
    if (user) {
      try {
        const response = await fetch(`/api/user/delete/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user?.accessToken}`,
          },
        });

        const data = await response.json();

        if (data.status === 200) {
          dispatch(deleteUserStart());
          dispatch(deleteUserSuccess({ id: id }));
          setDeleteUser({
            open: false,
            id: "",
          });
        }
      } catch (error) {
        console.error(error);
        dispatch(
          deleteUserFailure("An error occurred while deleting the user"),
        );
      }
    }
  };

  const handleSearch = ({ search }: { search: string }) => {
    let filteredData = users;

    if (search) {
      filteredData = users.filter((user) => {
        return Object.values(user).some((value) => {
          return (
            value !== null &&
            value.toString().toLowerCase().includes(search.toLowerCase())
          );
        });
      });
    }

    setFilteredData(filteredData);
  };

  const tableConfig: TableConfigProps[] = [
    {
      fieldName: "id",
      minWidth: 300,
      renderHeader: () => <p>Username</p>,
      renderCell: ({ row }) => (
        <div className="flex justify-start items-center gap-2">
          <div className="w-12 h-12 flex justify-center items-center rounded-full overflow-hidden">
            {row.image ? (
              <Image
                src={row.image}
                alt={row.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <Avatar name={row.name} />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm">{row.name}</p>
            <p className="text-xs text-neutral-600">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      fieldName: "role",
      minWidth: 200,
      renderHeader: () => <p>Access</p>,
      renderCell: ({ row }) => (
        <p className="py-1 text-sm px-3 border border-blue-500 inline-flex justify-center items-center rounded-full">
          {row.role.charAt(0).toUpperCase() + row.role.slice(1).toLowerCase()}
        </p>
      ),
    },
    {
      fieldName: "lastActive",
      minWidth: 200,
      renderHeader: () => <p>Last Active</p>,
      renderCell: ({ row }) => (
        <p className="text-sm">
          {new Date(row.lastActive).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      ),
    },
    {
      fieldName: "createdAt",
      minWidth: 200,
      renderHeader: () => <p>Date Added</p>,
      renderCell: ({ row }) => (
        <div className="w-full flex justify-between items-center">
          <p className="text-sm">
            {new Date(row.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <div className="relative">
            <button
              onClick={() =>
                setActionOpen({
                  open: !actionOpen.open,
                  id: row.id,
                })
              }
            >
              <IconDotsVertical size="20" />
            </button>

            {actionOpen.open && actionOpen.id === row.id && (
              <div className="absolute p-2 rounded-xl border border-neutral-300 right-0 z-30 bg-white">
                <button
                  onClick={() => {
                    router.push(`/settings/user-management/update/${row.id}`);
                  }}
                  className="flex gap-2 items-center text-sm px-3 py-2 hover:bg-neutral-100 w-full rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    setDeleteUser({
                      open: true,
                      id: row.id,
                    })
                  }
                  className="flex gap-2 items-center text-sm px-3 py-2 hover:bg-neutral-100 w-full rounded-md"
                >
                  Delete
                </button>
                {deleteUser.open && deleteUser.id === row.id && (
                  <div className="fixed inset-0 bg-neutral-950/30 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg w-[28rem]">
                      <h2 className="text-xl font-semibold text-center">
                        Are you sure you want to delete this user?
                      </h2>
                      <div className="flex gap-4 justify-end mt-5">
                        <Button
                          type={"button"}
                          style={"secondary"}
                          onClick={() => {
                            setDeleteUser({
                              open: false,
                              id: "",
                            });
                          }}
                          ariaLabel="Cancel"
                        >
                          Cancel
                        </Button>
                        <Button
                          type={"button"}
                          style={"primary"}
                          onClick={() => {
                            handleDeleteUser(row.id);
                          }}
                          ariaLabel="Delete"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // fetch data
    if (user) {
      if (user.role !== "ADMIN") {
        router.push("/dashboard");
      }
      const fetchData = async () => {
        dispatch(loadAllUsersStart());
        try {
          const response = await fetch("/api/user", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${user?.accessToken}`,
            },
          });

          const data = await response.json();

          if (data.status === 200) {
            dispatch(loadAllUsersSuccess({ users: data.data }));
            setFilteredData(data.data);
          }
        } catch (error) {
          console.error(error);
          dispatch(
            loadAllUsersFailure(
              "An error occurred while fetching the user data",
            ),
          );
        }
      };

      fetchData();
    }
  }, [dispatch, router, user]);
  return (
    <>
      {loading && <Loading />}
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 justify-between flex-wrap items-center">
          <h2 className="text-2xl text-neutral-600">
            All User <span>({users.length})</span>
          </h2>
          <div className="flex gap-4 justify-end items-center flex-wrap">
            <div className="relative w-full md:w-auto">
              <IconSearch
                size="20"
                className="absolute left-3 top-3.5 text-neutral-400"
              />
              <TextField
                ariaLabel="Search"
                placeholder="Type in receipt"
                labelClassName="text-xl font-normal text-neutral-500"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleSearch({ search: e.target.value });
                }}
                type={"text"}
                className="!pl-10"
              />
            </div>

            <button className="flex flex-auto md:flex-none gap-2 justify-center items-center py-2.5 px-4 text-xs md:text-sm font-semibold rounded-lg border border-neutral-300">
              <IconSortDescending size="20" />
              Filters
            </button>
            <Button
              type={"button"}
              style={"primary"}
              onClick={() => {
                router.push("/settings/user-management/create");
              }}
              ariaLabel={"Add User"}
              className="flex-auto md:flex-none"
            >
              <IconPlus size="20" />
              Add User
            </Button>
          </div>
        </div>
        <Table tableConfig={tableConfig} rows={filteredData} />
      </div>
    </>
  );
};

UserManagement.getLayout = (page: React.ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default UserManagement;

import Table, { TableConfigProps } from "@/components/table";
import MainLayout from "@/layouts/main";
import {
  IconCalendarDue,
  IconDots,
  IconSortDescending,
  IconTruck,
} from "@tabler/icons-react";
import { User } from "next-auth";
import Head from "next/head";
import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state: { user: { user: User } }) => state.user);

  const tableConfig: TableConfigProps[] = [
    {
      fieldName: "id",
      minWidth: 200,
      renderHeader: () => <p>Order ID</p>,
      renderCell: ({ row }) => <p>{row.route}</p>,
    },
    {
      fieldName: "category",
      minWidth: 200,
      renderHeader: () => <p>Category</p>,
      renderCell: ({ row }) => <p>{row.route}</p>,
    },
    {
      fieldName: "arrivital_time",
      minWidth: 200,
      renderHeader: () => <p>Arrivital Time</p>,
      renderCell: ({ row }) => <p>{row.route}</p>,
    },
    {
      fieldName: "route",
      minWidth: 200,
      renderHeader: () => <p>Route</p>,
      renderCell: ({ row }) => <p>{row.route}</p>,
    },
    {
      fieldName: "status",
      minWidth: 200,
      renderHeader: () => <p>Status</p>,
      renderCell: ({ row }) => <p>{row.route}</p>,
    },
  ];
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard page for CargoCompa" />
      </Head>
      {user?.acceptedDate === null && user?.role !== "ADMIN" ? (
        <div className="flex justify-start">
          <h2 className="text-xl font-medium text-neutral-500">
            Please contact the admin to get your account approved.
          </h2>
        </div>
      ) : (
        <>
          <div className="flex justify-between flex-wrap items-center gap-2">
            <div className="hidden md:flex justify-start rounded-lg border border-neutral-300">
              <button className="flex justify-center items-center py-2.5 px-4 text-sm font-semibold border-r border-neutral-300">
                12 Months
              </button>
              <button className="flex justify-center items-center py-2.5 px-4 text-sm font-semibold border-r border-neutral-300">
                30 Days
              </button>
              <button className="flex justify-center items-center py-2.5 px-4 text-sm font-semibold border-r border-neutral-300">
                7 Days
              </button>
              <button className="flex justify-center items-center py-2.5 px-4 text-sm font-semibold">
                24 Hours
              </button>
            </div>
            <div className="flex justify-end items-center gap-3">
              <button className="flex gap-2 justify-center items-center py-2.5 px-4 text-sm font-semibold rounded-lg border border-neutral-300">
                <IconCalendarDue size="20" />
                Select Date
              </button>
              <button className="flex gap-2 justify-center items-center py-2.5 px-4 text-sm font-semibold rounded-lg border border-neutral-300">
                <IconSortDescending size="20" />
                Filters
              </button>
            </div>
          </div>
          <div className="mt-7">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="grid col-span-1 lg:col-span-2 grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6 py-7 px-6 border border-neutral-300 rounded-3xl">
                  <div className="flex justify-between">
                    <div className="flex justify-start items-center gap-2">
                      <IconTruck size="24" className="text-blue-500" />
                      <p className="text-sm text-neutral-500">
                        Total Shipments
                      </p>
                    </div>
                    <button className="text-neutral-500">
                      <IconDots size="20" />
                    </button>
                  </div>
                  <h2 className="text-[2.5rem] font-medium">4.502</h2>
                  <div className="flex justify-between">
                    <p className="text-sm text-neutral-500">VS Last Week</p>
                    <p className="py-1 px-3 rounded-full bg-green-100 border border-green-500 text-xs">
                      + 150
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-6 py-7 px-6 border border-neutral-300 rounded-3xl">
                  <div className="flex justify-between">
                    <div className="flex justify-start items-center gap-2">
                      <IconTruck size="24" className="text-blue-500" />
                      <p className="text-sm text-neutral-500">
                        Total Shipments
                      </p>
                    </div>
                    <button className="text-neutral-500">
                      <IconDots size="20" />
                    </button>
                  </div>
                  <h2 className="text-[2.5rem] font-medium">4.502</h2>
                  <div className="flex justify-between">
                    <p className="text-sm text-neutral-500">VS Last Week</p>
                    <p className="py-1 px-3 rounded-full bg-green-100 border border-green-500 text-xs">
                      + 150
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-6 py-7 px-6 border border-neutral-300 rounded-3xl">
                  <div className="flex justify-between">
                    <div className="flex justify-start items-center gap-2">
                      <IconTruck size="24" className="text-blue-500" />
                      <p className="text-sm text-neutral-500">
                        Total Shipments
                      </p>
                    </div>
                    <button className="text-neutral-500">
                      <IconDots size="20" />
                    </button>
                  </div>
                  <h2 className="text-[2.5rem] font-medium">4.502</h2>
                  <div className="flex justify-between">
                    <p className="text-sm text-neutral-500">VS Last Week</p>
                    <p className="py-1 px-3 rounded-full bg-green-100 border border-green-500 text-xs">
                      + 150
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-6 py-7 px-6 border border-neutral-300 rounded-3xl">
                  <div className="flex justify-between">
                    <div className="flex justify-start items-center gap-2">
                      <IconTruck size="24" className="text-blue-500" />
                      <p className="text-sm text-neutral-500">
                        Total Shipments
                      </p>
                    </div>
                    <button className="text-neutral-500">
                      <IconDots size="20" />
                    </button>
                  </div>
                  <h2 className="text-[2.5rem] font-medium">4.502</h2>
                  <div className="flex justify-between">
                    <p className="text-sm text-neutral-500">VS Last Week</p>
                    <p className="py-1 px-3 rounded-full bg-green-100 border border-green-500 text-xs">
                      + 150
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid col-span-1">
                <div className="flex flex-col gap-6 py-7 px-6 border border-neutral-300 rounded-3xl">
                  <div className="flex justify-between">
                    <div className="flex justify-start items-center gap-2">
                      <p className="text-2xl text-neutral-500">
                        Tracking Track
                      </p>
                    </div>
                    <button className="flex gap-2 justify-center items-center py-2.5 px-4 text-sm font-semibold rounded-lg border border-neutral-300">
                      <IconSortDescending size="20" />
                      Filters
                    </button>
                  </div>
                  <div className="flex w-full h-full bg-neutral-100 rounded-3xl mt-4"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-7">
            <div className="flex flex-col gap-6 py-7 px-6 border border-neutral-300 rounded-3xl">
              <div className="flex justify-between">
                <div className="flex justify-start items-center gap-2">
                  <p className="text-2xl text-neutral-500">Shipping List</p>
                </div>
                <div className="flex justify-end items-center gap-3">
                  <button className="hidden md:flex gap-2 justify-center items-center py-2.5 px-4 text-xs md:text-sm font-semibold rounded-lg border border-neutral-300">
                    <IconCalendarDue size="20" />
                    Select Date
                  </button>
                  <button className="flex gap-2 justify-center items-center py-2.5 px-4 text-xs md:text-sm font-semibold rounded-lg border border-neutral-300">
                    <IconSortDescending size="20" />
                    Filters
                  </button>
                </div>
              </div>
              <div className="flex w-full h-full mt-4">
                <Table tableConfig={tableConfig} rows={[]} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

Home.getLayout = (page: React.ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Home;

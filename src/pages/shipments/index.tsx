import Table, { TableConfigProps } from "@/components/table";
import MainLayout from "@/layouts/main";
import { IconCalendarDue, IconSortDescending } from "@tabler/icons-react";
import Head from "next/head";
import React from "react";

const Shipments = () => {
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
        <title>Shipments</title>
        <meta name="description" content="Shipments page for CargoCompa" />
      </Head>
      <div className="w-full">
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
  );
};

Shipments.getLayout = (page: React.ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Shipments;

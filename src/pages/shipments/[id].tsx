import Table, { TableConfigProps } from "@/components/table";
import MainLayout from "@/layouts/main";
import Image from "next/image";
import React from "react";
import TruckImage from "../../assets/images/truck.png";
import {
  IconMapPinFilled,
  IconMessage,
  IconPhone,
  IconPointFilled,
} from "@tabler/icons-react";
import Avatar from "@/components/avatar";

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
      <div className="w-full">
        <Table tableConfig={tableConfig} rows={[]} />

        <div className="flex w-full h-full mt-6 relative">
          <div className="absolute w-full max-w-[440px] top-6 right-6 px-6 py-7 rounded-3xl bg-white flex flex-col gap-5">
            <p className="font-semibold text-xl">Ongoing Delivery</p>
            <div className="p-5 border-2 border-blue-500 rounded-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-neutral-500 text-sm">Shipment number</p>
                  <p className="font-semibold text-lg">EV-2017002346</p>
                  <p className="text-neutral-700 text-sm mt-1">
                    Food Materials
                  </p>
                </div>
                <div className="flex-none">
                  <Image
                    src={TruckImage}
                    alt="Cargo Compa Truck"
                    width={175}
                    height={70}
                  />
                </div>
              </div>
              <div className="w-full h-[1px] bg-neutral-200 my-5"></div>
              <div className="flex flex-col gap-6 relative">
                <div className="w-full relative z-10 flex justify-start items-center gap-4">
                  <div className="flex-none w-8 h-8 flex justify-center items-center gap-4 rounded-full bg-blue-50 text-blue-500">
                    <IconPointFilled size="32" />
                  </div>
                  <div>
                    <p className="font-semibold">2972 Westheimer </p>
                    <p className="font-normal text-neutral-400 text-xs">
                      Rd. Santa Ana, Illinois 85486{" "}
                    </p>
                  </div>
                </div>
                <div className="w-full relative z-10 flex justify-start items-center gap-4">
                  <div className="flex-none w-8 h-8  flex justify-center items-center gap-4 rounded-full bg-blue-50 text-blue-500">
                    <IconMapPinFilled size="20" />
                  </div>
                  <div>
                    <p className="font-semibold">2972 Westheimer </p>
                    <p className="font-normal text-neutral-400 text-xs">
                      Rd. Santa Ana, Illinois 85486{" "}
                    </p>
                  </div>
                </div>
                <div className="absolute border border-dashed border-neutral-200 left-[15px] h-10 top-8"></div>
              </div>
              <div className="w-full h-[1px] bg-neutral-200 my-5"></div>
              <div className="flex justify-between items-center">
                <div className="flex justify-start items-center gap-4">
                  <Avatar name="Darrell Steward" className="w-14 h-14" />
                  <div>
                    <p className="text-neutral-500 text-sm">Client</p>
                    <p className="font-semibold">Darrell Steward</p>
                    <p className="text-neutral-700 text-sm">Mariene, LTD</p>
                  </div>
                </div>
                <div className="flex-none flex justify-end items-center gap-4">
                  <button className="flex justify-center items-center rounded-xl p-2 text-blue-500 bg-blue-50">
                    <IconPhone size="24" />
                  </button>
                  <button className="flex justify-center items-center rounded-xl p-2 text-blue-500 bg-blue-50 relative">
                    <IconMessage size="24" />
                    <div className="absolute w-3 h-3 rounded-full bg-blue-500 top-1.5 right-1.5"></div>
                  </button>
                </div>
              </div>
            </div>
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

"use client";

import {
  IconChevronLeft,
  IconChevronRight,
  IconDatabaseOff,
} from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export type TableConfigProps = {
  fieldName: string;
  minWidth: number;
  width?: number;
  renderHeader: () => React.ReactNode;
  renderCell: (params: {
    row: {
      [key: string]: any;
    };
  }) => React.ReactNode;
};

const Table = ({
  tableConfig,
  rows,
  rowsPerPage = 10,
}: {
  tableConfig: TableConfigProps[];
  rows: Array<{ [key: string]: unknown }>;
  rowsPerPage?: number;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(rows?.length / rowsPerPage);

  useEffect(() => {
    const queryPage = searchParams.get("page");

    if (queryPage) {
      setCurrentPage(Number(queryPage));
    }
  }, [searchParams]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedRows = rows.slice(startIndex, endIndex);

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-auto sm:rounded-lg">
        <table className="w-full table-auto">
          <thead className="bg-blue-50 ">
            <tr>
              {tableConfig.map((col: TableConfigProps) => (
                <th
                  key={col.fieldName}
                  className={`py-3 px-4 font-normal text-left`}
                  style={{
                    minWidth: col.minWidth,
                  }}
                >
                  <div>{col.renderHeader()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows?.length === 0 ? (
              <tr>
                <td
                  colSpan={tableConfig.length}
                  className="py-3 text-neutral-400 dark:text-neutral-600"
                >
                  <div className="w-full py-8 flex-col gap-4 flex justify-center items-center">
                    <IconDatabaseOff size={80} />
                    <p className="text-lg font-medium ml-4">
                      No data available
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              displayedRows?.map(
                (row: { [key: string]: unknown }, rowIndex: number) => (
                  <tr
                    key={rowIndex}
                    className={` hover:bg-blue-500/10 ${
                      rows.length - 1 === rowIndex
                        ? "border-b-0"
                        : "border-b-[1px]"
                    } border-neutral-300 dark:border-neutral-700`}
                  >
                    {tableConfig.map((col: TableConfigProps) => (
                      <td
                        key={col.fieldName}
                        className={`py-3 px-4 `}
                        style={{
                          minWidth: col.minWidth,
                        }}
                      >
                        <div>{col.renderCell({ row })}</div>
                      </td>
                    ))}
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
      {rows?.length > rowsPerPage && (
        <div className="flex justify-end gap-4 items-center mt-8">
          <p className="text-sm text-neutral-400 dark:text-neutral-600">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => {
              handlePageChange(currentPage - 1);
              params.set("page", String(currentPage - 1));
              router.push(pathname + "?" + params.toString());
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-neutral-900 rounded disabled:bg-neutral-300 disabled:dark:bg-neutral-700 disabled:text-neutral-400 disabled:dark:text-neutral-600"
          >
            <IconChevronLeft />
          </button>
          <button
            onClick={() => {
              handlePageChange(currentPage + 1);
              params.set("page", String(currentPage + 1));
              router.push(pathname + "?" + params.toString());
            }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-neutral-900 rounded disabled:bg-neutral-300 disabled:dark:bg-neutral-700 disabled:text-neutral-400 disabled:dark:text-neutral-600"
          >
            <IconChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;

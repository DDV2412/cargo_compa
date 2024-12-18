import Table, { TableConfigProps } from "@/components/table";
import MainLayout from "@/layouts/main";
import { loadUserSuccess, UserPayload } from "@/lib/slice/userSlice";
import { completeRegisterSchema } from "@/lib/yup";
import {
  IconCalendarDue,
  IconDots,
  IconSortDescending,
  IconTruck,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const Loading = dynamic(() => import("../components/loading"));

const TextField = dynamic(() => import("../components/text-field"));
const Button = dynamic(() => import("../components/button"));

const Home = () => {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const [naam, setNaam] = React.useState("");
  const { user } = useSelector(
    (state: { user: { user: UserPayload } }) => state.user,
  );
  const [isErrors, setIsErrors] = React.useState(false);
  const [isVatValid, setIsVatValid] = React.useState(false);
  const [isEoriValid, setIsEoriValid] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      vatNumber: "",
      eoriNumber: "",
      kboNumber: "",
      kboFile: null,
      address: "",
      city: "",
      country: "",
      zip_code: "",
      number: "",
      countryCode: "",
      street: "",
      naam: "",
    },
    validationSchema: completeRegisterSchema,
    onSubmit: async (values) => {},
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      console.log("Form has errors:", errors);
      return;
    }

    setLoading(true);
    try {
      const userUpdate = await fetch(`/api/user/complete-account/${user?.id}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formik.values),
      });

      const userData = await userUpdate.json();

      dispatch(
        loadUserSuccess({
          user: userData.data,
        }),
      );
      setLoading(false);
    } catch (error: any) {
      console.error(error.message || "Something went wrong!");
      setLoading(false);
    }
  };

  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = event.target.files?.[0];
      const formData = new FormData();
      formData.append("signature", file as Blob);
      formData.append("kvk", formik.values.kboNumber);
      formData.append("eori", formik.values.eoriNumber);

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          authorization: `Bearer ${user?.accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        formik.setFieldError("kboFile", "Error uploading file.");
        return;
      }

      const data = await response.json();

      formik.setFieldValue("kboFile", data.file.path);
    } catch (error: any) {
      console.error(error.message || "Something went wrong!");
    }
  };

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

  useEffect(() => {
    let errors = { ...formik.errors };

    const validationVAT = async (numberValue: string) => {
      try {
        const response = await fetch(`/api/validation/vatNumber`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ numberValue }),
        });

        if (!response.ok) {
          errors.vatNumber = "This VAT Number is not valid.";
          return;
        }

        const data = await response.json();

        if (data.data.valid) {
          formik.setFieldValue("name", data.data.name);
          formik.setFieldValue("countryCode", data.data.countryCode);
          formik.setFieldValue("address", data.data.strAddress);
          formik.setFieldValue("city", data.data.address.city);
          formik.setFieldValue("country", data.data.address.country);
          formik.setFieldValue("zip_code", data.data.address.zip_code);
          formik.setFieldValue("number", data.data.address.number);
          formik.setFieldValue("street", data.data.address.street);
          errors.vatNumber = "";

          setIsVatValid(true);
        } else {
          errors.vatNumber = "This VAT Number is not valid.";
          setIsErrors(true);
          setIsVatValid(false);
        }
      } catch (error) {
        console.error("Error validating VAT:", error);
        setIsErrors(true);
        setIsVatValid(false);
      }
    };

    const checkEORI = async (numberValue: string) => {
      try {
        const response = await fetch("/api/validation/eori", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eori: numberValue }),
        });

        if (!response.ok) {
          errors.eoriNumber = "This EORI Number is not valid.";
          setIsErrors(true);
          return;
        }

        const data = await response.json();

        if (data.status === 200) {
          const isValid = data.data.statusDescr;

          if (isValid === "Valid") {
            errors.eoriNumber = "";
            setIsEoriValid(true);
          } else {
            errors.eoriNumber = "This EORI Number is not valid.";
            setIsErrors(true);
            setIsEoriValid(false);
          }
        } else {
          errors.eoriNumber = "This EORI Number is not valid.";
          setIsErrors(true);
          setIsEoriValid(false);
        }
      } catch (error) {
        console.error("Error validating EORI:", error);
        setIsErrors(true);
        setIsEoriValid(false);
      }
    };

    const checkKvkNumber = async (numberValue: string) => {
      try {
        const response = await fetch("/api/validation/kvkNumber", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ kvkNumber: numberValue }),
        });

        const data = await response.json();

        if (data.status === 200) {
          errors.kboNumber = "";
          setNaam(data.message.naam);
          formik.setFieldValue("naam", data.message.naam);
        } else {
          errors.kboNumber = "This KBO Number is not valid.";
          setIsErrors(true);
          setNaam("");
        }
      } catch (error) {
        console.error("Error validating EORI:", error);
        setIsErrors(true);
        setNaam("");
      }
    };

    const fetchDocument = async (
      label: string,
      numberType: keyof typeof errors,
      numberValue: string,
    ) => {
      try {
        const response = await fetch("/api/user/check-document", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [numberType]: numberValue }),
        });

        if (!response.ok) return;

        const data = await response.json();
        const newErrors = { ...errors };

        if (data.status === 200 && data.data) {
          newErrors[
            numberType
          ] = `This ${label} is already known to us. Try another one or log in to the existing account.`;
          setIsErrors(true);
        } else {
          newErrors[numberType] = "";
        }

        errors = newErrors;
      } catch (error) {
        console.error("Error fetching document:", error);
        setIsErrors(true);
      }
    };

    const validateFields = async () => {
      if (formik.values.vatNumber) {
        await validationVAT(formik.values.vatNumber);
        if (errors.vatNumber) return;
        await fetchDocument("VAT Number", "vatNumber", formik.values.vatNumber);
      }

      if (formik.values.eoriNumber) {
        await checkEORI(formik.values.eoriNumber);
        if (errors.eoriNumber) return;
        await fetchDocument(
          "EORI Number",
          "eoriNumber",
          formik.values.eoriNumber,
        );
      }

      if (formik.values.kboNumber) {
        await checkKvkNumber(formik.values.kboNumber);
        if (errors.kboNumber) return;
        await fetchDocument(
          "Commerce Number / KBO Number",
          "kboNumber",
          formik.values.kboNumber,
        );
      }
    };

    validateFields().then(() => {
      formik.setErrors(errors);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values]);

  useEffect(() => {
    if (
      formik.errors.vatNumber ||
      formik.errors.eoriNumber ||
      formik.errors.kboNumber
    ) {
      setIsErrors(true);
    } else {
      setIsErrors(false);
    }
  }, [formik.errors]);

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard page for CargoCompa" />
      </Head>
      {loading && <Loading />}
      {user?.acceptedDate === null && user?.role !== "ADMIN" ? (
        <div className="flex justify-center items-center w-full h-full">
          <form
            onSubmit={handleSubmit}
            className="flex justify-center items-center flex-col gap-4 p-4 rounded-3xl border border-neutral-100 shadow w-full md:w-1/2"
          >
            <h1 className="text-3xl font-semibold w-full mb-4">
              Complete your account
            </h1>
            <TextField
              ariaLabel={"VAT Number"}
              label="VAT Number"
              type={"text"}
              placeholder={"Enter your VAT Number"}
              value={formik.values.vatNumber}
              onChange={(e) => {
                formik.setFieldValue("vatNumber", e.target.value);
              }}
              error={formik.errors.vatNumber}
            />
            {isVatValid && (
              <div className="w-full rounded-xl p-4 border border-green-300 bg-green-100 flex flex-col gap-2.5">
                <p className="text-xl font-semibold">{formik.values.name}</p>
                <p>VAT Number {formik.values.vatNumber}</p>
                <p className="text-sm text-neutral-500">
                  {formik.values.address}, {formik.values.city},{" "}
                </p>
              </div>
            )}
            <TextField
              ariaLabel={"EORI Number"}
              label="EORI Number"
              type={"text"}
              placeholder={"Enter your EORI Number"}
              value={formik.values.eoriNumber}
              onChange={(e) => {
                formik.setFieldValue("eoriNumber", e.target.value);
              }}
              error={formik.errors.eoriNumber}
            />
            {isEoriValid && (
              <div className="w-full rounded-xl p-4 border border-green-300 bg-green-100 flex flex-col gap-2.5">
                <p className="text-xl font-semibold">EORI Number is Valid</p>
                <p>EORI Number {formik.values.eoriNumber}</p>
              </div>
            )}
            <TextField
              ariaLabel={"Commerce Number / KBO Number"}
              label="Commerce Number / KBO Number"
              type={"text"}
              placeholder={"Enter your Commerce Number / KBO Number"}
              value={formik.values.kboNumber}
              onChange={(e) => {
                formik.setFieldValue("kboNumber", e.target.value);
              }}
              error={formik.errors.kboNumber}
            />
            {naam && (
              <div className="w-full rounded-xl p-4 border border-green-300 bg-green-100 flex flex-col gap-2.5">
                <p className="text-xl font-semibold">{naam}</p>
                <p>Chamber of Commerce Number {formik.values.kboNumber}</p>
                <p className="text-sm text-neutral-500">
                  We found your company name. If this is correct, please upload
                  your Commerce Number.
                </p>
              </div>
            )}
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <label htmlFor={"upload"} className={`block text-sm font-medium`}>
                Upload Commerce Number
              </label>
              <input
                type="file"
                id="upload"
                onChange={handleUploadFile}
                name="upload"
                accept="image/png"
                className={`block w-full shadow-sm sm:text-sm rounded-lg min-h-12 bg-transparent border focus:outline-none px-4 py-2.5 border-neutral-300 text-neutral-900 dark:text-white placeholder-text-neutral-500 focus:border-blue-500`}
                placeholder="Upload Commerce Number"
                aria-label="Upload Commerce Number"
                disabled={!naam || !isEoriValid}
              />
              {formik.errors.kboFile && (
                <p className={`text-xs pl-4 text-red-500`} id="email-error">
                  {formik.errors.kboFile}
                </p>
              )}
              {formik.values.kboFile && (
                <div className="w-full rounded-xl p-4 border border-green-300 bg-green-100 flex flex-col gap-2.5">
                  <p className="text-xl font-semibold">Generate Contract</p>
                  <a
                    href={formik.values.kboFile}
                    target="_blank"
                    aria-label="Preview"
                    className="py-3 px-4 bg-blue-500 text-white rounded-lg text-center"
                  >
                    Preview
                  </a>
                </div>
              )}
            </div>
            <Button
              className={`w-full ${
                isErrors ? "cursor-not-allowed bg-neutral-500" : ""
              }`}
              type="submit"
              ariaLabel="Finish Setup"
              style="primary"
              disabled={isErrors}
            >
              Finish Setup
            </Button>
            <Button
              className="w-full"
              type="reset"
              ariaLabel="Reset"
              style="secondary"
              onClick={formik.resetForm}
            >
              Cancel
            </Button>
          </form>
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

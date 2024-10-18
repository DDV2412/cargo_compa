import Button from "@/components/button";
import TextField from "@/components/text-field";
import MainLayout from "@/layouts/main";
import { RootState } from "@/lib/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loading from "@/components/loading";
import Checkbox from "@/components/checkbox";
import { useFormik } from "formik";
import {
  createUserFailure,
  createUserStart,
  createUserSuccess,
} from "@/lib/slice/userSlice";
import { createUsersSchema } from "@/lib/yup";
import { useRouter } from "next/router";
import Head from "next/head";

const CreateUser = () => {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "",
    },
    validationSchema: createUsersSchema,
    onSubmit: async (values) => {
      try {
        dispatch(createUserStart());
        const response = await fetch("/api/user/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user?.accessToken}`,
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (data.status === 200) {
          formik.resetForm();
          dispatch(createUserSuccess(data.data));

          router.push("/settings/user-management");
        } else {
          dispatch(createUserFailure(data.message));
        }
      } catch (error: any) {
        dispatch(createUserFailure(error.message));
      }
    },
  });

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [router, user]);

  return (
    <>
      <Head>
        <title>Create User</title>
        <meta name="description" content="Create user page for CargoCompa" />
      </Head>
      {loading && <Loading />}
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 justify-between flex-wrap items-center">
          <h2 className="text-2xl text-neutral-600">Create User</h2>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-3xl flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <TextField
                label="Full Name"
                placeholder="Enter your full name"
                name="name"
                ariaLabel={"Full Name"}
                type={"text"}
                value={formik.values.name}
                onChange={(e) => formik.setFieldValue("name", e.target.value)}
                error={formik.errors.name}
              />
            </div>
            <div>
              <TextField
                label="Email"
                placeholder="Enter your email"
                name="email"
                ariaLabel={"Email"}
                type={"email"}
                value={formik.values.email}
                onChange={(e) => formik.setFieldValue("email", e.target.value)}
                error={formik.errors.email}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <TextField
                label="Phone Number"
                placeholder="Enter your phone number"
                name="phone"
                ariaLabel={"Phone Number"}
                type={"text"}
                value={formik.values.phoneNumber}
                onChange={(e) =>
                  formik.setFieldValue("phoneNumber", e.target.value)
                }
                error={formik.errors.phoneNumber}
              />
            </div>
            <div>
              <TextField
                label="Password"
                placeholder="Enter your password"
                name="password"
                ariaLabel={"Password"}
                type={"password"}
                value={formik.values.password}
                onChange={(e) =>
                  formik.setFieldValue("password", e.target.value)
                }
                error={formik.errors.password}
              />
            </div>
          </div>
          <div className="flex justify-start items-center gap-4">
            <Checkbox
              label="Admin"
              name="isAdmin"
              checked={formik.values.role === "ADMIN"}
              onChange={() => {
                formik.setFieldValue("role", "ADMIN");
              }}
              ariaLabel={"Admin"}
            />
            <Checkbox
              label="Staff"
              name="isStaff"
              checked={formik.values.role === "STAFF"}
              onChange={() => {
                formik.setFieldValue("role", "STAFF");
              }}
              ariaLabel={"Staff"}
            />
          </div>
          <div className="flex justify-start items-center gap-4 mt-4">
            <Button
              type={"button"}
              style={"secondary"}
              ariaLabel={"Cancel"}
              onClick={formik.resetForm}
            >
              Reset
            </Button>
            <Button type={"submit"} style={"primary"} ariaLabel={"Create User"}>
              Create User
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

CreateUser.getLayout = (page: React.ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default CreateUser;

import AuthLayout from "@/layouts/auth";
import Image from "next/image";
import React from "react";
import Logo from "../../assets/images/Logo.png";
import DashboardImage from "../../assets/images/Img.svg";
import TextField from "@/components/text-field";
import { useFormik } from "formik";
import Button from "@/components/button";
import { resetPasswordSchema } from "@/lib/yup";
import { useRouter } from "next/router";
import Loading from "@/components/loading";

const ResetPassword = () => {
  const [status, setStatus] = React.useState(false);
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
      code: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            referer: `${process.env.NEXTAUTH_URL}`,
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (data.status === 200) {
          setStatus(true);
          setLoading(false);
        } else {
          console.error(data.message || "Something went wrong!");
          setLoading(false);
        }
      } catch (error: any) {
        console.error(error.message || "Something went wrong!");
        setLoading(false);
      }
    },
  });
  return (
    <div className="grid lg:grid-cols-2 min-h-screen lg:overflow-hidden">
      <div className="flex h-full flex-col py-12 px-4 md:px-10 lg:pl-20 justify-start gap-20">
        {loading && <Loading />}
        <Image src={Logo} alt="CargoCompa" width={300} height={48} />

        <div className="h-full flex flex-col justify-center">
          {!status ? (
            <div className="flex  bg-white flex-col justify-center items-start w-full max-w-xl mx-auto lg:mx-0 rounded-3xl border border-neutral-200 px-8 py-11">
              <h1 className="font-bold text-3xl">Set new password</h1>
              <p className="mt-3 text-neutral-700 font-normal">
                Must be at least 8 characters long and contain a number and a
                letter
              </p>

              <form
                onSubmit={formik.handleSubmit}
                className="mt-8 w-full flex flex-col justify-start items-start gap-5"
              >
                <TextField
                  ariaLabel={"Code"}
                  label="Code"
                  type={"text"}
                  placeholder={"Enter your code"}
                  value={formik.values.code}
                  onChange={(e) => {
                    formik.setFieldValue("code", e.target.value);
                  }}
                />
                <TextField
                  ariaLabel={"Password"}
                  label="Password"
                  type={"password"}
                  placeholder={"Enter your password"}
                  value={formik.values.password}
                  onChange={(e) => {
                    formik.setFieldValue("password", e.target.value);
                  }}
                />
                <TextField
                  ariaLabel={"Confirm Password"}
                  label="Confirm Password"
                  type={"password"}
                  placeholder={"Enter your password again"}
                  value={formik.values.confirmPassword}
                  onChange={(e) => {
                    formik.setFieldValue("confirmPassword", e.target.value);
                  }}
                />
                <div className="w-full flex flex-col gap-4">
                  <Button
                    type={"submit"}
                    style={"primary"}
                    ariaLabel={"Reset Password"}
                    className="w-full"
                  >
                    Reset Password
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex  bg-white flex-col justify-center items-start w-full max-w-xl mx-auto lg:mx-0 rounded-3xl border border-neutral-200 px-8 py-11">
              <Image
                src={"/check.svg"}
                alt="CargoCompa"
                width={300}
                height={48}
                className="w-20 h-20 mx-auto"
              />

              <div className="mt-8 w-full flex flex-col justify-start items-start gap-5">
                <p className="text-neutral-700 font-normal text-center w-full">
                  Your password has been reset successfully
                </p>
                <div className="w-full flex flex-col gap-4">
                  <Button
                    type={"button"}
                    style={"primary"}
                    ariaLabel={"Reset Password"}
                    className="w-full"
                    onClick={() => {
                      router.push("/sign-in");
                    }}
                  >
                    Back to login
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hidden relative lg:flex h-full w-full justify-end items-end self-end overflow-hidden">
        <Image
          src={DashboardImage}
          alt="CargoCompa Dashboard"
          width={500}
          height={800}
          className="absolute left-0 -bottom-20 h-[95%] w-full object-cover object-left-bottom"
        />
      </div>
    </div>
  );
};

ResetPassword.getLayout = (page: React.ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
export default ResetPassword;

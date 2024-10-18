import AuthLayout from "@/layouts/auth";
import Image from "next/image";
import React from "react";
import Logo from "../../assets/images/Logo.png";
import DashboardImage from "../../assets/images/Img.svg";
import TextField from "@/components/text-field";
import { useFormik } from "formik";
import Button from "@/components/button";
import { useRouter } from "next/router";
import { forgotPasswordSchema } from "@/lib/yup";
import Loading from "@/components/loading";
import Head from "next/head";

const ForgotPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            referer: `${process.env.NEXTAUTH_URL}`,
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (data.status === 200) {
          router.push("/reset-password");
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
      <Head>
        <title>Forgot Password</title>
        <meta
          name="description"
          content="Forgot password page for CargoCompa"
        />
      </Head>
      <div className="flex h-full flex-col py-12 px-4 md:px-10 lg:pl-20 justify-start gap-20">
        {loading && <Loading />}
        <Image src={Logo} alt="CargoCompa" width={300} height={48} />
        <div className="h-full flex flex-col justify-center">
          <div className="flex  bg-white flex-col justify-center items-start w-full max-w-xl mx-auto lg:mx-0 rounded-3xl border border-neutral-200 px-8 py-11">
            <h1 className="font-bold text-3xl">Forgot Password</h1>
            <p className="mt-3 text-neutral-700 font-normal">
              No worries! Just enter your email and we will send you intructions
              to reset your password
            </p>

            <form
              onSubmit={formik.handleSubmit}
              className="mt-8 w-full flex flex-col justify-start items-start gap-5"
            >
              <TextField
                ariaLabel={"Email"}
                label="Email"
                type={"email"}
                placeholder={"Enter your email"}
                value={formik.values.email}
                onChange={(e) => {
                  formik.setFieldValue("email", e.target.value);
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

ForgotPassword.getLayout = (page: React.ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
export default ForgotPassword;

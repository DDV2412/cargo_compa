import AuthLayout from "@/layouts/auth";
import Image from "next/image";
import React, { useEffect } from "react";
import Logo from "../assets/images/Logo.png";
import DashboardImage from "../assets/images/Img.svg";
import TextField from "@/components/text-field";
import { useFormik } from "formik";
import Button from "@/components/button";
import GoogleIcon from "../assets/images/google_icon.webp";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { User } from "next-auth";
import {
  loadUserStart,
  loadUserSuccess,
  loadUserFailure,
} from "@/lib/slice/userSlice";
import Loading from "@/components/loading";
import Head from "next/head";
import { signUpSchema } from "@/lib/yup";

const SignUp = () => {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const session = useSession();
  const router = useRouter();
  const { user, error } = useSelector(
    (state: { user: { user: User; error: string } }) => state.user,
  );
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch("/api/auth/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (data.status === 200) {
          signIn("credentials", {
            email: values.email,
            password: values.password,
          });
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

  useEffect(() => {
    if (session.data?.user) {
      const getUser = async () => {
        try {
          dispatch(loadUserStart());
          const response = await fetch(`/api/user/${session?.data.user?.id}`, {
            headers: {
              authorization: `Bearer ${session?.data.accessToken}`,
            },
          });
          const data = await response.json();

          if (data.data === null) {
            return;
          } else if (data.data.emailVerified === null) {
            router.replace("/verify-account");
          } else {
            dispatch(
              loadUserSuccess({
                user: data.data,
              }),
            );

            router.replace("/");
          }
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
    <div className="grid lg:grid-cols-2 min-h-screen">
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Sign up page for CargoCompa" />
      </Head>
      <div className="flex h-full flex-col py-12 px-4 md:px-10 lg:pl-20 justify-between gap-12">
        {loading && <Loading />}
        <Image src={Logo} alt="CargoCompa" width={300} height={48} />
        <div className="h-full flex flex-col justify-center">
          <div className="flex bg-white flex-col justify-center items-start w-full max-w-xl mx-auto lg:mx-0 rounded-3xl border border-neutral-200 px-8 py-11">
            <h1 className="font-bold text-3xl">Welcome back</h1>
            <p className="mt-3 text-neutral-700 font-normal">
              Welcome back! Please enter your details.
            </p>

            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 text-sm rounded relative mt-4"
                role="alert"
              >
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form
              onSubmit={formik.handleSubmit}
              className="mt-8 w-full flex flex-col justify-start items-start gap-5"
            >
              <TextField
                ariaLabel={"Full Name"}
                label="Full Name"
                type={"text"}
                placeholder={"Enter your full name"}
                value={formik.values.name}
                onChange={(e) => {
                  formik.setFieldValue("name", e.target.value);
                }}
                error={formik.errors.name}
              />
              <TextField
                ariaLabel={"Email"}
                label="Email"
                type={"email"}
                placeholder={"Enter your email"}
                value={formik.values.email}
                onChange={(e) => {
                  formik.setFieldValue("email", e.target.value);
                }}
                error={formik.errors.email}
              />
              <TextField
                label="Password"
                ariaLabel={"Password"}
                type={"password"}
                placeholder={"********"}
                value={formik.values.password}
                onChange={(e) => {
                  formik.setFieldValue("password", e.target.value);
                }}
                error={formik.errors.password}
              />

              <div className="w-full flex flex-col gap-4">
                <Button
                  type={"submit"}
                  style={"primary"}
                  ariaLabel={"Sign In"}
                  className="w-full"
                >
                  Sign Up
                </Button>
                <Button
                  type={"button"}
                  style={"secondary"}
                  ariaLabel={"Sign In"}
                  onClick={() => signIn("google")}
                  className="w-full flex justify-center items-center gap-2"
                >
                  <Image
                    src={GoogleIcon}
                    width={24}
                    height={24}
                    alt="Google Icon"
                  />
                  Sign up with Google
                </Button>

                <div className="text-center mt-4">
                  <p className="text-sm font-normal text-neutral-700">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="text-blue-500 font-semibold text-sm hover:underline"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
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

SignUp.getLayout = (page: React.ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
export default SignUp;

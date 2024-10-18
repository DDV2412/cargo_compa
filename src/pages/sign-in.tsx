import AuthLayout from "@/layouts/auth";
import Image from "next/image";
import React, { useEffect } from "react";
import Logo from "../assets/images/Logo.png";
import DashboardImage from "../assets/images/Img.svg";
import TextField from "@/components/text-field";
import { useFormik } from "formik";
import Button from "@/components/button";
import GoogleIcon from "../assets/images/google_icon.webp";
import Checkbox from "@/components/checkbox";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "next-auth";
import { useRouter } from "next/router";
import {
  loadUserFailure,
  loadUserStart,
  loadUserSuccess,
} from "@/lib/slice/userSlice";
import Loading from "@/components/loading";

const SignIn = () => {
  const dispatch = useDispatch();
  const session = useSession();
  const router = useRouter();
  const { user, error } = useSelector(
    (state: { user: { user: User; error: string } }) => state.user,
  );
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    onSubmit: (values) => {
      setLoading(true);
      try {
        signIn("credentials", {
          email: values.email,
          password: values.password,
          remember: values.remember,
        });
        setLoading(false);
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
              referer: `${process.env.NEXTAUTH_URL}`,
              authorization: `Bearer ${session?.data.accessToken}`,
            },
          });
          const data = await response.json();

          if (data.data === null) {
            dispatch(
              loadUserFailure("User not found, please sign up or sign in!"),
            );
            router.replace("/sign-in");
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
    <div className="grid lg:grid-cols-2 min-h-screen lg:overflow-hidden">
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
                ariaLabel={"Email"}
                label="Email"
                type={"email"}
                placeholder={"Enter your email"}
                value={formik.values.email}
                onChange={(e) => {
                  formik.setFieldValue("email", e.target.value);
                }}
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
              />
              <div className="flex w-full justify-between items-center">
                <Checkbox
                  label={"Remember for 30 days"}
                  ariaLabel={"Remember for 30 days"}
                  checked={formik.values.remember}
                  onChange={() => {
                    formik.setFieldValue("remember", !formik.values.remember);
                  }}
                />
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-blue-500"
                >
                  Forgot password
                </Link>
              </div>
              <div className="w-full flex flex-col gap-4">
                <Button
                  type={"submit"}
                  style={"primary"}
                  ariaLabel={"Sign In"}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button
                  type={"button"}
                  style={"secondary"}
                  onClick={() => {
                    signIn("google");
                  }}
                  ariaLabel={"Sign In"}
                  className="w-full flex justify-center items-center gap-2"
                >
                  <Image
                    src={GoogleIcon}
                    width={24}
                    height={24}
                    alt="Google Icon"
                  />
                  Sign in with Google
                </Button>

                <div className="text-center mt-4">
                  <p className="text-sm font-normal text-neutral-700">
                    Don`t have an account?{" "}
                    <Link
                      href="/sign-up"
                      className="text-blue-500 font-semibold text-sm hover:underline"
                    >
                      Sign Up
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

SignIn.getLayout = (page: React.ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
export default SignIn;

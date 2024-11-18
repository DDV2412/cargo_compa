import AuthLayout from "@/layouts/auth";
import Image from "next/image";
import React, { useEffect } from "react";
import Logo from "../../assets/images/Logo.png";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Head from "next/head";

const VerifyNotif = () => {
  const router = useRouter();
  const session = useSession();
  const [sendMail, setSendMail] = React.useState(false);

  useEffect(() => {
    if (session.data?.user) {
      const sendToken = async () => {
        try {
          const user = session.data?.user;
          const response = await fetch(`/api/auth/verify-account`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user,
            }),
          });

          if (response.ok) {
            console.log("Email sent");
          } else {
            console.error("Failed to send email");
          }
        } catch (error) {
          console.error(error);
        }
      };

      if (!sendMail) {
        sendToken();
        setSendMail(true);
      }
    } else {
      router.push("/sign-in");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, sendMail]);

  return (
    <div className="min-h-screen lg:overflow-hidden">
      <Head>
        <title>Verify Account</title>
        <meta name="description" content="Verify account page for CargoCompa" />
      </Head>
      <div className="flex h-full flex-col py-12 px-4 md:px-10 lg:pl-20 justify-between gap-12">
        <Image src={Logo} alt="CargoCompa" width={300} height={48} />
        <div className="h-full w-full flex flex-col justify-center items-center">
          <div className="flex bg-white flex-col justify-center text-center items-start w-full max-w-xl mx-auto lg:mx-0 rounded-3xl border border-neutral-200 px-8 py-11">
            <Image
              src="/images/send-email.svg"
              alt="CargoCompa"
              width={300}
              height={48}
              priority
              className="mx-auto mb-8 max-w-40"
            />
            <h1 className="font-bold text-3xl text-center w-full">
              Verify Your Account
            </h1>
            <p className="mt-3 text-neutral-700 font-normal">
              Please check your email to continue with the account verification
              process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

VerifyNotif.getLayout = (page: React.ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};
export default VerifyNotif;

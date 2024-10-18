import type { AppProps } from "next/app";
import "../assets/styles/globals.css";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import StoreProvider from "./StoreProvider";

export default function App({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPage & { getLayout?: (page: ReactElement) => ReactNode };
}) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={pageProps.session}>
      <StoreProvider>{getLayout(<Component {...pageProps} />)}</StoreProvider>
    </SessionProvider>
  );
}

import type { AppProps } from "next/app";
import { StrictMode } from "react";
import "~/styles/welcome.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return  <StrictMode><Component {...pageProps} /></StrictMode>;
}

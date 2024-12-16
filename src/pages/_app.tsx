import type { AppProps } from "next/app";
import { StrictMode } from "react";
import "~/styles/global.css";
import "~/styles/welcome.css";
import "~/styles/form.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return  <StrictMode><Component {...pageProps} /></StrictMode>;
}

import "@/styles/globals.scss";
import "@/styles/components.scss";
import "@/styles/news.scss";
import "@/styles/contact.scss";
import Layout from "@/components/layout/layout";
import type { AppProps } from "next/app";
import { Alert } from "@mui/material";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Alert severity="warning" variant="filled">
        Deze website is onder constructie. De informatie op de website kan onjuist zijn.
      </Alert>
      <Component {...pageProps} />
    </Layout>
  );
}

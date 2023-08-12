import "@/styles/globals.scss";
import "@/styles/components.scss";
import "@/styles/news.scss";
import "@/styles/contact.scss";
import Layout from "@/components/layout/layout";
import type { AppProps } from "next/app";
import { Alert } from "@mui/material";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Layout>
        <Alert severity="error" variant="outlined">
          Deze website is onder constructie. De informatie op de website kan onjuist zijn en het kan
          zijn dat er dingen niet werken.
        </Alert>
        <Component {...pageProps} />
      </Layout>
      <Analytics />
    </>
  );
}

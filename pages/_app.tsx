import "@/styles/globals.scss";
import "@/styles/components.scss";
import "@/styles/news.scss";
import "@/styles/contact.scss";
import Layout from "@/components/layout/layout";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

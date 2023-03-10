import Navbar from "./navbar";
import Footer from "./footer";
import { ReactNode } from "react";
import { CssBaseline } from "@mui/material";
import styles from "./layout.module.scss";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <main className={styles.content}>{children}</main>
      <Footer />
    </>
  );
}

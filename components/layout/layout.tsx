import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "@/styles/theme";
import Navbar from "./navbar";
import Footer from "./footer";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <main className="content">{children}</main>
      <Footer />
    </ThemeProvider>
  );
}

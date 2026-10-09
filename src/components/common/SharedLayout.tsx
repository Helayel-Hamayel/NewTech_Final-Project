import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../../styles/common/AppLayout.css";

type SharedLayoutProps = {
  children?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
};

export default function SharedLayout({
  children,
  header,
  footer,
}: SharedLayoutProps) {
  return (
    <section>
      {header !== undefined ? header : <Header />}
      <main>{children}</main>
      {footer !== undefined ? footer : <Footer />}
    </section>
  );
}
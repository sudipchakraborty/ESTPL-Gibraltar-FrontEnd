import { Outlet } from "react-router-dom";

import Header from "../components/Header/Card_Header";
import Footer from "../components/Footer/Card_Footer";

import "./LauncherLayout.css";

function LauncherLayout() {
  return (
    <>
      <Header />

      <main className="launcher-content">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default LauncherLayout;

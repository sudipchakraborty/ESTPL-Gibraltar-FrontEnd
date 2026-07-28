import { Outlet, useLocation } from "react-router-dom";

import Header from "../components/Header/Card_Header";
import Footer from "../components/Footer/Card_Footer";
import LeftSideBar from "../components/Leftcard/Card_LeftSideBar";
import RightSideBar from "../components/Card_Right/Card_RightSideBar";

import "./MainLayout.css";

function MainLayout() {
  const { pathname } = useLocation();
  const isReportPage = pathname === "/reports";

  return (
    <div className="layout">

      <Header />

      {!isReportPage && <LeftSideBar />}

      <main className={`layout-content${isReportPage ? " layout-content--full" : ""}`}>
        <Outlet />
      </main>

      {!isReportPage && <RightSideBar />}

      <Footer />

    </div>
  );
}

export default MainLayout;

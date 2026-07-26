import { Outlet } from "react-router-dom";

import Header from "../components/Header/Card_Header";
import Footer from "../components/Footer/Card_Footer";
import LeftSideBar from "../components/Leftcard/Card_LeftSideBar";
import RightSideBar from "../components/Card_Right/Card_RightSideBar";

import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="layout">

      <Header />

      <LeftSideBar />

      <main className="layout-content">
        <Outlet />
      </main>

      <RightSideBar />

      <Footer />

    </div>
  );
}

export default MainLayout;

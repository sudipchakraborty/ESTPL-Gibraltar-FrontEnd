import { Outlet } from "react-router-dom";

import Header from "../components/Header/Card_Header";
import Footer from "../components/Footer/Card_Footer";
import AppNavigation from "../components/AppNavigation/AppNavigation";

import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="layout">

      <Header />
      <AppNavigation />
      <main className="layout-content layout-content--full">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}

export default MainLayout;

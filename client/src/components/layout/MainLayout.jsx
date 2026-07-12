import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main-content" className="flex-1 pt-16 sm:pt-18">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;

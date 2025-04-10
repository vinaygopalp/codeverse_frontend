import React from "react";
import Navbar from "./navbar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const { pathname } = useLocation();

  const hideNavbar = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

export default Layout;

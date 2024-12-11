"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";


import React, { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { checkToken } from "@/api/validations/check_cookie";
import LoaderFullScreen from "@/components/Loaders/LoaderFullScreen";
import { useAuth } from '@/context/AuthContext';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSidebar, setLoadingSidebar] = useState<boolean>(true);
  const [loadingHeader, setLoadingHeader] = useState<boolean>(true);
  const { setLoadPermissions, loadPermissions } = useAuth();
  // const [isLogged, setIsLogged] = useState(false);

  // useEffect(() => {
  //   const render = async() => {
  //     setLoadingLayout(false);
  //   };
  //   render();
  // }, []);
  useEffect(() => {
    setLoadPermissions(!loadPermissions); // Forzar la recarga de permisos
  }, []);

  useEffect(() => {
    if (!loadingSidebar && !loadingHeader) {
      setLoading(false)
    }
  },[loadingSidebar, loadingHeader])


  return (
    <html suppressHydrationWarning={true} /* className="!scroll-smooth" */ lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />

      </head>

      <body>
      {/* <!-- ===== Page Wrapper Star ===== --> */}
      <div className="flex h-screen overflow-hidden" >
        {/* <!-- ===== Sidebar Star ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setLoadingLayout={setLoadingSidebar} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area STAR ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Star ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setLoadingLayout={setLoadingHeader} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Star ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
        {loading ? (
          <LoaderFullScreen />
        ): <></>}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
      </body>
    </html>
  );
}

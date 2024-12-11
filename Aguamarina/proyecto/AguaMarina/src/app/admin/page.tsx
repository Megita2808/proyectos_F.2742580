import ECommerce from "@/components/Dashboard/E-commerce";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Dashboard Page",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

export default function Home() {
  return (
    <div>
        <ECommerce />
    </div>
  );
}
import DashboardHeader from "../components/DashboardHeader";
import DashboardNav from "../components/DashboardNav";
import React from "react";

interface ChildrenProps {
  children: React.ReactNode;
}
export default function DashboardLayout({ children }: ChildrenProps) {
  return (
    <>
      <DashboardHeader />
      <div className="dashboard">
        <DashboardNav />
        <main>{children}</main>
      </div>
    </>
  );
}

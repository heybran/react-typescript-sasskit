import Header from "../components/Header";
import React from "react";

interface ChildrenProps {
  children: React.ReactNode;
}
export default function Layout({ children }: ChildrenProps) {
  return (
    <>
      <Header />
      <div className="content">{children}</div>
    </>
  );
}

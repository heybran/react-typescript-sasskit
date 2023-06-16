import { Outlet } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import Layout from "../layouts/BaseLayout";
import Header from "../components/Header";

export default function Root() {
  return (
    <div className="content-wrapper">
      <Header />
      <Outlet />
    </div>
  );
}

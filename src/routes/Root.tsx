import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function Root() {
  return (
    <div className="content-wrapper">
      <Header />
      <Outlet />
    </div>
  );
}

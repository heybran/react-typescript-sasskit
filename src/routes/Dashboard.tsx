import DashboardHeader from "../components/DashboardHeader";
import DashboardNav from "../components/DashboardNav";
import { Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoggedIn } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/");
    }

    if (location.pathname === "/dashboard") {
      return navigate("/dashboard/account");
    }
  }, []);

  return (
    <>
      <DashboardHeader />
      <div className="dashboard">
        <DashboardNav />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

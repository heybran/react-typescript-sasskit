import { NavLink } from "react-router-dom";
import { MouseEvent } from "react";
import apiEndpoints from "../apiEndpoints";

export default function DashboardNav() {
  const handleSignout = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetch(apiEndpoints.USER_SIGNOUT, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then(() => (window.location.href = "/"))
      .catch((error) => console.error(error));
  };

  return (
    <nav className="dashboard-nav">
      <NavLink className="dashboard-nav__link" to="/dashboard/account">
        Account
      </NavLink>
      <NavLink className="dashboard-nav__link" to="/dashboard/pricing">
        Pricing
      </NavLink>
      {/* <NavLink className="dashboard-nav__link" to="/dashboard/domains">
        Domains
      </NavLink> */}
      <button className="primary-button relative" onClick={handleSignout}>
        Sign out
      </button>
    </nav>
  );
}

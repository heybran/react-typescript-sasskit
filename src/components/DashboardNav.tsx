import { NavLink } from "react-router-dom";
import Button from "./Button";

export default function DashboardNav() {
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
      <Button text="Contact Support" />
    </nav>
  );
}

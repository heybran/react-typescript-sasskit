import SignupButton from "./Signup";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import Button from "./Button";

export default function Nav() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const showDashboard = () => {
    navigate("/dashboard/account");
  };

  return (
    <nav className="interio-header__nav header-nav">
      <NavLink className="header-nav__link" to="/about">
        About
      </NavLink>
      <NavLink className="header-nav__link" to="/pricing">
        Pricing
      </NavLink>
      {user.isLoggedIn ? (
        <Button onClick={showDashboard} text="Dashboard" theme="small" />
      ) : null}
      {!user.isLoggedIn ? (
        <div className="header-nav__buttons-group">
          <NavLink className="header-nav__link" to="/login">
            Sign in
          </NavLink>
          <SignupButton />
        </div>
      ) : null}
    </nav>
  );
}

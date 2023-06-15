import SignupButton from "./Signup";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

export default function Nav() {
  const user = useUserContext();

  return (
    <nav className="interio-header__nav header-nav">
      <NavLink className="header-nav__link" to="/about">
        About
      </NavLink>
      <NavLink className="header-nav__link" to="/features">
        Features
      </NavLink>
      <NavLink className="header-nav__link" to="/pricing">
        Pricing
      </NavLink>
      {user.isLoggedIn ? (
        <NavLink className="header-nav__link" to="/account">
          Account
        </NavLink>
      ) : null}
      {!user.isLoggedIn ? <SignupButton /> : null}
    </nav>
  );
}

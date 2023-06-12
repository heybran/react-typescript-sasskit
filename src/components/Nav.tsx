// import ShoppingCart from "./ShoppingCart";
// import Notification from "./Notification";
import SignupButton from "./Signup";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="interio-header__nav header-nav">
      <Link to="/about">About</Link>
      <Link to="/pricing">Pricing</Link>
      <SignupButton />
    </nav>
  );
}

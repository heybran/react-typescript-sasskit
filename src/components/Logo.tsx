import interioLogo from "../assets/interio.svg";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="interio-header__logo">
      <img src={interioLogo} className="logo" alt="Interio logo" />
    </Link>
  );
}

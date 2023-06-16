import reactIcon from "../assets/react.svg";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="interio-header__logo">
      <div className="interio-header__logo-inner">
        <img src={reactIcon} alt="React Logo" />
      </div>
      <div className="interio-header__logo-text">
        <span>React + TypeScript</span>
        <span>SassKit</span>
      </div>
    </Link>
  );
}

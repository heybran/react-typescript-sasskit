import reactIcon from "../assets/react.svg";
import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <Link to="/" className={styles.logo}>
      <div className={styles.logoSVG}>
        <img src={reactIcon} alt="React Logo" />
      </div>
      <div className={styles.logoText}>
        <span>React TypeScript</span>
        <span>SassKit</span>
      </div>
    </Link>
  );
}

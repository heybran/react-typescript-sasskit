import Logo from "./Logo";
import Search from "./Search";
import { useEffect, useRef } from "react";
import { useUserContext } from "../context/UserContext";
import defaultAvatar from "../assets/default_avatar.svg";
import styles from "./Header.module.css";

export default function DashboardHeader() {
  const { user } = useUserContext();
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = headerRef.current as HTMLElement;
    const headerHeight = window
      .getComputedStyle(header)
      .getPropertyValue("height");
    document.body.style.setProperty("--header-height", headerHeight);
  }, []);

  return (
    <header
      ref={headerRef}
      className={styles.header + " " + styles.headerDashboard}
    >
      <Logo />
      <Search />
      <button className={styles.button}>
        <img
          src={user.avatarUrl || defaultAvatar}
          alt="User Avartar"
          crossOrigin="anonymous"
        />
        <span>{user.username}</span>
      </button>
    </header>
  );
}

import Logo from "./Logo";
import Search from "./Search";
import { useEffect, useRef } from "react";
import { useUserContext } from "../context/UserContext";
import defaultAvatar from "../assets/default_avatar.svg";

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
      className="interio-header interio-header--dashboard"
    >
      <Logo />
      <Search />
      <button className="interio-header__button-avatar">
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

import Logo from "./Logo";
import Search from "./Search";
import { useEffect, useRef } from "react";

export default function DashboardHeader() {
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
    </header>
  );
}
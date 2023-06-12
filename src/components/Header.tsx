import Logo from "./Logo";
import Search from "./Search";
import Nav from "./Nav";

export default function Header() {
  return (
    <header className="interio-header">
      <Logo />
      <Search />
      <Nav />
    </header>
  );
}

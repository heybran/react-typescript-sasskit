import ShoppingCart from "./ShoppingCart";
import Notification from "./Notification";
import { GitHubLoginButton } from "./GithubAuth";

export default function Nav() {
  return (
    <nav className="interio-header__nav header-nav">
      <ShoppingCart />
      <Notification />
      <GitHubLoginButton />
    </nav>
  );
}

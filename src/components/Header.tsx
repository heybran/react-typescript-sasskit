import Logo from "./Logo"
import Search from "./Search"
import ShoppingCart from "./ShoppingCart"
import Notification from "./Notification"
import { GitHubLoginButton } from "./GithubAuth"

export default function Header() {
  return (
    <header>
      <Logo />
      <Search />
      <ShoppingCart />
      <Notification />
      <GitHubLoginButton />
    </header>
  )
}
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { GitHubLoginButton } from "../components/GithubAuth";

export default function Register() {
  return (
    <div className="register">
      <h1>Sign Up</h1>
      <form action="POST">
        <Input
          name="username"
          labelText="Username"
          id="register-username"
          placeholder="Your username"
        />
        <Input
          name="password"
          labelText="Password"
          id="register-password"
          placeholder="Enter a password"
        />
        <Button text="Complete Sign Up" />
        <footer>
          Already have an account?
          <Link to="/login">Sign in</Link>
        </footer>
      </form>
      <div className="divider">
        <div className="divider__line divider__line-top"></div>
        <div className="divider__text">OR</div>
        <div className="divider__line divider__line-bottom"></div>
      </div>
      <GitHubLoginButton />
    </div>
  );
}

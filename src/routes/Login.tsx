import Input from "../components/Input";
import { Link } from "react-router-dom";
import { GitHubLoginButton } from "../components/GithubAuth";
import { useState, FormEvent } from "react";

export default function Login() {
  const [status, setStatus] = useState("typing");
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState<String | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const formData = new FormData(e.target as HTMLFormElement);
    const user = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          /**
            Server by default is expecting form data to be in application/x-www-form-urlencoded format,
            if missing Content-Type application/json, server will receive an empty {} of req.body
          */
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        setStatus("success");
        window.location.href = "/dashboard/account";
      } else {
        setStatus("typing");
        const serverError = await res.json();
        setError(serverError.message);
      }
    } catch (err: any) {
      setStatus("typing");
      setError(err.message ?? "Something went wrong, please try again.");
    }
  };

  return (
    <div className="register">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <Input
          name="username"
          labelText="Username"
          id="login-username"
          placeholder="Your username"
          onChange={(e) =>
            setUser({ ...user, username: e.target.value.trim() })
          }
        />
        <Input
          onChange={(e) =>
            setUser({ ...user, password: e.target.value.trim() })
          }
          name="password"
          type="password"
          labelText="Password"
          id="login-password"
          placeholder="Enter a passwor"
        />
        <button
          disabled={
            status === "submitting" ||
            user.username === "" ||
            user.password === ""
          }
          className="primary-button relative full-width"
          type="submit"
        >
          Sign In
        </button>
        {error !== null ? <p className="error">{error}</p> : null}
        <footer>
          Do not have an account?
          <Link to="/register">Sign up</Link>
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

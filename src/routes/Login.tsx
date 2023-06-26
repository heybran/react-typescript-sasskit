import Input from "../components/Input";
import { Link } from "react-router-dom";
import { GitHubLoginButton } from "../components/GithubAuth";
import { useState, FormEvent } from "react";
import Divider from "../components/Divider";
import Spinner from "../components/Spinner";

export default function Login() {
  const [status, setStatus] = useState("typing");
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState<String | null>(null);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);
  const [authError, setAuthError] = useState(null);

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

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        if (data["2fa"]) {
          setTwoFactorAuth(true);
        } else {
          window.location.href = "/dashboard/account";
        }
      } else {
        setStatus("typing");
        setError(data.message);
      }
    } catch (err: any) {
      setStatus("typing");
      setError(err.message ?? "Something went wrong, please try again.");
    }
  };

  const verifyAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerifyingAuth(true);

    try {
      const res = await fetch("/api/2fa/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          token: authCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.message);
      } else {
        window.location.href = "/dashboard/account";
      }
    } catch (err: any) {
      setAuthError(err?.message);
    } finally {
      setIsVerifyingAuth(false);
    }
  };

  return (
    <div className="register">
      <Link to="/" className="back-to-home">
        Back
      </Link>
      {twoFactorAuth ? (
        <form onSubmit={verifyAuth}>
          <h1>Two Factor Authentication</h1>
          <Input
            name="auth"
            type="text"
            labelText="Auth Code"
            id="auth"
            placeholder="Auth Code"
            onChange={(e) => setAuthCode(e.target.value)}
          />
          {authError ? <p className="error">{authError} </p> : null}
          <button
            disabled={authCode === ""}
            className="primary-button relative full-width"
            type="submit"
          >
            Confirm
            {isVerifyingAuth ? <Spinner /> : null}
          </button>
        </form>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
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
              placeholder="Your password"
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
          <Divider />
          <GitHubLoginButton />
        </>
      )}
    </div>
  );
}

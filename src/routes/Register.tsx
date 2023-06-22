import Input from "../components/Input";
import { Link } from "react-router-dom";
import { GitHubLoginButton } from "../components/GithubAuth";
import { useState, KeyboardEvent, FormEvent } from "react";

type ServerError = {
  message: string;
  [key: string]: unknown;
};

export default function Register() {
  const [isVerifyingUsername, setIsVerifyingUsername] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [status, setStatus] = useState("typing");
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState<ServerError | null>(null);

  let timeout: ReturnType<typeof setTimeout>;
  const debounce = (e: KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setIsVerifyingUsername(true);
      verifyUsername(input.value.trim());
    }, 500);
  };

  const verifyUsername = async (username: string) => {
    // need to clear out error message
    setUsernameExists(false);
    const res = await fetch(`/api/user/${username}`);
    if (res.ok) {
      // this user exits in database
      setUsernameExists(true);
    } else {
      setUsernameExists(false);
    }

    setIsVerifyingUsername(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    const formData = new FormData(e.target as HTMLFormElement);
    const user = Object.fromEntries(formData.entries());
    try {
      await fetch("/api/user/create", {
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
      setStatus("success");
      window.location.href = "/dashboard/account";
    } catch (error) {
      setStatus("typing");
      setError(error as ServerError);
    }
  };

  return (
    <div className="register">
      <h1>Sign Up</h1>
      <Link to="/" className="back-to-home">
        Back
      </Link>
      <form onSubmit={handleSubmit}>
        <Input
          name="username"
          labelText="Username"
          id="register-username"
          placeholder="Your username"
          spinner={isVerifyingUsername ? true : false}
          onKeyUp={debounce}
          onChange={(e) =>
            setUser({ ...user, username: e.target.value.trim() })
          }
          errorMessage={
            usernameExists ? (
              <span className="input-field__error">
                Username already exists.
              </span>
            ) : null
          }
        />
        <Input
          onChange={(e) =>
            setUser({ ...user, password: e.target.value.trim() })
          }
          name="password"
          labelText="Password"
          id="register-password"
          placeholder="Enter a password"
        />
        <button
          disabled={
            isVerifyingUsername ||
            usernameExists ||
            status === "submitting" ||
            user.username === "" ||
            user.password === ""
          }
          className="primary-button relative full-width"
          type="submit"
        >
          Complete Sign Up
        </button>
        {error !== null && <p className="error">{error.message}</p>}
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

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GITHUB_CLIENT_ID = "0b3d7ed9ff20b068f060";
const GITHUB_CALLBACK_URL = "http://localhost:5173/auth/github/callback";
const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_url=${GITHUB_CALLBACK_URL}&scope=user`;

const GitHubLoginButton = () => {
  const handleLogin = () => {
    window.location.href = githubOAuthURL;
  };

  return <button onClick={handleLogin}>Signin with GitHub</button>;
};

const GitHubAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
        return console.error(`code is missing`);
      }

      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/api/auth/github/callback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        },
      );

      if (res.status === 200) {
        const data = await res.json();
        // Save the access token to local storage or a cookie
        localStorage.setItem("access_token", data.access_token);
        // Why this code still runs after res.status(500)?
        // that was because inside server.js, it didn't throw any error,
        // res.status(500).json({ error: error.message });
        navigate("/");
      } else {
        console.error("something wrong");
      }
    })();
  }, []);

  return <div>Authenticating...</div>;
};

export { GitHubLoginButton, GitHubAuth };

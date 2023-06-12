import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GITHUB_CLIENT_ID = "0b3d7ed9ff20b068f060";
const GITHUB_CALLBACK_URL = "http://localhost:5173/auth/github/callback";
const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_url=${GITHUB_CALLBACK_URL}&scope=user`;

const GitHubLoginButton = () => {
  const handleLogin = () => {
    window.location.href = githubOAuthURL;
  };

  return (
    <button
      className="header-nav__button header-nav__button--signin"
      onClick={handleLogin}
    >
      Signin
    </button>
  );
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
        const { access_token } = await res.json();
        // https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#3-use-the-access-token-to-access-the-api
        const userRes = await fetch(`https://api.github.com/user`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          const { login, avatar_url } = userData;
          localStorage.setItem("interioUserame", login);
          localStorage.setItem("interioAvatarUrl", avatar_url);
          navigate("/");
        } else {
          console.error(userRes.statusText);
        }
      } else {
        console.error(res.statusText);
      }
    })();
  }, []);

  return <div>Authenticating...</div>;
};

export { GitHubLoginButton, GitHubAuth };

import { useEffect } from "react";

const GITHUB_CLIENT_ID = "0b3d7ed9ff20b068f060";
const GITHUB_CALLBACK_URL = location.origin + "/auth/github/callback";
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
  useEffect(() => {
    (async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
        return console.error(`code is missing`);
      }

      const res = await fetch("/api/auth/github/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

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
          const username = userData.login;
          const avatarUrl = userData.avatar_url;
          fetch("/api/user/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              avatarUrl,
            }),
          })
            // .then(() => (location.href = "/dashboard/account"))
            .catch((error) => console.error(error));
        } else {
          console.error(userRes.statusText);
        }
      } else {
        console.error(res.statusText);
      }
    })();
  }, []);

  return <div className="authenticating">Authenticating...</div>;
};

export { GitHubLoginButton, GitHubAuth };

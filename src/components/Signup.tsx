const GITHUB_CLIENT_ID = "0b3d7ed9ff20b068f060";
const GITHUB_CALLBACK_URL = location.origin + "/auth/github/callback";

const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&scope=user`;

const SignupButton = () => {
  const handleSignup = () => {
    window.location.href = githubOAuthURL;
  };

  return (
    <button
      className="header-nav__button header-nav__button--signin"
      onClick={handleSignup}
    >
      Start Free Trial
    </button>
  );
};

export default SignupButton;

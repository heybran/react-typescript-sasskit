const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${
  import.meta.env.VITE_GITHUB_CLIENT_ID
}&redirect_url=${import.meta.env.VITE_GITHUB_CALLBACK_URL}&scope=user`;

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

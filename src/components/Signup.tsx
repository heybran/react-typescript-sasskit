import { useNavigate } from "react-router-dom";

const SignupButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="header-nav__button header-nav__button--signin"
      onClick={() => navigate("/register")}
    >
      Get Started
    </button>
  );
};

export default SignupButton;

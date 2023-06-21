import SignupButton from "./Signup";
import buildingWebsitesSVG from "../assets/building_websites.svg";
import { useUserContext } from "../context/UserContext";

export default function HeroSection() {
  const { user } = useUserContext();

  return (
    <div className="hero">
      <div className="hero__content">
        <h1 className="hero__heading">A modern way to build websites.</h1>
        <p className="hero__paragraph">
          Empower designers to build professional, custom websites in a
          completely visual canvas with no code.
        </p>
        {!user.isLoggedIn ? <SignupButton /> : null}
      </div>
      <div className="hero__presentation">
        <img src={buildingWebsitesSVG} alt="Building Websites Illustrationi" />
        <span className="sr-only">
          A illustration provided by https://undraw.co/
        </span>
      </div>
    </div>
  );
}

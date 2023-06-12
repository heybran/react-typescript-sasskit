import SignupButton from "./Signup";

export default function HeroSection() {
  return (
    <div className="hero">
      <h1 className="hero_heading">A modern way to build websites.</h1>
      <p className="hero_paragraph">
        Empower designers to build professional, custom websites in a completely
        visual canvas with no code.
      </p>
      <SignupButton />
    </div>
  );
}

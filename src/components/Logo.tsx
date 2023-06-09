import interioLogo from "../assets/interio.svg";

export default function Logo() {
  return (
    <a href="/" className="logo">
      <img src={interioLogo} className="logo" alt="Interio logo" />
    </a>
  );
}
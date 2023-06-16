import webDevelopmentSVG from "../assets/web_development.svg";

export default function About() {
  return (
    <div className="about">
      <div className="about__copy">
        <h1>We believe creating websites should be a lot easier.</h1>
        <p>
          Sure, here's a short description you can use: Our product is a modern
          website builder that empowers designers to create professional, custom
          websites without writing a single line of code. With our completely
          visual canvas, you can easily bring your website ideas to life and
          create stunning designs that will impress your clients and visitors
          alike. Say goodbye to the limitations of traditional website builders
          and hello to a new era of web design.
        </p>
      </div>
      <div className="about__presentation">
        <img src={webDevelopmentSVG} alt="Web Development  Illustration" />
        <span className="sr-only">
          A illustration provided by https://undraw.co/
        </span>
      </div>
    </div>
  );
}

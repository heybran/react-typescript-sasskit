import PricingCard from "../components/PricingCard";

export default function Pricing() {
  return (
    <div className="pricing">
      <h1>Pricing</h1>
      <p>Choose the plan that suits you</p>
      <div className="plans">
        <PricingCard plan="free" />
        <PricingCard plan="standard" />
        <PricingCard plan="premium" />
      </div>
    </div>
  );
}

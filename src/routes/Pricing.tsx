import Layout from "../layouts/BaseLayout";
import PricingCard from "../components/PricingCard";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Pricing({ dashboard }: { dashboard?: boolean }) {
  const content = (
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

  if (!dashboard) {
    return <Layout>{content}</Layout>;
  } else {
    return <DashboardLayout>{content}</DashboardLayout>;
  }
}

import { useUserContext } from "../context/UserContext";
import Button from "./Button";
import SignupButton from "./Signup";

export default function PricingCard({ plan }: { plan: string }) {
  const { user } = useUserContext();

  return (
    <div className="plan">
      <div className="plan__details">
        <div className="plan__name">{plan}</div>
        <div className="plan__description">
          {plan.trim() === "free"
            ? "For individual or teams looking to organize anything."
            : plan.trim() === "standard"
            ? "For teams that need to manage more work."
            : "Best for teams that need to track multiple projects."}
        </div>
      </div>
      <div className="plan__price">
        {plan.trim() === "free"
          ? "Free"
          : plan.trim() === "standard"
          ? "$5.00 / month"
          : "$10.00 / month"}
      </div>
      {user.isLoggedIn ? (
        <Button
          text={plan.trim() === "free" ? "Current plan" : "Upgrade"}
          theme={plan.trim() === "free" ? "disabled" : ""}
        />
      ) : (
        <SignupButton />
      )}
    </div>
  );
}

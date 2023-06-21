import { useState } from "react";
import { User, useUserContext } from "../context/UserContext";
import SignupButton from "./Signup";
import Spinner from "./Spinner";

export default function PricingCard({ plan }: { plan: User["subscription"] }) {
  const { user, setUser } = useUserContext();
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  const changePlan = async () => {
    setIsChangingPlan(true); // we want to show a spinner inside the button

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // TODO: It will be easier if we can store the user id into our userContext
        // so when we need to update user info, send along user id
        body: JSON.stringify({ username: user.username, subscription: plan }),
      });

      if (res.ok) {
        setUser({ ...user, subscription: plan });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsChangingPlan(false);
    }
  };

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
        <button
          className={
            "primary-button relative " +
            (plan.trim() === user.subscription ? "disabled" : "")
          }
          onClick={changePlan}
        >
          {plan.trim() === user.subscription ? "Current plan" : "Upgrade"}
          {isChangingPlan ? <Spinner /> : null}
        </button>
      ) : (
        <SignupButton />
      )}
    </div>
  );
}

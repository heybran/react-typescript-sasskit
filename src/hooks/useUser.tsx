import { useEffect, useState } from "react";
import { User } from "../context/UserContext";

export default function useUser() {
  const [user, setUser] = useState<User>({
    username: "",
    avatarUrl: "",
    password: false,
    isLoggedIn: false,
    subscription: "free",
    twoFactorAuth: false,
  });

  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/user`, {
          credentials: "include",
        });

        const user = await res.json();
        const { username, avatarUrl, subscription, password } = user;
        setUser({
          ...user,
          username,
          avatarUrl,
          subscription,
          password,
          isLoggedIn: true,
          twoFactorAuth: user["2fa"],
        });
      } catch (error) {
        setUser({
          ...user,
          username: "",
          avatarUrl: "",
          subscription: "free",
          password: false,
          isLoggedIn: false,
          twoFactorAuth: false,
        });
      } finally {
        setIsPending(false);
      }
    })();
  }, []);

  return { isPending, user, setUser };
}

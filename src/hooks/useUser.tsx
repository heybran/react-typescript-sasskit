import { useEffect, useState } from "react";
import { User } from "../context/UserContext";

export default function useUser() {
  const [user, setUser] = useState<User>({
    username: "",
    avatarUrl: "",
    password: false,
    isLoggedIn: false,
    subscription: "free",
  });

  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/user`, {
          credentials: "include",
        });

        const { username, avatarUrl, subscription, password } =
          await res.json();
        setUser({
          ...user,
          username,
          avatarUrl,
          subscription,
          password,
          isLoggedIn: true,
        });
      } catch (error) {
        setUser({
          ...user,
          username: "",
          avatarUrl: "",
          subscription: "free",
          password: false,
          isLoggedIn: false,
        });
      } finally {
        setIsPending(false);
      }
    })();
  }, []);

  return { isPending, user, setUser };
}

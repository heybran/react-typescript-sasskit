import { useEffect, useState } from "react";
import { User } from "../context/UserContext";

export default function useUser() {
  const [user, setUser] = useState<User>({
    username: "",
    avatarUrl: "",
    password: "",
    isLoggedIn: false,
  });

  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/user`, {
          credentials: "include",
        });

        const { username, avatarUrl } = await res.json();
        setUser({
          ...user,
          username,
          avatarUrl,
          isLoggedIn: true,
        });
      } catch (error) {
        setUser({
          ...user,
          username: "",
          avatarUrl: "",
          isLoggedIn: false,
        });
      } finally {
        setIsPending(false);
      }
    })();
  }, []);

  return { isPending, user, setUser };
}

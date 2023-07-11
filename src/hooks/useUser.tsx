import { useEffect, useState } from "react";
import { User } from "../context/UserContext";
import apiEndpoints from "../apiEndpoints";
import { isResponseJson } from "../util.ts";

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
    fetch(apiEndpoints.USER_COOKIE, { credentials: "include" })
      .then(async (res) => {
        const data = isResponseJson(res) ? await res.json() : null;

        if (!res.ok) {
          return Promise.reject(data);
        }

        const { username, avatarUrl, subscription, password, twoFactorAuth } =
          data;
        setUser({
          ...user,
          username,
          avatarUrl,
          subscription,
          password,
          isLoggedIn: true,
          twoFactorAuth,
        });
        setIsPending(false);
      })
      .catch((error) => {
        console.log(error);
        setIsPending(false);
      });
  }, []);

  return { isPending, user, setUser };
}

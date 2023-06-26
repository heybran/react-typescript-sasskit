import { Dispatch, SetStateAction, createContext, useContext } from "react";

export interface User {
  username: string;
  avatarUrl: string;
  password: boolean;
  isLoggedIn: boolean;
  subscription: "free" | "standard" | "premium";
  twoFactorAuth: boolean;
}

interface UserContextProps {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

export const UserContext = createContext<UserContextProps | undefined>(
  undefined,
);

/**
 * Returns the user object from the UserContext.
 * @throws Will throw an error if UserContext is not provided
 * @returns {User} The user objec from the UserContext.
 */
export function useUserContext() {
  const data = useContext(UserContext);

  if (data === undefined) {
    throw new Error("useUserContext must be used with a UserContext");
  }

  const { user, setUser } = data;
  return { user, setUser };
}

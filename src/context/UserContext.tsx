import { createContext, useContext } from "react";

export interface User {
  username: string;
  avatarUrl: string;
  isLoggedIn: boolean;
}

export const UserContext = createContext<User | undefined>(undefined);

/**
 * Returns the user object from the UserContext.
 * @throws Will throw an error if UserContext is not provided
 * @returns {User} The user objec from the UserContext.
 */
export function useUserContext() {
  const user = useContext(UserContext);

  if (user === undefined) {
    throw new Error("useUserContext must be used with a UserContext");
  }

  return user;
}

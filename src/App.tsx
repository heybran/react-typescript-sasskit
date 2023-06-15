import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./routes/Home.tsx";
import { GitHubAuth } from "./components/GithubAuth.tsx";
import useUser from "./hooks/useUser.tsx";
import { User, UserContext } from "./context/UserContext.tsx";
import About from "./routes/About.tsx";
import Account from "./routes/Account.tsx";
import "./index.css";

interface ProtectedRouteProps {
  user: User;
  redirectPath: string;
  children: ReactNode;
}

const ProtectedRoute = ({
  user,
  redirectPath,
  children,
}: ProtectedRouteProps) => {
  if (!user.isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default function App() {
  const { isPending, user } = useUser();

  return (
    <div className={isPending ? "content-wrapper hidden" : "content-wrapper"}>
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute user={user} redirectPath="/">
                <Account />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/github/callback" element={<GitHubAuth />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

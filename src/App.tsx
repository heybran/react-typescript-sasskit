import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./routes/Home.tsx";
import { GitHubAuth } from "./components/GithubAuth.tsx";
import useUser from "./hooks/useUser.tsx";
import { User, UserContext } from "./context/UserContext.tsx";
import About from "./routes/About.tsx";
import Account from "./routes/Account.tsx";
import Pricing from "./routes/Pricing.tsx";
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

  if (!isPending) {
    return (
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route
            path="/dashboard/account"
            element={
              <ProtectedRoute user={user} redirectPath="/">
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pricing"
            element={
              <ProtectedRoute user={user} redirectPath="/">
                <Pricing dashboard={true} />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/github/callback" element={<GitHubAuth />} />
        </Routes>
      </UserContext.Provider>
    );
  }
}

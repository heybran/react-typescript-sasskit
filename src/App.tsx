import { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Root from "./routes/Root.tsx";
import { GitHubAuth } from "./components/GithubAuth.tsx";
import useUser from "./hooks/useUser.tsx";
import { User, UserContext } from "./context/UserContext.tsx";
import About from "./routes/About.tsx";
import Account from "./routes/Account.tsx";
import Pricing from "./routes/Pricing.tsx";
import Layout from "./layouts/BaseLayout.tsx";
import Home from "./routes/Home.tsx";
import "./index.css";
import Dashboard from "./routes/Dashboard.tsx";

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
          <Route path="/" element={<Root />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="pricing" element={<Pricing />} />
          </Route>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="account" element={<Account />} />
            <Route path="pricing" element={<Pricing />} />
          </Route>
          <Route path="/auth/github/callback" element={<GitHubAuth />} />
        </Routes>
      </UserContext.Provider>
    );
  }
}

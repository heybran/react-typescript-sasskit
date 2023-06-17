import { Routes, Route } from "react-router-dom";
import Root from "./routes/Root.tsx";
import { GitHubAuth } from "./components/GithubAuth.tsx";
import useUser from "./hooks/useUser.tsx";
import { UserContext } from "./context/UserContext.tsx";
import About from "./routes/About.tsx";
import Account from "./routes/Account.tsx";
import Pricing from "./routes/Pricing.tsx";
import Home from "./routes/Home.tsx";
import "./index.css";
import Dashboard from "./routes/Dashboard.tsx";
import Register from "./routes/Register.tsx";

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
          <Route path="/register" element={<Register />} />
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

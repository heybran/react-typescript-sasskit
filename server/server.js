import express from "express";
import cors from "cors";
import cookirParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import {
  createAndStoreTempSecret,
  verifyClientToken,
  deleteTwoFactorAuth,
  loginWithTwoFactorAuth,
} from "./controllers/twoFactorController.js";

import {
  checkLoginCookie,
  checkAvailableUsername,
  userSignUp,
  userUpdate,
  userSignOut,
  userLogin,
  verifyCurrentPassword,
  userDelete,
} from "./controllers/userController.js";

import { handleGitHubAuth } from "./controllers/githubController.js";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: [
      "set-cookie",
      "Content-Type",
      "Acess-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
    ],
  }),
);

app.use(express.json());

app.use(cookirParser(jwtSecret));

// Serve static files from the ./build folder
app.use(express.static("build"));

// Server index.html for all non-api routes
app.get(/^((?!\/api\/).)*$/, async (req, res) => {
  const indexPath = path.resolve(process.cwd(), "build", "index.html");
  res.sendFile(indexPath);
});

// 2FA
app.post("/api/2fa/create", createAndStoreTempSecret);
app.post("/api/2fa/verify", verifyClientToken);
app.post("/api/2fa/delete", deleteTwoFactorAuth);
app.post("/api/2fa/login", loginWithTwoFactorAuth);

app.get("/api/user", checkLoginCookie);
app.get("/api/user/:username", checkAvailableUsername);
app.post("/api/user/signout", userSignOut);

// curl -X POST -H "Content-Type: application/json" -d '{"username":"test1","password":"123","avatarUrl":"123"}' http://localhost:5000/api/user/create
app.post("/api/user/create", userSignUp);
app.post("/api/user/update", userUpdate);
app.post("/api/user/login", userLogin);
app.post("/api/user/verify-password", verifyCurrentPassword);
app.post("/api/user/delete", userDelete);

// GitHub Auth
app.post("/api/auth/github/callback", handleGitHubAuth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

import express from "express";
import cors from "cors";
import cookirParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import apiRoutes from "./shared/apiRoutes.json" assert { type: "json" };
import {
  enableTwoFactorAuth,
  verifyTwoFactorAuth,
  disableTwoFactorAuth,
  loginWithTwoFactorAuth,
} from "./controllers/twoFactorController.js";

import {
  handleUserLoginCookie,
  handleAvailableUsername,
  handleUserLogin,
  handleUserDelete,
  handleUserSignUp,
  handleUserUpdate,
  handleUserSignOut,
  handleVerifyPassword,
} from "./controllers/userController.js";

import { handleGitHubAuth } from "./controllers/githubController.js";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const app = express();

app.use(
  cors({
    origin: /*process.env.CLIENT_URL*/ "*",
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

// Two-Factor Authentication
app.post(apiRoutes.TWO_FACTOR_AUTH_ENABLE, enableTwoFactorAuth);
app.post(apiRoutes.TWO_FACTOR_AUTH_VERIFY, verifyTwoFactorAuth);
app.post(apiRoutes.TWO_FACTOR_AUTH_DISABLE, disableTwoFactorAuth);
app.post(apiRoutes.TWO_FACTOR_AUTH_LOGIN, loginWithTwoFactorAuth);

app.get(apiRoutes.USER_COOKIE, handleUserLoginCookie);
app.get(apiRoutes.USER_AVAILABLE_NAME, handleAvailableUsername);
app.post(apiRoutes.USER_SIGNOUT, handleUserSignOut);
app.post(apiRoutes.USER_SIGNUP, handleUserSignUp);
app.post(apiRoutes.USER_UPDATE, handleUserUpdate);
app.post(apiRoutes.USER_LOGIN, handleUserLogin);
app.post(apiRoutes.USER_VERIFY_PASSWORD, handleVerifyPassword);
app.post(apiRoutes.USER_DELETE, handleUserDelete);

// GitHub Auth
app.post(apiRoutes.GITHUB_AUTH_CALLBACK, handleGitHubAuth);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

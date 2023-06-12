import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import saveUser from "./db/database.js";
dotenv.config();

const secret = process.env.JWT_SECRET;
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

app.get("/api/test", async (req, res) => {
  const authToken = jwt.sign({ id: 123, name: "brandon" }, secret);
  res.cookie("authToken", authToken, {
    path: "/",
    maxAge: 24 * 60 * 60 * 1000 * 30,
    httpOnly: true,
  });

  res.sendStatus(200);
});

app.post("/api/auth/github/callback", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await fetch(
      `https://github.com/login/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
        timeout: 15000,
      },
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error_description);
    }

    res.json({ access_token: data.access_token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

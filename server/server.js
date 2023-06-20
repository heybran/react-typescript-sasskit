import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookirParser from "cookie-parser";
import path from "path";
import { createUser, getUser, updateUser, deleteUser } from "./user.js";
import bcrypt from "bcrypt";

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

app.use(cookirParser(secret));

// Serve static files from the ./build folder
app.use(express.static("build"));

// Server index.html for all non-api routes
app.get(/^((?!\/api\/).)*$/, async (req, res) => {
  const indexPath = path.resolve(process.cwd(), "build", "index.html");
  res.sendFile(indexPath);
});

app.get("/api/user", async (req, res) => {
  const userCookie = req.cookies.user;
  if (!userCookie) {
    res.status(401).send("Unauthorized");
    return;
  }

  jwt.verify(userCookie, secret, async (err, decoded) => {
    if (err) {
      console.error(`Error verify user JWT cookir`, err);
      res.status(401).send("Unauthorized");
    } else {
      // here decoded is string, username where we stored in cookie
      // at /api/user/create route
      const user = await getUser({ username: decoded });
      res.status(200).json({
        username: user[0].username,
        avatarUrl: user[0].avatarUrl,
      });
    }
  });

  /**
   * If no user found: _RecordArray(0) []
   * If user exists in database
    _RecordArray(1) [
      {
        avatarUrl: 'https://avatars.githubusercontent.com/u/75633537?v=4',
        id: 'rec_ci6mp943g23ng9c5g5gg',
        password: '',
        username: 'heybran',
        xata: {
          createdAt: 2023-06-17T08:19:48.960Z,
          updatedAt: 2023-06-17T08:19:48.960Z,
          version: 0
        }
      }
    ]
   */
  // const user = await getUser({ username: "heybran" });
});

app.get("/api/user/:username", async (req, res) => {
  const { username } = req.params;
  const user = await getUser({ username: username });

  // this username already exists in database
  if (user.length) {
    res.status(200).json({ user: user[0] });
  } else {
    res.status(404).json({
      error: {
        message: "no this user",
      },
    });
  }
});

app.post("/api/user/signout", async (req, res) => {
  res.clearCookie("user");
  res.status(200).send({ message: "Coolied cleared" });
});

// curl -X POST -H "Content-Type: application/json" -d '{"username":"test1","password":"123","avatarUrl":"123"}' http://localhost:5000/api/user/create
app.post("/api/user/create", async (req, res) => {
  /** @type {import('./user.js').User} */
  const user = req.body;
  user.password = await bcrypt.hash(user.password, 10);

  const create = await createUser({
    password: "",
    avatarUrl: "",
    ...user,
  });

  console.log(create);
  if (create.errors) {
    res.status(500).json({ error: create.errors[0] });
    return;
  }

  console.log("user created");
  const userCookie = jwt.sign(user.username, secret);
  res.cookie("user", userCookie, {
    path: "/",
    maxAge: 24 * 60 * 60 * 1000 * 30,
    httpOnly: true,
  });

  res.sendStatus(200);
});

app.post("/api/user/update", async (req, res) => {
  const body = req.body;
  const user = await getUser({ username: body.username });
  const update = await updateUser({
    id: user[0].id,
    avatarUrl: body.avatarUrl,
    password: body.password,
  });

  if (update.errors) {
    res.status(500).json({ error: create.errors?.[0] });
  } else {
    res.status(200).json({ message: "user updated" });
  }
});

app.post("/api/auth/github/callback", async (req, res) => {
  const { code } = req.body;

  /**
   * during development, this error happens quite a lot
   TypeError: fetch failed
      at Object.fetch (node:internal/deps/undici/undici:14294:11)
      at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
      at async file:///Users/brandon/codes/interio-react-app/server/server.js:66:22 {
    cause: ConnectTimeoutError: Connect Timeout Error
        at onConnectTimeout (node:internal/deps/undici/undici:8087:28)
        at node:internal/deps/undici/undici:8045:50
        at Immediate._onImmediate (node:internal/deps/undici/undici:8076:13)
        at process.processImmediate (node:internal/timers:471:21) {
      code: 'UND_ERR_CONNECT_TIMEOUT'
    }
  }
   */
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
        timeout: 50000,
      },
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error_description);
    }

    res.json({ access_token: data.access_token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

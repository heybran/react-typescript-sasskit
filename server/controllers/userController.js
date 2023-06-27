import { createUser, getUser, updateUser, deleteUser } from "../user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

/**
 * Checkes httpOnly cookie sent from client against database, if any
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const checkLoginCookie = async (req, res) => {
  const userCookie = req.cookies.user;
  if (!userCookie) {
    res.status(401).send("Unauthorized");
    return;
  }

  jwt.verify(userCookie, jwtSecret, async (err, decoded) => {
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
        password: Boolean(user[0].password),
        subscription: user[0].subscription,
        "2fa": user[0]["2fa"],
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
};

/**
 * Checkes available username when user signup, single field validation
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const checkAvailableUsername = async (req, res) => {
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
};

/**
 * Creates a new user and stored that in database
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const userSignUp = async (req, res) => {
  /** @type {import('./user.js').User} */
  const user = req.body;
  if (user.source !== "github") {
    user.password = await bcrypt.hash(user.password, 10);
  }

  const create = await createUser({
    password: "",
    avatarUrl: "",
    ...user,
  });

  if (create.errors) {
    res.status(500).json({ error: create.errors[0] });
    return;
  }

  const userCookie = jwt.sign(user.username, jwtSecret);
  res.cookie("user", userCookie, {
    path: "/",
    maxAge: 24 * 60 * 60 * 1000 * 30,
    httpOnly: true,
  });

  res.sendStatus(200);
};

/**
 * Updates a user
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const userUpdate = async (req, res) => {
  const body = req.body;
  const user = await getUser({ username: body.username });

  const updateData = {
    id: user[0].id,
  };

  if (body.password) {
    body.password = await bcrypt.hash(user[0].password, 10);
    updateData.password = body.password;
  }

  if (body.avatarUrl) {
    updateData.avatarUrl = body.avatarUrl;
  }

  if (body.subscription) {
    updateData.subscription = body.subscription;
  }

  const update = await updateUser(updateData);

  if (update.errors) {
    res.status(500).json({ error: create.errors?.[0] });
  } else {
    res.status(200).json({ message: "user updated" });
  }
};

/**
 * Signs out an user by clearing cookie
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const userSignOut = async (req, res) => {
  res.clearCookie("user");
  res.status(200).send({ message: "Coolied cleared" });
};

/**
 * Logins a user
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const userLogin = async (req, res) => {
  const userSent = req.body;
  const user = await getUser({ username: userSent.username });
  // this username already exists in database
  if (!user.length) {
    res.status(404).json({ message: "This user does not exist." });
    return;
  }

  const match = await bcrypt.compare(userSent.password, user[0].password);
  if (!match) {
    res.status(404).json({
      message: "Wrong password, please try again.",
    });
    return;
  }

  if (!user[0]["2fa"]) {
    const userCookie = jwt.sign(userSent.username, jwtSecret);
    res.cookie("user", userCookie, {
      path: "/",
      maxAge: 24 * 60 * 60 * 1000 * 30,
      httpOnly: true,
    });
  }

  res.status(200).json({
    message: "log in success",
    "2fa": user[0]["2fa"],
  });
};

/**
 * Verifies current password when user tries to change password
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const verifyCurrentPassword = async (req, res) => {
  const userSent = req.body;
  const user = await getUser({ username: userSent.username });
  const match = await bcrypt.compare(userSent.password, user[0].password);
  if (!match) {
    // current password entered by user does not match the one in database
    res.status(401).json({
      message: "Current password is not correct.",
    });
    return;
  }

  res.status(200).json({
    message: "Current password is correct.",
  });
};

/**
 * Deletes a user from database
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const userDelete = async (req, res) => {
  const { username } = req.body;
  /** @type{import('./types.js').User}*/
  const user = await getUser({ username });
  /** @type{import('./types.js').User | null}*/
  const deleteData = await deleteUser(user[0].id);
  if (!deleteData) {
    res.status(422).json({ message: "User account could not be deleted." });
    return;
  }

  res.clearCookie("user");
  res.status(200).json({ message: "User deleted." });
};

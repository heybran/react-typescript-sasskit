// @ts-check
import { createUser, getUser, updateUser, deleteUser } from "../user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ProblemDetails from "../problemDetails.js";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

/**
 * Checkes httpOnly cookie sent from client against database, if any
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const handleUserLoginCookie = async (req, res) => {
  const userCookie = req.cookies.user;
  if (!userCookie) {
    return res.status(401).json(
      new ProblemDetails({
        type: "about:blank",
        title: "Unauthorized",
        status: 401,
        detail: "No session cookie is found on client.",
        instance: req.url,
      }),
    );
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
export const handleAvailableUsername = async (req, res) => {
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
export const handleUserSignUp = async (req, res) => {
  /** @type {import('../types.js').User} */
  const user = req.body;
  if (user.source !== "github") {
    user.password = await bcrypt.hash(user.password, 10);
  } else {
    // as as of right now, no source column is added in database.
    delete user.source;
  }

  try {
    const create = await createUser({
      password: "",
      avatarUrl: "",
      ...user,
    });

    /*
      {
        '2fa': false,
        avatarUrl: '123',
        id: 'rec_cihnsu5ep9elrjpa22a0',
        password: '$2b$10$AAYnxORLabOYxdOUt6/BYulYHqsxDZEAL9v1VbdCZz7IBJQqOQ3FO',
        subscription: 'free',
        username: 'hello3',
        xata: {
          createdAt: 2023-07-04T02:05:44.821Z,
          updatedAt: 2023-07-04T02:05:44.821Z,
          version: 0
        }
      }
    */

    const userCookie = jwt.sign(user.username, jwtSecret);
    res
      .cookie("user", userCookie, {
        path: "/",
        maxAge: 24 * 60 * 60 * 1000 * 30,
        httpOnly: true,
      })
      .sendStatus(200);
  } catch (err) {
    // 1. Connect Timeout Error
    if (err.cause?.code === "UND_ERR_CONNECT_TIMEOUT") {
      res.status(500).json(
        new ProblemDetails({
          type: "about:blank",
          title: err.cause.code,
          status: 500,
          detail: err.cause.code,
          instance: req.url,
        }),
      );
      return;
    }

    // 2. Fetch Error
    // when trying to create a user where its username already exists in database
    // or insert a new column that is not defined in database schema
    // XATA client will throw new FetcherError(response.status, jsonResponse, requestId);
    /*
      {
        status: 400,
        errors: [
          {
            message: 'invalid record: column [username]: is not unique',
            status: 400
          }
        ],
        requestId: 'c6a18e85-bce0-9f06-a9f8-7d84087754bd',
        cause: undefined
      }
    */

    res.status(err.status).json(
      new ProblemDetails({
        type: "about:blank",
        title: err.errors?.[0].message,
        status: err.status,
        detail: err.errors?.[0].message,
        instance: req.url,
      }),
    );
  }
};

/**
 * Updates a user
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const handleUserUpdate = async (req, res) => {
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
export const handleUserSignOut = async (req, res) => {
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
export const handleUserLogin = async (req, res) => {
  const userSent = req.body;
  const user = await getUser({ username: userSent.username });
  // this username already exists in database
  if (!user.length) {
    res.status(404).json({ message: "This user does not exist." });
    return;
  }

  if (userSent.source !== "github") {
    const match = await bcrypt.compare(userSent.password, user[0].password);
    if (!match) {
      res.status(404).json({
        message: "Wrong password, please try again.",
      });
    }
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
export const handleVerifyPassword = async (req, res) => {
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
export const handleUserDelete = async (req, res) => {
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

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ProblemDetails from "../problemDetails.js";
import query from "../db/query.js";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

/**
 * Creates a new user and stored that in database
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const handleUserSignUp = async (req, res) => {
  const user = req.body;
  if (user.source !== "github") {
    user.password = await bcrypt.hash(user.password, 10);
  } else {
    // as as of right now, no source column is added in database.
    delete user.source;
  }

  try {
    const create = await query(
      "INSERT INTO users (username, password, avatar_url) values ($1, $2, $3) returning *",
      [user.username, user.password, user.avatarUrl],
    );

    const userCookie = jwt.sign(user.username, jwtSecret);
    res
      .cookie("user", userCookie, {
        path: "/",
        maxAge: 24 * 60 * 60 * 1000 * 30,
        httpOnly: true,
      })
      .sendStatus(200);
  } catch (err) {
    console.log(err);
    // 1. when trying to insert a row where its username already exits in database (username unique)
    // console.log(err.message); // duplicate key value violates unique constraint "users_username_key"
    /*
      {
        length: 206,
        severity: 'ERROR',
        code: '23505',
        detail: 'Key (username)=(test2) already exists.',
        hint: undefined,
        position: undefined,
        internalPosition: undefined,
        internalQuery: undefined,
        where: undefined,
        schema: 'public',
        table: 'users',
        column: undefined,
        dataType: undefined,
        constraint: 'users_username_key',
        file: 'nbtinsert.c',
        line: '664',
        routine: '_bt_check_unique'
      }
    */

    // 2. when trying to insert a row where its username is null (username not null)
    // console.log(err.message); // when trying to insert a row where its username already exits in database (username not null)
    /*
      {
        length: 322,
        severity: 'ERROR',
        code: '23502',
        detail: 'Failing row contains (33, null, blahblah.aG96/2TH62V/df1bKEJ6Xh., null, free, f, null, null, 2023-07-11 02:47:34.623578+00).',
        hint: undefined,
        position: undefined,
        internalPosition: undefined,
        internalQuery: undefined,
        where: undefined,
        schema: 'public',
        table: 'users',
        column: 'username',
        dataType: undefined,
        constraint: undefined,
        file: 'execMain.c',
        line: '1968',
        routine: 'ExecConstraints'
      }
    */

    // 3. when trying to insert a row where it has a column that does not exist in database
    /*
      e.g. const create = await query(
        "INSERT INTO users (username, password, avatar_url, nothiscolumn) values ($1, $2, $3) returning *",
        [user.username, user.password, user.avatarUrl, 123]
      );
    */
    // console.log(err.message); // column "nothiscolumn" of relation "users" does not exist
    /*
      {
        length: 130,
        severity: 'ERROR',
        code: '42703',
        detail: undefined,
        hint: undefined,
        position: '52',
        internalPosition: undefined,
        internalQuery: undefined,
        where: undefined,
        schema: undefined,
        table: undefined,
        column: undefined,
        dataType: undefined,
        constraint: undefined,
        file: 'parse_target.c',
        line: '1061',
        routine: 'checkInsertTargets'
      }
    */
  }
};

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
      console.error(`Error verify user JWT cookie`, err);
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

    try {
      // here decoded is string, username where we stored in cookie
      const userRes = await query("SELECT * FROM users WHERE username = $1", [
        decoded,
      ]);
      const user = userRes.rows[0];
      res.status(200).json({
        username: user.username,
        avatarUrl: user.avatarUrl,
        password: Boolean(user.password),
        subscription: user.subscription,
        twoFactorAuth: user.two_factor_auth,
      });
    } catch (err) {
      return res.status(500).json(
        new ProblemDetails({
          type: "about:blank",
          title: "Internal server error",
          status: 500,
          detail: "Internal server error",
          instance: req.url,
        }),
      );
    }
  });
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
  try {
    const userRes = await query("SELECT * FROM users WHERE username = $1", [
      userSent.username,
    ]);
    if (userRes.rowCount === 0) {
      return res.status(404).json(
        new ProblemDetails({
          type: "about:blank",
          title: "This user does not exist",
          status: 404,
          detail: `User name ${userSent.username} does not exist in database`,
          instance: req.url,
        }),
      );
    }

    const user = userRes.rows[0];

    if (userSent.source !== "github") {
      const match = await bcrypt.compare(userSent.password, user.password);
      if (!match) {
        return res.status(401).json(
          new ProblemDetails({
            type: "about:blank",
            title: "Wrong password",
            status: 401,
            detail: `Wrong password for username ${user.username}`,
            instance: req.url,
          }),
        );
      }
    }

    if (!user.two_factor_auth) {
      const userCookie = jwt.sign(userSent.username, jwtSecret);
      res.cookie("user", userCookie, {
        path: "/",
        maxAge: 24 * 60 * 60 * 1000 * 30,
        httpOnly: true,
      });
    }

    res.status(200).json({
      message: "Log in success",
      twoFactorAuth: user.two_factor_auth,
    });
  } catch (err) {
    return res.status(500).json(
      new ProblemDetails({
        type: "about:blank",
        title: "Internal server error",
        status: 500,
        detail: "Internal server error",
        instance: req.url,
      }),
    );
  }
};

/**
 * Signs out an user by clearing cookie
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const handleUserSignOut = async (_, res) => {
  res.clearCookie("user");
  res.status(200).send({ message: "Cookie cleared" });
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
  try {
    const deleteRes = await query("DELETE FROM users WHERE username = $1", [
      username,
    ]);
    if (deleteRes.rowCount === 0) {
      // shouldn't happen
    }
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json(
      new ProblemDetails({
        type: "about:blank",
        title: "Internal server error",
        status: 500,
        detail: "Internal server error",
        instance: req.url,
      }),
    );
  }
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
  try {
    const userRes = await query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (userRes.rowCount === 0) {
      return res.status(404).json(
        new ProblemDetails({
          type: "about:blank",
          title: "User does not exist in database",
          status: 404,
          detail: "User does not exist in database",
          instance: req.url,
        }),
      );
    }

    res.status(200).json({ user: userRes.rows[0] });
  } catch (err) {
    return res.status(500).json(
      new ProblemDetails({
        type: "about:blank",
        title: "Internal server error",
        status: 500,
        detail: "Internal server error",
        instance: req.url,
      }),
    );
  }
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
  try {
    const userRes = await query("SELECT * FROM users WHERE username = $1", [
      userSent.username,
    ]);
    const match = await bcrypt.compare(
      userSent.password,
      userRes.rows[0].password,
    );
    if (!match) {
      return res.status(401).json(
        new ProblemDetails({
          type: "about:blank",
          title: "Current password is not correct.",
          status: 500,
          detail: "Current password is not correct.",
          instance: req.url,
        }),
      );
    }

    res.status(200).json({
      message: "Current password is correct.",
    });
  } catch (err) {
    return res.status(500).json(
      new ProblemDetails({
        type: "about:blank",
        title: "Internal server error",
        status: 500,
        detail: "Internal server error",
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
  const updateQue = [];

  if (body.password) {
    updateQue.push({
      password: await bcrypt.hash(body.password, 10),
    });
  }

  if (body.avatarUrl) {
    updateQue.push({
      avatar_url: body.avatarUrl,
    });
  }

  if (body.subscription) {
    updateQue.push({
      subscription: body.subscription,
    });
  }

  const updateQuery = `
    UPDATE users
    SET
      ${updateQue
        .map((column, index) => `${Object.keys(column)[0]} = $${index + 1}`)
        .join(", ")}
    WHERE
      username = $${updateQue.length + 1}
  `;

  console.log(updateQuery);
  const columnValues = updateQue.map((column) => Object.values(column)[0]);
  console.log(columnValues);
  try {
    const userUpdate = await query(updateQuery, [
      ...columnValues,
      body.username,
    ]);
    if (userUpdate.rowCount === 0) {
      // shouldn't happen
    }
    res.status(200).json({ message: "User updated" });
  } catch (err) {
    res.status(500).json(
      new ProblemDetails({
        type: "about:blank",
        title: "Internal server error",
        status: 500,
        detail: "Internal server error",
        instance: req.url,
      }),
    );
  }
};

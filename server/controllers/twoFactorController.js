import QRCode from "qrcode";
import { authenticator } from "otplib";
import { updateUser, getUser } from "../user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

/**
 * Creates a temporary secret for two-factor authentication and stores it for the user.
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const createAndStoreTempSecret = async (req, res) => {
  const { username } = req.body;
  // Returns an object with secret.ascii, secret.hex, and secret.base32.
  // Also returns secret.otpauth_url, which we'll use later.
  const secret = authenticator.generateSecret(); // base32 encoded hex secret key
  // Now, we want to make sure that this secret works by
  // validating the token that the user gets from it for the first time.
  // In other words, we don't want to set this as the user's secret key just yet,
  // we first want to verify their token for the first time.
  // We need to persist the secret so that we can use it for token validation later.
  const user = await getUser({ username });
  const update = await updateUser({
    id: user[0].id,
    tempSecret: secret,
  });

  // Next, we'll want to display a QR code to the user so they can scan in the secret into their app.
  // Google Authenticator and similar apps take in a QR code that
  // holds a URL with the protocol otpauth://,
  // which you get automatically from secret.otpauth_url.
  const otpauth = authenticator.keyuri(
    user[0].username,
    "React SassKit",
    secret,
  );

  const qrDataUrl = await new Promise((resolve, reject) => {
    QRCode.toDataURL(otpauth, (err, dataUrl) => {
      if (err) {
        reject(err);
      } else {
        resolve(dataUrl);
      }
    });
  });

  res.status(201).json({ qrDataUrl });
};

/**
 * Verifies client token against temporary secret and stores temp secret as final secret if verified.
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const verifyClientToken = async (req, res) => {
  const { username, token } = req.body;
  const user = await getUser({ username });
  const verified = authenticator.verify({
    secret: user[0].tempSecret,
    token,
  });

  if (!verified) {
    res.status(422).json({ message: "Wrong token." });
    return;
  } else {
    const update = await updateUser({
      id: user[0].id,
      finalSecret: user[0].tempSecret,
      "2fa": true,
    });
    res.status(200).json({ message: "2FA enabled." });
  }
};

/**
 * Deletes 2fa auth, remove secret key and set 2fa to be false.
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const deleteTwoFactorAuth = async (req, res) => {
  const { username } = req.body;
  const user = await getUser({ username });
  const deleteAuth = await updateUser({
    id: user[0].id,
    tempSecret: null,
    finalSecret: null,
    "2fa": false,
  });

  if (deleteAuth.errors) {
    res.status(500).json({ error: create.errors?.[0] });
  } else {
    res.status(200).json({ message: "2FA disabled." });
  }
};

/**
 * Check client auth code and handle login
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const loginWithTwoFactorAuth = async (req, res) => {
  const { username, token } = req.body;
  const user = await getUser({ username });

  const verified = authenticator.verify({
    secret: user[0].finalSecret,
    token,
  });

  if (!verified) {
    res.status(422).json({ message: "Wrong token." });
  } else {
    const userCookie = jwt.sign(username, jwtSecret);
    res.cookie("user", userCookie, {
      path: "/",
      maxAge: 24 * 60 * 60 * 1000 * 30,
      httpOnly: true,
    });
    res.status(200).json({ message: "Log in success" });
  }
};

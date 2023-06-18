// Generated with CLI
import { getXataClient } from "./xata.js";
import dotenv from "dotenv";
dotenv.config();

const xata = getXataClient({
  apiKey: process.env.XATA_API_KEY,
});

/**
 * @typedef {Object} User
 * @property {string} username - The username of the user.
 * @property {string} password - The password of the user.
 * @property {string} avatarUrl - The URL of the user's avatar image.
 */

/**
 * Creates a new user in database.
 * @param {User} user
 */
export async function createUser(user) {
  const record = await xata.db.users.create(user);
  return record;
}

export async function getUser({ username }) {
  const record = await xata.db.users
    .filter({
      username: username,
    })
    .getMany();

  return record;
}

/**
 * @param {Object} options
 * @param {String} options.id
 * @param {String} [options.password]
 * @param {String} [options.avatarUrl]
 */
export async function updateUser({ id, password, avatarUrl }) {
  let updateData = {};

  if (password) {
    updateData.password = password;
  }

  if (avatarUrl) {
    updateData.avatarUrl = avatarUrl;
  }

  const update = await xata.db.users.update(id, updateData);
  return update;
}

/**
 * Deletes a user from database.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function deleteUser(id) {
  const record = await xata.db.users.delete(id);
  return record;
}

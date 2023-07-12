import dotenv from "dotenv";
dotenv.config();

/**
 * Creates a new user in database.
 * @param {User} user
 */
export async function createUser(user) {
  return xata.db.users.create(user);
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
 * @param {String} [options.subscription]
 */
export async function updateUser(data) {
  const { id, ...updateData } = data;

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

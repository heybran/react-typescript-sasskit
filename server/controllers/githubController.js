/**
 * Fetches GitHub access token.
 * @async
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
export const handleGitHubAuth = async (req, res) => {
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
};

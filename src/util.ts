export const isResponseJson = (res: Response) => {
  return res.headers.get("content-type")?.includes("application/json");
};

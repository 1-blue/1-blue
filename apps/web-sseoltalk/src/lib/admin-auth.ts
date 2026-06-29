export const assertAdminSecret = (request: Request): void => {
  const secret = request.headers.get("x-admin-secret");
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || secret !== adminSecret) {
    throw new Error("unauthorized");
  }
};

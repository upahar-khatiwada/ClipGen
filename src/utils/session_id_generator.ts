import crypto from "crypto";

export const createSessionId = () => crypto.randomBytes(32).toString("hex");

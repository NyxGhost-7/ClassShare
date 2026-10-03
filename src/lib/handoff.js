import crypto from "crypto";

export function generateHandoffToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function generateOTP() {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
}

export function hashValue(value) {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");
}
import crypto from 'node:crypto';

export function hashMessage(input: string): string {
  return crypto
    .createHash("sha256")
    .update(input.trim().toLowerCase())
    .digest("hex");
}

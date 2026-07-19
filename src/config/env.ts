import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

const frontendUrl = required("FRONTEND_URL");

export const env = {
  port: process.env.PORT || 4000,
  mongodbUri: required("MONGODB_URI"),
  geminiApiKey: required("GEMINI_API_KEY"),
  frontendUrl,
  jwksUrl: `${frontendUrl}/api/auth/jwks`,
  jwtIssuer: frontendUrl,
};
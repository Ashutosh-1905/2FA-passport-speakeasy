import { config as conf } from "dotenv";
conf();

const _confing = {
  port: process.env.SERVER_PORT,
  databaseUrl: process.env.MONGODB_URI,
  env: process.env.NODE_ENV,
  sessionSecret:process.env.SESSION_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRESIN,
  secretKeyAccessToken: process.env.SECRET_KEY_ACCESS_TOKEN,
  secretKeyRefreshToken: process.env.SECRET_KEY_REFRESH_TOKEN,
};

const config = Object.freeze(_confing);

export default config;

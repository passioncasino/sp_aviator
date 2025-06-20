import dotenv from "dotenv";
import { cleanEnv, host, bool, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test"] }),
  GAMESERVERHOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  ASSET_HOST : str(),
  SERVER_HOST : str(),

  CONNECTION_STRING : str(),
  DBNAME : str(),

  SSL_PRIVATE_KEY: str(),
  SSL_CERTIFICATE: str(),
  SSL_CA_BUNDLE: str(),
  USE_HTTPS: bool({ default: false }),
});
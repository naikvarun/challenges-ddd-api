import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["./test/setup/init-db.ts"],
};

export default config;

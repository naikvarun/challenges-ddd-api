const appConfig = {
  env: process.env.NODE_ENV || "local",
  port: Number(process.env.PORT) || 3000,
  database_url: process.env.DATABASE_URL!,
  isEnvironment(environment: string) {
    return this.env === environment;
  },
  isLocal() {
    return this.isEnvironment("local");
  },
  isProduction() {
    return this.isEnvironment("production");
  },
};
export const APP_CONFIG = Object.freeze(appConfig);

import pino from "pino";

const logger = pino({});

export const getLogger = (module: string) => logger.child({ module });

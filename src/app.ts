import express from "express";
import { DBType } from "./db";
import path from "node:path";
import { generateId } from "./util";
import { challenges } from "./db/schema";
import { eq } from "drizzle-orm";
import { getLogger } from "./app.logger";
const logger = getLogger("app");
export const appFactory = (db: DBType) => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.head("/status", (_req, res) => {
    res.sendStatus(200);
  });

  app.get("/", (_req, res) => {
    res.sendFile("postman.json", { root: path.resolve(__dirname, "../") });
  });

  app.get("/api/challenges", async (_req, res) => {
    res.json(await db.select().from(challenges));
  });

  app.get("/api/challenges/:id", async (req, res) => {
    const id = req.params.id;
    logger.info(`Fetching challenge for id "${id}"`);
    if (typeof id !== "string") {
      return res.status(400).send({ error: "Invalid Id" });
    }
    const challenge = await db
      .select()
      .from(challenges)
      .where(eq(challenges.id, id));

    logger.info(challenge, "GOT the challenge from service");
    if (challenge.length === 0) {
      return res.sendStatus(400);
    }

    return res.json(challenge[0]);
  });

  app.post("/api/challenges", async (req, res) => {
    const { name, content }: { name: string; content: string } = req.body;
    const today = new Date();
    const MONDAY = 1;
    let level = 1;
    if (content.length > 100 && content.includes(";")) {
      level = 3;
    } else if (today.getDate() === MONDAY) {
      level = 2;
    }
    const id = generateId();
    try {
      await db.insert(challenges).values({ id, level, name, content });
      return res.json({ id });
    } catch (error) {
      return res.status(500).send({ error });
    }
  });

  app.delete("/api/challenges/:id", async (req, res) => {
    const id = req.params.id;

    if (typeof id !== "string") return res.sendStatus(400);

    await db.delete(challenges).where(eq(challenges.id, id));
    res.sendStatus(200);
  });

  return app;
};

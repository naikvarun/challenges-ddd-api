import "dotenv/config";
import { DBClient } from "../../src/db";

beforeAll(async () => {
  try {
    await DBClient.connect();
  } catch (err) {
    console.log(err);
  }
});

afterAll(async () => {
  await DBClient.end();
});

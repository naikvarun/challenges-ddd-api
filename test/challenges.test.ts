import { challenges } from "../src/db/schema";
import request from "supertest";
import { appFactory } from "../src/app";
import { DBClient, DBType } from "../src/db";
import { getLogger } from "../src/app.logger";

const challengeUrl = "/api/challenges";

type ChallengeResponse = {
  id: string;
  level: number;
  name: string;
  content: string;
};
const logger = getLogger("challenges-test");
describe("Challenges Test", () => {
  let db: DBType;
  let app: ReturnType<typeof request>;
  beforeAll(async () => {
    db = DBClient.db;
  });
  beforeEach(async () => {
    await db.delete(challenges);
    const server = appFactory(db);
    app = request(server);
  });
  test("Empty list of challenges", async () => {
    const response = await app.get(challengeUrl);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("Add a challenge", async () => {
    logger.info("app arranged");
    const data = {
      name: "Roman Numerals",
      content: `if(number < 1) throw new Error("Roman numerals doesn't support 0 or negative numbers.);`,
    };

    const postResponse = await app.post(challengeUrl).send(data);
    const getResponse = await app.get(challengeUrl);

    const deterministicResult = getResponse.body.map(
      (challenge: ChallengeResponse) => {
        // Fields level and id are non-deterministic and need to be removed from the object.
        const { level: _level, id: _id, ...deterministicResult } = challenge;

        return deterministicResult;
      },
    );

    expect(postResponse.status).toEqual(200);
    expect(getResponse.status).toEqual(200);
    expect(deterministicResult).toEqual([data]);
  });

  test("Get challenge by ID", async () => {
    const data = {
      name: "Roman Numerals with ID",
      content: `if(number < 1) throw new Error("Roman numerals doesn't support 0 or negative numbers.);`,
    };

    const postResponse = await app.post(challengeUrl).send(data);
    logger.info({ response: postResponse.body });

    const getByIdResponse = await app.get(
      `${challengeUrl}/${postResponse.body.id}`,
    );
    logger.info("received response");
    const { level, id, ...deterministicResult } = getByIdResponse.body;

    expect(getByIdResponse.status).toEqual(200);
    expect(deterministicResult).toEqual(data);
    logger.info("values asserted ");
  });

  test("Delete challenge", async () => {
    const data = {
      name: "Roman Numerals",
      content: `if(number < 1) throw new Error("Roman numerals doesn't support 0 or negative numbers.);`,
    };

    const postResponse = await app.post(challengeUrl).send(data);

    const deleteResponse = await app.delete(
      `${challengeUrl}/${postResponse.body.id}`,
    );

    const getAllResponse = await app.get(challengeUrl);

    expect(deleteResponse.status).toEqual(200);
    expect(getAllResponse.body).toEqual([]);
  });

  test("Add same name twice fails", async () => {
    const data = {
      name: "Keep it DRY",
      content: "const x = 5; const y = 5;",
    };

    await app.post("/api/challenges").send(data);
    const secondAddResponse = await app.post("/api/challenges").send(data);

    expect(secondAddResponse.status).toEqual(500);
  });
});

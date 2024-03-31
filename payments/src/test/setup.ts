import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
  var signin: (userId?: string) => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

jest.mock("../nats-wrapper");

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  //build a jwt payload {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  //create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!, {
    expiresIn: "1h",
  });
  //build session. {jwt: myJWT}
  const session = {
    jwt: token,
  };

  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take the JSON and encode base 64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  //Return the string that's the cookie with encoded data

  return [`session=${base64}`];
};

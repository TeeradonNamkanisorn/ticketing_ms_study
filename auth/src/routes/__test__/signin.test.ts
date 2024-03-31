import request from "supertest";
import { app } from "../../app";

it("fails when an email that does not exist is supplied", async () => {
  const { error } = await request(app)
    .post("/api/users/signin")
    .send({
      email: "abc@mail.com",
      password: "def",
    })
    .expect(400);

  return;
});

it("fails when an incorrect password is supplied", async () => {
  await request(app).post("/api/users/signup").send({
    email: "theme@mail.com",
    password: "123456",
  });

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "theme@mail.com",
      password: "asbsa",
    })
    .expect(400);
});

it("responds with a cookie when given a valid credential", async () => {
  await request(app).post("/api/users/signup").send({
    email: "theme@mail.com",
    password: "123456",
  });

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "theme@mail.com",
      password: "123456",
    })
    .expect(400);

  expect(response.get("Set-Cookie")).toBeDefined();
});

const { connect } = require("./database");
const request = require("supertest");
const app = require("../index");
const { userModel } = require("../models/auth.model");

// Test the /signup route
describe("User: POST /signup", () => {
  let conn;

  // Connect to the database before running any tests
  beforeAll(async () => {
    conn = await connect();
  });

  // Clean up the database after each test
  afterEach(async () => {
    await conn.cleanup();
  });

  // Disconnect from the database after all tests have run
  afterAll(async () => {
    await conn.disconnect();
  });

  // Test signing up a new user
  it("should signup a user", async () => {
    const user = {
      "first_name": "Oluwafemi",
      "last_name": "Erota",
      "email": "jayjay.500@example.com",
      "password": "Password1"
    };
    const res = await request(app)
      .post("/signup")
      .set("content-type", "application/json")
      .send(user);

    // Check the response status code and body
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('user')
    expect(res.body.user).toHaveProperty('first_name', 'oluwafemi')
    expect(res.body.user).toHaveProperty('last_name', 'Erota')
    expect(res.body.user).toHaveProperty('email', 'jayjay.500@example.com')
  });
});

describe("User: POST /login", () => {
  let conn;

  beforeAll(async () => {
    conn = await connect();
  });

  afterEach(async () => {
    await conn.cleanup();
  });

  afterAll(async () => {
    await conn.disconnect();
  });

  it("should login a user", async () => {
    const data = {
      "first_name": "oluwafemi",
      "last_name": "Erota",
      "email": "jayjay@example.com",
      "password": "Password1"
    };
    const user = await userModel.create(data)
    const res = await request(app)
      .post("/login")
      .set("content-type", "application/json")
      .send( data )
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('token')
  });
});

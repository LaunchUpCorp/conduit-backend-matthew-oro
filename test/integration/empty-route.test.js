const express = require("express");
const request = require("supertest");
import routes from "../../src/routes/index";
const app = express();

app.use(express.json());

app.use("/api", routes);

// example jest integration test
describe("Integration tests for the empty API route", () => {
  it("GET /api - success -  return api working message", async () => {
    const response = await request(app).get("/api");
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual("API is running on /api");
  });
});

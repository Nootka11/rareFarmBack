const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("GET /animals", () => {
  it("should return all animals", async () => {
    const res = await request(app).get("/animals");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /animals/:id", () => {
  it("should return a animal", async () => {
    const res = await request(app).get(
      "/animals/68345b4f7c7d3c3c67b53d93"
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.commonName).toBe("Domestic Yak");
  });
});

// describe("POST /animals", () => {
//   it("should create a animal", async () => {
//     const res = await request(app).post("/animals").send({
//       commonName: "animal 2",
//       scientificName: "1009 scientific Name of my animal",
//       description: "Description 2",
//     });
//     expect(res.statusCode).toBe(201);
//     expect(res.body.commonName).toBe("animal 2");
//   });
// });

// describe("PUT /animals/:id", () => {
//   it("should update a animal", async () => {
//     const res = await request(app)
//       .patch("/animals/6331abc9e9ececcc2d449e44")
//       .send({
//         commonName: "animal 4",
//         scientificName: "4 scientific Name of my animal 4",
//         description: "Description 4",
//       });
//     expect(res.statusCode).toBe(200);
//     expect(res.body.scientificName).toBe("4 scientific Name of my animal 4");
//   });
// });

// describe("DELETE /animals/:id", () => {
//   it("should delete a animal", async () => {
//     const res = await request(app).delete(
//       "/animals/6331abc9e9ececcc2d449e44"
//     );
//     expect(res.statusCode).toBe(200);
//   });
// });
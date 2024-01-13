import mongoose from "mongoose";
import request from "supertest";
import "dotenv/config";
import  controllers from "../controllers/authentication.js";

import app from "../app.js";

import User from "../models/user.js";

const { TEST_DB_HOST, PORT = 3000 } = process.env;

describe("test /users.js", () => {
    let server = null;
    beforeAll(async () => {
        await mongoose.connect(TEST_DB_HOST);
        server = app.listen(PORT);
        const signupData = {
            email: "qwerty1@com",
            password: "1234"
        };
         await request(app).post("/users/register").send(signupData)
    })

    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    })

    beforeEach(() => {

    })

    afterEach(async () => {
        await User.deleteMany({});
    })

    test("test login with correctData", async () => {
        const signupData = {
            email: "qwerty1@com",
            password: "1234"
        };
        const { statusCode, body  } = await request(app).post("/users/login").send(signupData);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("token");
        expect(body).toHaveProperty("user");

        expect(typeof(body.user.email)).toBe("string");
        expect(typeof(body.user.subscription)).toBe("string");

    })
})
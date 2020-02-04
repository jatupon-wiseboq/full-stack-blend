import request from "supertest";
import app from "../src/app";
import {describe, it} from "mocha";

describe("GET /api", () => {

    it("should return 200 OK", () => request(app).get("/api").
        expect(200));

});

import request from "supertest";
import app from "../src/app";
import {describe, it} from "mocha";

describe("GET /", () => {

    it("should return 200 OK", (done) => {

        request(app).get("/").
            expect(200, done);

    });

});

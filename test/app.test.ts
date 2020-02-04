import request from "supertest";
import app from "../src/app";
import {describe, it} from "mocha";

describe("GET /random-url", () => {

    it("should return 404", (done) => {

        request(app).get("/reset").
            expect(404, done);

    });

});

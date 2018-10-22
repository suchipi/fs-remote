const Jasmine = require("@suchipi/jasmine-mini");
const chai = require("chai");
const chaiJestSnapshot = require("chai-jest-snapshot");

chai.use(chaiJestSnapshot);

const expect = chai.expect;

Jasmine.run(({ describe, it }) => {
  describe("using fs-remote for snapshot testing", () => {
    it("works", () => {
      expect(2 + 2).to.matchSnapshot(__filename + ".snap", "it works!");
    });
  });
}).then(console.log.bind(console), console.error.bind(console));

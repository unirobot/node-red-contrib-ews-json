const should = require("should");
const util = require("../nodes/util");
const fs = require("fs");

describe("util.js", () => {
    it("folder delete", (done) => {
        var dir = __dirname + "/test";
        var msg = util.createTempDir(__dirname + "/test", {ewsConfig: {}});
        msg.ewsConfig.should.have.property("temp", dir);
        util.deleteDir(dir);
        try{
            fs.readdirSync(dir);
        }catch(err){
            err.code.should.equal("ENOENT");
            done();
        }
    });
});

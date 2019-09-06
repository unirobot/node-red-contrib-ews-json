const should = require("should");
const helper = require("node-red-node-test-helper");

const node = require("../nodes/ews");
const settings = require("../.settings.json");

const _config = {
    username: settings.user,
    password:  settings.password,
    host: settings.host,
    auth: "basic"
};

describe("EWS Node", () => {
    before((done) => {
        helper.startServer(done);
    });

    after((done) => {
        helper.stopServer(done);
    });

    afterEach(() => {
        helper.unload();
    });

    let tests = [
        {clear: true},
        {clear: false}
    ];

    describe("should be loaded", () => {
        tests.forEach((test) => {
            it("clear: " + test.clear, (done) => {
                let flow = [{id:"n1", type:"ews", mode:"exec" , clear: test.clear, name: "test" }];
                helper.load(node, flow, () => {
                    const n1 = helper.getNode("n1");
                    n1.should.have.property("name", "test");
                    done();
                });
            });
        });
    });

    describe("get room list", () => {
        tests.forEach((test) => {
            it("clear: " + test.clear, (done) => {
                let flow = [
                    { id: "n1", type: "ews", name:"", clear: test.clear, "wires":[["n2"]]},
                    { id: "n2", type: "helper" }
                ];
                helper.settings({userDir: __dirname});
                helper.load(node, flow, () => {
                    const n2 = helper.getNode("n2");
                    const n1 = helper.getNode("n1");
                    n2.on("input", (msg) => {
                        msg.should.have.property("status", "success");
                        done();
                    });
                    n1.receive({
                        ewsConfig: _config,
                        ewsFunction: 'GetRoomLists',
                        ewsArgs: {}
                    });
                });
            });
        });
    });

    describe("get room list (mkdir error) ", () => {
        tests.forEach((test) => {
            it("clear: " + test.clear, (done) => {
                let flow = [
                    { id: "n1", type: "ews", name:"", clear: test.clear, "wires":[["n2"]]},
                    { id: "n2", type: "helper" }
                ];
                helper.settings({userDir: __dirname + "/error"});
                helper.load(node, flow, () => {
                    const n2 = helper.getNode("n2");
                    const n1 = helper.getNode("n1");
                    n2.on("input", (msg) => {
                        msg.should.have.property("status", "error");
                        done();
                    });
                    n1.receive({
                        ewsConfig: _config,
                        ewsFunction: 'GetRoomLists',
                        ewsArgs: {}
                    });
                });
            });
        });
    });

    it("clear is undefined", (done) => {
        let flow = [
            { id: "n1", type: "ews", name:"", "wires":[["n2"]]},
            { id: "n2", type: "helper" }
        ];
        helper.settings({userDir: __dirname});
        helper.load(node, flow, () => {
            const n2 = helper.getNode("n2");
            const n1 = helper.getNode("n1");
            n2.on("input", (msg) => {
                msg.should.have.property("status", "success");
                done();
            });
            n1.receive({
                ewsConfig: _config,
                ewsFunction: 'GetRoomLists',
                ewsArgs: {}
            });
        });
    });

    describe("auth error (username is dummy)", () => {
        tests.forEach((test) => {
            it("clear: "+ test.clear, (done) => {
                let flow = [
                    { id: "n1", type: "ews", name:"", clear: test.clear, "wires":[["n2"]]},
                    { id: "n2", type: "helper" }
                ];
                helper.settings({userDir: __dirname});
                helper.load(node, flow, () => {
                    const n2 = helper.getNode("n2");
                    const n1 = helper.getNode("n1");
                    n2.on("input", (msg) => {
                        msg.should.have.property("status", "error");
                        done();
                    });
                    n1.receive({
                        ewsConfig:{
                            username: "dummy",
                            password:  settings.password,
                            host: settings.host,
                            auth: 'basic'
                        },
                        ewsFunction: 'GetRoomLists',
                        ewsArgs: {}
                    });
                });
            });
        });
    });

    describe("auth error (passowrd is Dummy)", () => {
        let tests = [
            {clear: true},
            {clear: false}
        ];
        tests.forEach((test) => {
            it("clear: " + test.clear, (done) => {
                let flow = [
                    { id: "n1", type: "ews", name:"", clear: test.clear, "wires":[["n2"]]},
                    { id: "n2", type: "helper" }
                ];
                helper.settings({userDir: __dirname});
                helper.load(node, flow, () => {
                    const n2 = helper.getNode("n2");
                    const n1 = helper.getNode("n1");
                    n2.on("input", (msg) => {
                        msg.should.have.property("status", "error");
                        done();
                    });
                    n1.receive({
                        ewsConfig:{
                            username: settings.user,
                            password:  "dummy",
                            host: settings.host,
                            auth: 'basic'
                        },
                        ewsFunction: 'GetRoomLists',
                        ewsArgs: {}
                    });
                });
            });
        });
    });

    describe("ewsFunction is Dummy", () => {
        let tests = [
            {clear: true},
            {clear: false}
        ];
        tests.forEach((test) => {
            it("clear: " + test.clear, (done) => {
                let flow = [
                    { id: "n1", type: "ews", name:"", clear: test.clear, "wires":[["n2"]]},
                    { id: "n2", type: "helper" }
                ];
                helper.settings({userDir: __dirname});
                helper.load(node, flow, () => {
                    const n2 = helper.getNode("n2");
                    const n1 = helper.getNode("n1");
                    n2.on("input", (msg) => {
                        msg.should.have.property("status", "error");
                        done();
                    });
                    n1.receive({
                        ewsConfig:{
                            username: settings.user,
                            password: settings.password,
                            host: settings.host,
                            auth: 'basic'
                        },
                        ewsFunction: 'Dummy',
                        ewsArgs: {}
                    });
                });
            });
        });
    });
});

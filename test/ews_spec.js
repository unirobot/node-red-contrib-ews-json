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

    it("should be loaded", (done) => {
        let flow = [{id:"n1", type:"ews", name: "test" }];
        helper.load(node, flow, () => {
            const n1 = helper.getNode("n1");
            n1.should.have.property("name", "test");
            done();
        });
    });

    it("get room list", (done) => {
        let flow = [
            { id: "n1", type: "ews", name:"","wires":[["n2"]]},
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

    it("get room list (mkdir error)", (done) => {
        let flow = [
            { id: "n1", type: "ews", name:"","wires":[["n2"]]},
            { id: "n2", type: "helper" }
        ];
        helper.settings({userDir: __dirname + "/error"});
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

    it("get rooms", (done) => {
        let flow = [
            { id: "n1", type: "ews", name:"","wires":[["n2"]]},
            { id: "n2", type: "ews", name:"","wires":[["n3"]]},
            { id: "n3", type: "helper" }
        ];
        helper.settings({userDir: __dirname});
        helper.load(node, flow, () => {
            const n3 = helper.getNode("n3");
            const n2 = helper.getNode("n2");
            const n1 = helper.getNode("n1");
            n3.on("input", (msg) => {
                msg.should.have.property("status", "success");
                done();
            });
            n2.on("input", (msg) => {
                n2.receive({
                    ewsConfig: _config,
                    ewsFunction: 'GetRooms',
                    ewsArgs:{
                        RoomList: {
                            EmailAddress: msg.ewsResult.RoomLists.Address.EmailAddress
                        }
                    }
                });
            });
            n1.receive({
                ewsConfig: _config,
                ewsFunction: 'GetRoomLists',
                ewsArgs: {}
            });
        });
    });

    it("auth error (username is dummy)", (done) => {
        let flow = [
            { id: "n1", type: "ews", name:"","wires":[["n2"]]},
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

    it("auth error (passowrd is Dummy)", (done) => {
        let flow = [
            { id: "n1", type: "ews", name:"","wires":[["n2"]]},
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

    it("ewsFunction is Dummy", (done) => {
        let flow = [
            { id: "n1", type: "ews", name:"","wires":[["n2"]]},
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

    // it("host is Dummy", (done) => {
    //     let flow = [
    //         { id: "n1", type: "ews", name:"","wires":[["n2"]]},
    //         { id: "n2", type: "helper" }
    //     ];
    //     helper.settings({userDir: __dirname});
    //     helper.load(node, flow, () => {
    //         const n2 = helper.getNode("n2");
    //         const n1 = helper.getNode("n1");
    //         n2.on("input", (msg) => {
    //             msg.should.have.property("status", "error");
    //             done();
    //         });
    //         n1.receive({
    //             ewsConfig:{
    //                 username: settings.user,
    //                 password: settings.password,
    //                 host: 'https://dummy.sumisho.unibo.info',
    //                 auth: 'basic'
    //             },
    //             ewsFunction: 'GetRoomLists',
    //             ewsArgs: {}
    //         });
    //     });
    // });
});

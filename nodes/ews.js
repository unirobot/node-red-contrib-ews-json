module.exports = function (RED) {
    "use strict";
    const EWS = require('node-ews');
    const fs = require('fs');
    const util = require("./util");
    const dir = RED.settings.userDir + "/ews";

    function run(node, msg){
        const ews = new EWS(msg.ewsConfig);

        ews.run(msg.ewsFunction, msg.ewsArgs)
            .then(result => {
                msg.ewsResult = result;
                msg.status = "success";
                node.send(msg);
            })
            .catch(err => {
                msg.payload = err.message;
                msg.status = "error";
                node.send(msg);
            });
    }

    function EwsNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.clear = n.clear;

        this.on('input', function (msg) {
            try{
                if(node.clear){
                    util.deleteDir(dir);
                    run(node,util.createTempDir(dir, msg));
                }else{
                    run(node, util.createTempDir(dir, msg));
                }
            } catch(err){
                msg.payloadd = err.message;
                msg.status = "error";
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("ews", EwsNode);
};

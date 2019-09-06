module.exports = function (RED) {
    "use strict";
    const EWS = require('node-ews');
    const fs = require('fs');

    function EwsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function (msg) {
            createTempDir(node, msg);
        });
    }

    function createTempDir(node, msg){
        const dir = RED.settings.userDir + "/ews";
        if(fs.existsSync(dir)){
            msg.ewsConfig.temp = dir;
            run(node, msg);
        }else{
            fs.mkdir(dir, (err) => {
                if (!err){
                    msg.ewsConfig.temp = dir;
                }
                run(node, msg);
            });
        }
    }

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

    RED.nodes.registerType("ews", EwsNode);
};

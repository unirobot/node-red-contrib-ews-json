module.exports = function (RED) {
    "use strict";
    const EWS = require('node-ews');

    function EWSNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on('input', function (msg) {
            const ews = new EWS(msg.ewsConfig);

            ews.run(msg.ewsFunction, msg.ewsArgs)
                .then(result => {
                    msg.ewsResult = result;
                    node.send(msg);
                })
                .catch(err => {
                    console.log(err.stack);
                });
        });
    }
    RED.nodes.registerType("EWS", EWSNode);
}
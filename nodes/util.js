const fs = require('fs');

function deleteDir(dir){
    try{
        var targetRemoveFiles = fs.readdirSync(dir);
        for(var file in targetRemoveFiles) {
            if (targetRemoveFiles.hasOwnProperty(file)) {
                fs.unlinkSync(dir + "/" + targetRemoveFiles[file]);
            }
        }
        fs.rmdirSync(dir);
    }catch(err){
        if(err.code === "ENOENT"){
            return;
        }else{
            throw err;
        }
    }
}

function createTempDir(dir, msg){
    try{
        if(fs.existsSync(dir)){
            msg.ewsConfig.temp = dir;
            return msg;
        }else{
            fs.mkdirSync(dir);
            msg.ewsConfig.temp = dir;
            return msg;
        }
    }catch(err){
        throw err;
    }
}


module.exports = {
    deleteDir: deleteDir,
    createTempDir: createTempDir
};

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

function changeOwnerToSystem(dir){
    fs.chownSync(dir, 1000, 1000);
}

function createTempDir(dir, msg){
    try{
        if(fs.existsSync(dir)){
            changeOwnerToSystem(dir);
            msg.ewsConfig.temp = dir;
            return msg;
        }else{
            fs.mkdirSync(dir);
            changeOwnerToSystem(dir);
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

var config = require("./config");

module.exports = {
    init: function (callback){
        var fs = require('fs');
        if(!fs.existsSync(config.dir_base)){fs.mkdirSync(config.dir_base);}
        if(!fs.existsSync(config.dir_database)){fs.mkdirSync(config.dir_database);}
    }
};
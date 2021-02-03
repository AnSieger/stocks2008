var config = require("./config");

module.exports = {
    init: function (callback){
        var fs = require('fs');
        if(!fs.existsSync(config.dir_data)){fs.mkdirSync(config.dir_data);}
        if(!fs.existsSync(config.dir_stock)){fs.mkdirSync(config.dir_stock);}
    }
};
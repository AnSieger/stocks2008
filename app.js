
const https = require('https');
let fs = require("fs");
let init_process = require("./init");
const { dir_stock } = require('./config');
const { setTimeout } = require('timers');

init_process.init();


let MaxRequestAtDay = 500;
let CurrentRequest =  1;
let RequestinSec = 16;
let Symbolcounter = 0;

//APIKeys
let rawdataapi = fs.readFileSync("./data/APIKeys.json");
let APIKeys = JSON.parse(rawdataapi);

//Symbol e.g. IBM
let rawdatasymobl = fs.readFileSync("./data/Symbol.json");
let Symbol = JSON.parse(rawdatasymobl);
let Symbolarry = [];
for(var Key in Symbol){;
  Symbolarry.push(Key);
  Symbolcounter++;
}


for(let User in APIKeys["APIKeys"]){
  while(CurrentRequest < MaxRequestAtDay && Symbolcounter >= 0){
    console.log(User + " with " + Symbolarry[--Symbolcounter] + " Request: " + CurrentRequest + " Time: " + (1000 * RequestinSec * CurrentRequest));
    setTimeout(function () {
      console.log("Do: " + User + " with " + Symbolarry[--Symbolcounter]);
      apirequest(Symbolarry[Symbolcounter],APIKeys["APIKeys"][User]["key"]);
    }, 1000 * RequestinSec * CurrentRequest);    
    CurrentRequest++
  }
  CurrentRequest = 1;
}


/*
setTimeout(function () {
  apirequest("IBM","demo");
}, 5000);
*/

//apirequest("IBM","demo");


function apirequest(symbol,apikey){

    let Url = new URL(url_base);
    Url.searchParams.append("function", "TIME_SERIES_DAILY");
    Url.searchParams.append("symbol",symbol);
    Url.searchParams.append("outputsize","full");
    Url.searchParams.append("apikey",apikey);


    let filechecker = require("fs");
    if(!filechecker.existsSync(dir_stock + "/" + symbol + ".json"))
    {
      https.get(Url, (res) =>{
          const { statusCode } = res;
          const contentType = res.headers['content-type'];
        
          let error;
          // Any 2xx status code signals a successful response but
          // here we're only checking for 200.
          if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                              `Status Code: ${statusCode}`);
          } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                              `Expected application/json but received ${contentType}`);
          }
          if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            return;
          }
        
          res.setEncoding('utf8');
          let rawData = '';
          res.on('data', (chunk) => { rawData += chunk; });
          res.on('end', () => {
            try {
              let parsedData = JSON.parse(rawData);
              if(!Object.keys(parsedData) == 'Note'){
                //Request limit was not reached. File will be created
                let filewriter = require("fs");
                filewriter.appendFile(dir_stock + "/" + symbol + ".json",JSON.stringify(parsedData), function (err) {
                    if (err) throw err;
                    console.log(err);
                });
              }
            } catch (e) {
              console.error(e.message);
            }
          });
        }).on('error', (e) => {
          console.error(`Got error: ${e.message}`);
        });

    }else{
      console.log(symbol + " exists. Skipping Request")
    }

    
      
}

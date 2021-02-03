let fs = require("fs");

let rawdataapi = fs.readFileSync("./data/APIKeys.json");
let APIKeys = JSON.parse(rawdataapi);

let rawdatasymobl = fs.readFileSync("./data/Symbol.json");
let Symbol = JSON.parse(rawdatasymobl);

let rawdataerror = fs.readFileSync("./stock/ENTG.json");
let error = JSON.parse(rawdataerror);

for(var myKey in error){
    console.log(myKey);
}

console.log(!Object.keys(error) == 'Note');


/*
for(var myKey in APIKeys["APIKeys"]){
    console.log(myKey);
    console.log(APIKeys["APIKeys"][myKey]["key"]);
}
*/

/*
for(var myKey in Symbol){;
    console.log(myKey);
}*/
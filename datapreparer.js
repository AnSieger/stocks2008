let fs = require('fs');


let data = {}; //output. Chartdata
let labels = [] //part of output. X Achse
let datasets = [] //part of output. Y Achse

const from_date = new Date('2008-08-01');
let current_date = new Date('2008-08-01');
const to_date = new Date('2008-12-20'); // - 1

while(to_date >= current_date){
    if(current_date.getDay() == 6 || current_date.getDay() == 0){
        //Saturday = 6, Sunday = 0. Stockmarket is closed
        //Useless to Show. Skipping
    }else{
        labels.push(current_date.getUTCFullYear() + "-" +
        (current_date.getUTCMonth() + 1) + "-" + 
        current_date.getUTCDate());
    }
    current_date.setDate(current_date.getDate() + 1);
}
data.labels = labels;
data.datasets = [];

fs.readdir("stock/", function(err, files){
    if(err){return console.log(err);}
    console.log("Read Stockfiles")
    files.forEach(function(file){
        let rawdatastock = fs.readFileSync("./stock/" + file);
        let Stock = JSON.parse(rawdatastock);
        let Symbol = Stock['Meta Data']['2. Symbol'];
        console.log("Do " + Symbol);
        let values = [];
        let dataforexport = {}
        dataforexport.label = Symbol;
        let lastvalue = 0.0; //For percent calculation
        let foundany = false;
        for(let label in labels){
            let found = false;
            for(let StockDate in Stock['Time Series (Daily)']) {
                let StockD = new Date(StockDate);
                let LabelD = new Date(labels[label]);
                //console.log(StockD+" == " +LabelD+" | "+StockD.getTime()+" == "+LabelD.getTime()+" | "+StockDate +" == "+labels[label])
                if(StockD.getFullYear() === LabelD.getFullYear() && StockD.getMonth() === LabelD.getMonth() && StockD.getDate() === LabelD.getDate()){
                    found = true;
                    foundany = true;
                    let stockvalue = parseFloat(Stock['Time Series (Daily)'][StockDate]['4. close']);
                    
                    ////absolute values
                    //values.push(stockvalue);
                    
                    //percent values
                    if(lastvalue != 0.0){
                        values.push((stockvalue/lastvalue*100)-100);
                    }else{
                        values.push(0.0);
                    }
                    lastvalue = stockvalue;

                    break;
                }
            }
            //if(!found){values.push();} //Didnt found
        }
        if(foundany){
            dataforexport.data = values;
            dataforexport.borderColor = dynamicColors();
            dataforexport.backgroundColor = dataforexport.borderColor;
            dataforexport.fill = false;
            dataforexport.borderWidth = 1;
            data.datasets.push(dataforexport);
        }
    })
    console.log("Finish Stockfile reading")
    fs.unlink('data.json', function() {
        fs.appendFile("data.json",JSON.stringify(data), function(err){
            if(err) throw err
        });
    });

})

var dynamicColors = function() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
 };





/*
let rawdatastock = fs.readFileSync("./stock/A.json");
let Symbol = JSON.parse(rawdatastock);
//console.log(Symbol['Meta Data']['2. Symbol']);
//console.log(Object.keys(Symbol['Time Series (Daily)']));
*/
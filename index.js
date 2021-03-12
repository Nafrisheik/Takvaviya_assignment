const express = require("express");
const app = express();
var server  = require('http').createServer(app);
var io = require('socket.io')(server);
var os 	= require('os-utils');

app.use(express.static('public'));
app.set('view engine',"ejs");

//api to load the home.ejs on the browser
app.get('/',function(req,res){
    res.render('home');
});

var cpuHistogram =[];
var histogramLen =61;
var interval =1000;//time interval in seconds to retrieve data

server.listen(3000,function(){
    for(i=0;i<histogramLen;i++){
        cpuHistogram[i]=[i,0];
    }
    setInterval(()=>{
        os.cpuUsage((value)=>{
            updateCpu(Math.round(value*100))
            io.emit('histogram',cpuHistogram);
            // console.log(value);
        })
    },interval)

    setInterval(()=>{
        io.emit('Memory',(os.totalmem()-os.freemem())/os.totalmem()*100);
        // console.log((os.totalmem()-os.freemem())/os.totalmem()*100)
    
    },interval)
})


function updateCpu(cpuLoad){
    if(cpuHistogram.length>=histogramLen){
        cpuHistogram.shift();
    }
    cpuHistogram.push([0,cpuLoad]);
    for(j=0;j<histogramLen;j++){
    cpuHistogram[j][0]=j;
    }
}



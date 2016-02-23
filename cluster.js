var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

	cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });

var feeNotifier=require("./utils/schedular/feeNotificationSchedular.js");
    var notifies=new feeNotifier();
    notifies.init();
    notifies.on("myEvent",function(result){
      console.log(JSON.stringify(result));
    });
} else {

    //change this line to Your Node.js app entry point.
    require("./app.js");
    
}
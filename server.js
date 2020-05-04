var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var track_address;
var track_port = 1;
var ack = new Buffer("");
var app_ack = new Buffer("");
var message = [];

server.on("error", function(err) {
	console.log("server error:\n"+err.stack);
	server.close();
});
server.on("message", function(msg,rinfo){
	console.log("server got: "+msg+" from "+rinfo.address+" : "+rinfo.port);
	if(msg.length > 4){
		var newMsg = msg.toString();
		message = newMsg.split("-");
		console.log(message);
	}
	if(msg == "connectFromApp"){
		ack = new Buffer("1");
	}
	else if(msg == "tryToConnected"){
		track_address =  rinfo.address;
		track_port = rinfo.port;
		ack = new Buffer("connected");
	}
	else if(msg == "start"){
		ack = new Buffer("start");
	}
	else if(msg == "stop"){
		ack = new Buffer("stop");
	}
	else if(message[0] == "forward"){
		ack = new Buffer("forward-" + message[1]);
	}
	else if(message[0] == "backward"){
		ack = new Buffer("backward-" + message[1]);
	}
	else if(message[0] == "right"){
		ack = new Buffer("right-" + message[1]);
	}
	else if(message[0] == "left"){
		ack = new Buffer("left-" + message[1]);
	}
	else if(message[0] == "area"){
		ack = new Buffer("area-" + message[1] + message[2]);
	}	
	server.send(ack,0,ack.length,rinfo.port,rinfo.address, function(err,bytes){
		console.log("Sended   : "+ack);
	});
});
server.on("listening", function(){
	var address = server.address();
	console.log("server listening  "+address.address+":"+address.port);
});
server.bind({
	address: '203.150.107.176',
	port: 17711,
	exclusive: true
});

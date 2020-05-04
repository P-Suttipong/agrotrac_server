var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var track_address;
var track_port = 1;
var ack = new Buffer("");
var app_ack = new Buffer("");
var direct = [];

server.on("error", function(err) {
	console.log("server error:\n"+err.stack);
	server.close();
});
server.on("message", function(msg,rinfo){
	console.log("server got: "+msg+" from "+rinfo.address+" : "+rinfo.port);
	if(msg.length > 7){
		var newMsg = msg.toString();
		direct = newMsg.split("-");
		console.log(direct);
	}
	if(msg == "connectFromApp"){
		ack = new Buffer("1");
	}
	else if(msg == "tryToConnected"){
		track_address =  rinfo.address;
		track_port = rinfo.port;
		ack = new Buffer("connected");
	}
	else if(direct[0] == "forward"){
		ack = new Buffer("forward"+direct[1]);
	}
	else if(msg == "backward"){
		ack = new Buffer("backward");
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

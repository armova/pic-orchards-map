var fs = require("fs"); 
var User = require("../models/user")
var EventEmitter = require('events').EventEmitter
var userLogin = new EventEmitter();
var http = new XMLHttpRequest();
var container = document.querySelector("._3vot")
var mapLayout = fs.readFileSync( __dirname + "/../views/mapLayout.html")



http.onreadystatechange=function(){
	if (http.readyState==4 && http.status==200){
   		var response = JSON.parse(http.responseText);
   		//console.log(response); 
   		//console.dir(response);
   		User.refresh([{token: response.id, id: response.userId}]);
   		//console.log(User.all()[0]);
   		container.innerHTML = mapLayout;
   		var Map = require("./map.js").init;
   	} else if (http.readyState==4 && http.status==401){
   		alert("Error: Login fallido. Revisar email y password");
   		localStorage.clear();
   	}
}

userLogin.on('login', function(params){
	var url = "  ";

	var postParams = JSON.stringify({
		"email": params[0], 
		"password": params[1]
	});

	http.open("POST", url);
	http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	http.send(postParams);
	//console.log(http);
});

module.exports = userLogin;
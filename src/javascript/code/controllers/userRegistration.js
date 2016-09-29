var EventEmitter = require('events').EventEmitter
var userRegistration = new EventEmitter();
var http = new XMLHttpRequest();

http.onreadystatechange=function(){
	if (http.readyState==4 && http.status==200){
   		alert("Registro exitoso, por favor Volver a Login");
   	} else if (http.readyState==4 && http.status==422){
   		var response = JSON.parse(http.responseText);
   		if (response.error.message == "The `myUser` instance is not valid. Details: `username` User already exists."){
   			alert("Error: Este usuario ya existe");
   		} else if (response.error.message == "The `myUser` instance is not valid. Details: `email` Email already exists."){
   			alert("Error: Este email ya existe");
   		} else if (response.error.message == "The `myUser` instance is not valid. Details: `email` Email already exists; `username` User already exists."){
   			alert("Error: el usuario y el email ya existen");
   		} 
   	}

}

userRegistration.on('registration', function(params){
	var url = "  ";
	var username = params[0];
	var email = params[1];
	var password = params[2];

	var postParams = JSON.stringify({
		"username": username,
		"email": email, 
		"password": password
	});

	http.open("POST", url);
	http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	http.send(postParams);
	//console.log(http);
});

module.exports = userRegistration;
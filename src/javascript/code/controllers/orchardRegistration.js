var EventEmitter = require('events').EventEmitter
var orchardRegistration = new EventEmitter();
var http = new XMLHttpRequest();
var User = require("../models/user")
var OrchardLoader = require("./orchardLoader.js");

http.onreadystatechange=function(){
	if (http.readyState==4 && http.status==200){
   		alert("Registro exitoso");
      OrchardLoader.emit("loadAll");
      var ShowInMap = require("./map.js").showInMap;
      ShowInMap.emit("showMapView");
   	} else if (http.readyState==4 && http.status!=200){
   		var response = JSON.parse(http.responseText);
   		alert("Error! " + response.error.message);
   	}

}

orchardRegistration.on('registration', function(params){
	var user = User.all()[0];
	var url = " " + user.token;
	var name = params[0];
	// var description = params[1];
    var attendant = params[1]; 
    var phone = params[2];
    var email = params[3];
    var web = params[4];
    var fb = params[5];
    var schedule = params[6];
    var characteristics = params[7]; 
    var cropTypology = params[8];
    var size = params[9];
    var crops = params[10];
    var specials = params[11];
    var concepts = params[12];
    var sharing = params[13];
    var help = params[14];
    var market = params[15];
    var location = params[16];
    var today = new Date();
    var geoPoint = {
    	"lat": location.lat,
    	"lng": location.lng
    };

	var postParams = JSON.stringify({
  		"schedule": schedule,
  		"characteristics": characteristics,
  		"cropTypology": cropTypology,
  		"size": size,
  		"grownCrops": crops,
  		"specialProducts": specials,
  		"cultivationConcepts": concepts,
  		"availableForSharing": sharing,
  		"needHelpWith": help,
  		"shareOrMarket": market,
  		"created": today,
  		"updated": today,
  		"createdBy": user.id,
  		"updatedBy": user.id,
  		"name": name,
  		"attendantName": attendant,
  		"phone": phone,
  		"email": email,
  		"web": web,
  		"facebook": fb,
  		// "description": description,
  		"location": geoPoint,
  		"ownerId": user.id
	});

	http.open("POST", url);
	http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	http.send(postParams);
	//console.log(http);
});

module.exports = orchardRegistration;


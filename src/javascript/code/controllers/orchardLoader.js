var EventEmitter = require('events').EventEmitter
var orchardLoader = new EventEmitter();
var http = new XMLHttpRequest();
var response = null;
var Orchard = require("../models/orchard")

http.onreadystatechange=function(){
	if (http.readyState==4 && http.status==200){
   		//console.log("Carga exitosa");
   		response = JSON.parse(http.responseText);
   		
   		var orchards = [];
		
		for (var i = response.length - 1; i >= 0; i--) {
			var orchard = response[i];
			orchards.push( { 
				schedule: orchard.schedule,
  				characteristics: orchard.characteristics,
  				cropTypology: orchard.cropTypology,
  				size: orchard.size,
  				grownCrops: orchard.grownCrops,
  				specialProducts: orchard.specialProducts,
  				cultivationConcepts: orchard.cultivationConcepts,
  				availableForSharing: orchard.availableForSharing,
  				needHelpWith: orchard.needHelpWith,
  				shareOrMarket: orchard.shareOrMarket,
  				created: orchard.created,
  				updated: orchard.updated,
  				createdBy: orchard.createdBy,
  				updatedBy: orchard.updatedBy,
  				name: orchard.name,
  				attendantName: orchard.attendantName,
  				phone: orchard.phone,
  				email: orchard.email,
  				web: orchard.web,
  				facebook: orchard.facebook,
  				// description: orchard.description,
  				location: orchard.location,
  				ownerId: orchard.ownerId,
  				id: orchard.id
			})
		};
		
		Orchard.refresh(orchards);
   		
   		var ShowInMap = require("./map.js").showInMap;
   		ShowInMap.emit("showAllOrchards");
   		
   	} else if (http.readyState==4 && http.status!=200){
   		response = JSON.parse(http.responseText);
   		console.log("Error de carga! " + response.error.message);
   	}
}

orchardLoader.on('loadAll', function(){
	var url = " ";

	http.open("GET", url);
	http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	http.send();
	//console.log(http);
});

module.exports = orchardLoader;



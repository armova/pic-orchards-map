var _3Model = require("3vot-model/lib/ajaxless")

var fields = ["name", "description", "attendant", "phone", "email", "web", "fb",
 "schedule", "characteristics", "cropTypology", "size", "crops", "specials", 
 "concepts", "sharing", "help", "market", "location", "created", "createdBy", 
 "id", "updated", "updatedBy"];

Orchard = _3Model.Model.setup("Orchard", fields);

module.exports = Orchard
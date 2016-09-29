var _3Model = require("3vot-model/lib/ajaxless")

var fields = ["token", "id", "userName", "email"];

User = _3Model.Model.setup("User", fields);

module.exports = User
var mongoose = require('mongoose');

var SuperuserSchema = new mongoose.Schema({
	username: String,
	password: String
});



module.exports = mongoose.model("Superuser", SuperuserSchema);
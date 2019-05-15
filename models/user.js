var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	password: String
});

UserSchema.plugin(passportLocalMongoose); //add methods to UserSchema from passport-local-mongoose package
module.exports = mongoose.model("User", UserSchema);
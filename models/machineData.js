var mongoose = require("mongoose");
var machineDataSchema = new mongoose.Schema({
	volt: Number,
	active: Number, 
    progress: Number, 
    machineId: Number
	
});

module.exports = mongoose.model("Machine", machineDataSchema);
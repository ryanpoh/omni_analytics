var mongoose = require("mongoose");

var processDataSchema = new mongoose.Schema({
	processName: String, 
	processCost: Number,
	processTime: Number, 
	processId: Number,
});

module.exports = mongoose.model("Process", processDataSchema);



var mongoose = require("mongoose");
var lotDataSchema = new mongoose.Schema({
	employeeID: Number,
	lotId: Number, 
	lotSize: String, 
	lotQuantity: Number,
	jobSheetNumber: {
						type: Number, 
			  			default: 0,
			  		},
	processId: Number,
	timeTaken: Number,
	entryCost: Number,
	date: {type: Number, default: Date.now()}
});

module.exports = mongoose.model("Lot", lotDataSchema);
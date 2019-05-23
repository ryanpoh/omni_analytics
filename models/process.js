var mongoose = require("mongoose");

var processDataSchema = new mongoose.Schema({
	processName: String, 
	processId: Number,
	totalQuantity: Number,	
	overallCompletion: Number,
	totalSubQuantity: Number,
	date: {type: Number, default: Date.now()},
	subProcesses: {
					buttonProcess: {
									subProcessName: {type: String, default: 'Button Stichting'},
									subProcessId: Number, 
									subSize: Number, 
									subCompletion: Number, 
									subQuantity: Number,
									subTime: Number,
									subCost: Number,								
									}, 
					collarProcess: {
									subProcessName: {type: String, default: 'Collar Stichting'} ,
									subProcessId: Number, 
									subSize: Number, 
									subCompletion: Number, 
									subQuantity: Number,
									subTime: Number,
									subCost: Number,								
									},
					bodyProcess: 	{
									subProcessName: {type: String, default: 'Shirt Body'} ,
									subProcessId: Number, 
									subSize: Number, 
									subCompletion: Number, 
									subQuantity: Number,
									subTime: Number,
									subCost: Number,								
									},
					sleeveProcess: {
									subProcessName: {type: String, default: 'Sleeves Stichting'} ,
									subProcessId: Number, 
									subSize: Number, 
									subCompletion: Number, 
									subQuantity: Number,
									subTime: Number,
									subCost: Number,								
									}
									
					},

});

module.exports = mongoose.model("Process", processDataSchema);



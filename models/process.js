var mongoose = require("mongoose");

var processDataSchema = new mongoose.Schema({
	lotName: String, 
	lotId: Number,
	totalQuantity: Number,	
	overallCompletion: Number,
	totalSubQuantity: Number,
	status: String,
	estimatedCost: Number,
	estimatedSell: Number,
	picture: {type: String, 
			  default: "https://png.pngtree.com/svg/20170218/company_573791.png"
			 },
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
									subSell: Number,								
									}, 
					collarProcess: {
									subProcessName: {type: String, default: 'Collar Stichting'} ,
									subProcessId: Number, 
									subSize: Number, 
									subCompletion: Number, 
									subQuantity: Number,
									subTime: Number,
									subCost: Number,								
									subSell: Number,								
									},
					bodyProcess: 	{
									subProcessName: {type: String, default: 'Body Stichting'} ,
									subProcessId: Number, 
									subSize: Number, 
									subCompletion: Number, 
									subQuantity: Number,
									subTime: Number,
									subCost: Number,								
									subSell: Number,								
									},
					sleeveProcess: {
									subProcessName: {type: String, default: 'Sleeve Stichting'} ,
									subProcessId: Number, 
									subSize: Number, 
									subCompletion: Number, 
									subQuantity: Number,
									subTime: Number,
									subCost: Number,								
									subSell: Number,								
									}
									
					},

});

module.exports = mongoose.model("Process", processDataSchema);



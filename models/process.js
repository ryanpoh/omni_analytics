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
			  default: "https://cdn1.iconfinder.com/data/icons/business-power-4/48/business_avatar_company_hierarchy_level_position_post-512.png"
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
									subProcessName: {type: String, default: 'Shirt Body'} ,
									subProcessId: Number, 
									subSize: Number, 
									subCompletion: Number, 
									subQuantity: Number,
									subTime: Number,
									subCost: Number,								
									subSell: Number,								
									},
					sleeveProcess: {
									subProcessName: {type: String, default: 'Sleeves Stichting'} ,
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



var express = require('express'),
	router = express.Router();

var	Lot = require('../models/lot');
var	Process = require('../models/process');

router.post('/api/update', function(req,res){  //respond as POST eventhough same route. USING REST API


////ARDUINO
	var employeeID = req.body.employeeID;
	var lotId = req.body.lotId;
	var lotSize = req.body.lotSize;
	var lotQuantity = req.body.lotQuantity;
	var processId = req.body.processId; 
	var timeTaken = req.body.timeTaken;
	// var startTime = req.body.startTime;
	// var day = req.body.day;
	// var month = req.body.month;
	// var year = req.body.year;


	var dateObj = new Date();
	var day = dateObj.getDate().toString();
	var month = "0" + (dateObj.getMonth()).toString();
	var year = (dateObj.getYear() +1900).toString().split("0",2)[1];

	// var fullYear = (dateObj.getFullYear()).toString;
	// String [] fullYearParts = fullYear.split("0");
	// String year = fullYearParts[1]; 

	var timeNow = new Date();
	var newTime = new Date(timeTaken - 50*60000);
	var startTime = newTime.getHours().toString() + newTime.getMinutes().toString();






// ////POSTMAN
	// var employeeID = req.query.employeeID;
	// var lotId = req.query.lotId;
	// var lotSize = req.query.lotSize;
	// var lotQuantity = req.query.lotQuantity;
	// var processId = req.query.processId; 
	// var timeTaken = req.query.timeTaken;
	// var startTime = req.query.startTime;
	// var day = req.query.day;
	// var month = req.query.month;
	// var year = req.query.year;

	var detectProcess = processId - lotId;



	if( detectProcess == 1) {
		Process.find({'lotId': lotId}, function(err, rawParentLot){
			if(err){
				console.log(err);
			} else {

				rawParentLot.forEach(function(processedParentLot){
					var string = JSON.stringify(processedParentLot);
					var obj = JSON.parse(string);
					var tempSubCost = obj.subProcesses.buttonProcess.subCost;
					var tempSubQuantity = obj.subProcesses.buttonProcess.subQuantity;
					var tempSubCompletion = obj.subProcesses.buttonProcess.subCompletion;
					var tempOverallCompletion = obj.overallCompletion;

					var newSubCompletion = tempSubCompletion + (lotQuantity/tempSubQuantity *100);
					var newOverallCompletion = tempOverallCompletion + (newSubCompletion/100)*25;
					var entryCost = tempSubCost * lotQuantity;


					Process.findOneAndUpdate({'lotId':lotId}, {$set: {'subProcesses.buttonProcess.subCompletion': newSubCompletion, 'overallCompletion':newOverallCompletion}}, function(err, updatedLot) {

						if(err){
							console.log(err);
						} else {


							// CREATING A NEW DATA ENTRY AND SAVING IT TO DB
							var newLot = {	
								employeeID: employeeID,
								lotId: lotId, 
								lotSize: lotSize, 
								lotQuantity: lotQuantity,
								processId: processId,
								timeTaken: timeTaken,
								entryCost: entryCost,
								startTime: startTime,
								day: day,
								month: month,
								year: year,							
							};

							console.log(newLot);
							Lot.create(newLot, function(err, newLot){
									if(err){
										console.log(err);
									} else {
										res.send('\n DATABASE ARDUINO LOT UPDATE SUCESSFULL' + "=====================\n"+newLot +
											"\n\n DATABASE PROCESS LOT UPDATE SUCCESSFUL (BELOW IS PREVIOUS RECORD. MONGODB BUGGED)"  + "=====================\n"+updatedLot);

									}
							});	

						}

					});




				});			
			}
		});	
	} else if( detectProcess == 2) {
		Process.find({'lotId': lotId}, function(err, rawParentLot){
			if(err){
				console.log(err);
			} else {

				rawParentLot.forEach(function(processedParentLot){
					var string = JSON.stringify(processedParentLot);
					var obj = JSON.parse(string);
					var tempSubCost = obj.subProcesses.collarProcess.subCost;
					var tempSubQuantity = obj.subProcesses.collarProcess.subQuantity;
					var tempSubCompletion = obj.subProcesses.collarProcess.subCompletion;
					var tempOverallCompletion = obj.overallCompletion;

					var newSubCompletion = tempSubCompletion + (lotQuantity/tempSubQuantity *100);
					var newOverallCompletion = tempOverallCompletion + (newSubCompletion/100)*25;
					var entryCost = tempSubCost * lotQuantity;

					Process.findOneAndUpdate({'lotId':lotId}, {$set: {'subProcesses.collarProcess.subCompletion': newSubCompletion, 'overallCompletion':newOverallCompletion}}, function(err, updatedLot) {

						if(err){
							console.log(err);
						} else {


							// CREATING A NEW DATA ENTRY AND SAVING IT TO DB
							var newLot = {	
								employeeID: employeeID,
								lotId: lotId, 
								lotSize: lotSize, 
								lotQuantity: lotQuantity,
								processId: processId,
								timeTaken: timeTaken,
								entryCost: entryCost,
								startTime: startTime,
								day: day,
								month: month,
								year: year,							
							};

							console.log(newLot);
							Lot.create(newLot, function(err, newLot){
									if(err){
										console.log(err);
									} else {

										res.send('\n DATABASE ARDUINO LOT UPDATE SUCESSFULL' + "=====================\n"+newLot +
										"\n\n DATABASE PROCESS LOT UPDATE SUCCESSFUL (BELOW IS PREVIOUS RECORD. MONGODB BUGGED)"  + "=====================\n"+updatedLot);

									}
							});	

						}
					  // Updated at most one doc, `res.modifiedCount` contains the number
					  // of docs that MongoDB updated
					});




				});			
			}
		});	
	} else if( detectProcess == 3) {
		console.log("identified process 3");
		Process.find({'lotId': lotId}, function(err, rawParentLot){
			if(err){
				console.log(err);
			} else {

				rawParentLot.forEach(function(processedParentLot){
					var string = JSON.stringify(processedParentLot);
					var obj = JSON.parse(string);
					var tempSubCost = obj.subProcesses.bodyProcess.subCost;
					var tempSubQuantity = obj.subProcesses.bodyProcess.subQuantity;
					var tempSubCompletion = obj.subProcesses.bodyProcess.subCompletion;
					var tempOverallCompletion = obj.overallCompletion;

					var newSubCompletion = tempSubCompletion + (lotQuantity/tempSubQuantity *100);
					var newOverallCompletion = tempOverallCompletion + (newSubCompletion/100)*25;
					var entryCost = tempSubCost * lotQuantity;


					Process.findOneAndUpdate({'lotId':lotId}, {$set: {'subProcesses.bodyProcess.subCompletion': newSubCompletion, 'overallCompletion':newOverallCompletion}}, function(err, updatedLot) {

						if(err){
							console.log(err);
						} else {


							// CREATING A NEW DATA ENTRY AND SAVING IT TO DB
							var newLot = {	
								employeeID: employeeID,
								lotId: lotId, 
								lotSize: lotSize, 
								lotQuantity: lotQuantity,
								processId: processId,
								timeTaken: timeTaken,
								entryCost: entryCost,
								startTime: startTime,
								day: day,
								month: month,
								year: year,									
							};

							console.log(newLot);
							Lot.create(newLot, function(err, newLot){
									if(err){
										console.log(err);
									} else {

										res.send('\n DATABASE ARDUINO LOT UPDATE SUCESSFULL' + "=====================\n"+newLot +
											"\n\n DATABASE PROCESS LOT UPDATE SUCCESSFUL (BELOW IS PREVIOUS RECORD. MONGODB BUGGED)"+updatedLot);
									}
							});	

						}
					  // Updated at most one doc, `res.modifiedCount` contains the number
					  // of docs that MongoDB updated
					});




				});			
			}
		});	
	} else if( detectProcess == 4) {
		Process.find({'lotId': lotId}, function(err, rawParentLot){
			if(err){
				console.log(err);
			} else {

				rawParentLot.forEach(function(processedParentLot){
					var string = JSON.stringify(processedParentLot);
					var obj = JSON.parse(string);
					var tempSubCost = obj.subProcesses.sleeveProcess.subCost;
					var tempSubQuantity = obj.subProcesses.sleeveProcess.subQuantity;
					var tempSubCompletion = obj.subProcesses.sleeveProcess.subCompletion;
					var tempOverallCompletion = obj.overallCompletion;

					var newSubCompletion = tempSubCompletion + (lotQuantity/tempSubQuantity *100);
					var newOverallCompletion = tempOverallCompletion + (newSubCompletion/100)*25;
					var entryCost = tempSubCost * lotQuantity;


					Process.findOneAndUpdate({'lotId':lotId}, {$set: {'subProcesses.sleeveProcess.subCompletion': newSubCompletion, 'overallCompletion':newOverallCompletion}}, function(err, updatedLot) {


						if(err){
							console.log(err);
						} else {


							// CREATING A NEW DATA ENTRY AND SAVING IT TO DB
							var newLot = {	
								employeeID: employeeID,
								lotId: lotId, 
								lotSize: lotSize, 
								lotQuantity: lotQuantity,
								processId: processId,
								timeTaken: timeTaken,
								entryCost: entryCost,
								startTime: startTime,
								day: day,
								month: month,
								year: year,										
							};

							console.log(newLot);
							Lot.create(newLot, function(err, newLot){
									if(err){
										console.log(err);
									} else {

										res.send('\n DATABASE ARDUINO LOT UPDATE SUCESSFULL' + "=====================\n"+newLot +
											"\n\n DATABASE PROCESS LOT UPDATE SUCCESSFUL (BELOW IS PREVIOUS RECORD. MONGODB BUGGED)"+updatedLot);

									}
							});	

						}

					});




				});			
			}
		});	
	}
});


module.exports = router;
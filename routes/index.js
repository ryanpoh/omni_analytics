var express = require('express'),
	router = express.Router();

var	Lot = require('../models/lot');
var	Process = require('../models/process');
var	Employee = require('../models/employee');


router.get('/', function(req,res){
	res.render("landing");
});

router.get('/home', isLoggedIn, function(req, res){
	
	// TAKEN FROM DB
	var timeTakenLot = []; 
	var processesIdLot = [];
	var entryCostLot = [];

	var processesTimeDb =[]; 
	var processesIdDb = []; 
	var processesCostDb =[]; 
	var processesSellDb = []; 



	// PROCESS INFO	
	var respectiveProcessTime = [];	
	var respectiveProcessCost = [];	
	var respectiveProcessSell = [];	
	var performance = []; 
	var unixTime = [];
	var objToPass = {
						lots: [], 
						timeTaken: timeTakenLot, 
						entryCost: entryCostLot, 
						processTime: respectiveProcessTime, 
						processCost: respectiveProcessCost, 
						processSell: respectiveProcessSell, 
						unixTime: unixTime,
						performance: performance, 
						featuredEmployees: [],
					};
	
	
	Employee.find({featured: true}, function(err, employeesData){ //{} means you take everything from DB
		if(err){
			console.log(err);
		} else {
			objToPass.featuredEmployees = employeesData;    //full RAW lot Database file from DB	
		}
	});


	Lot.find({}, function(err, lotsData){ //{} means you take everything from DB
		if(err){
			console.log(err);
		} else {
				objToPass.lots = lotsData;    //full RAW lot Database file from DB	
				lotsData.forEach(function(individualLot){
					var string = JSON.stringify(individualLot);
					var obj = JSON.parse(string);
					processesIdLot.push(obj.processId);
					timeTakenLot.push(obj.timeTaken);
					entryCostLot.push(obj.entryCost);
				});
			
			Process.find({}, function(err, processesData){ //{} means you take everything from DB
				if(err){
					console.log(err);
				} else {

					processesData.forEach(function(individualProcess){
						var string = JSON.stringify(individualProcess);
						var obj = JSON.parse(string);
						processesIdDb.push(obj.subProcesses.buttonProcess.subProcessId);  
						processesIdDb.push(obj.subProcesses.collarProcess.subProcessId);  
						processesIdDb.push(obj.subProcesses.bodyProcess.subProcessId);  
						processesIdDb.push(obj.subProcesses.sleeveProcess.subProcessId);  
						
						processesTimeDb.push(obj.subProcesses.buttonProcess.subTime);
						processesTimeDb.push(obj.subProcesses.collarProcess.subTime);
						processesTimeDb.push(obj.subProcesses.bodyProcess.subTime);
						processesTimeDb.push(obj.subProcesses.sleeveProcess.subTime);

						processesCostDb.push(obj.subProcesses.buttonProcess.subCost);   
						processesCostDb.push(obj.subProcesses.collarProcess.subCost);  
						processesCostDb.push(obj.subProcesses.bodyProcess.subCost);  
						processesCostDb.push(obj.subProcesses.sleeveProcess.subCost);  
						
						processesSellDb.push(obj.subProcesses.buttonProcess.subSell);
						processesSellDb.push(obj.subProcesses.collarProcess.subSell);
						processesSellDb.push(obj.subProcesses.bodyProcess.subSell);
						processesSellDb.push(obj.subProcesses.sleeveProcess.subSell);

					});	

					processesIdLot.forEach(function(processIdLot, i){

						processesIdDb.forEach(function(processIdDb, j){

							if (processIdLot == processIdDb){
								respectiveProcessTime.push(processesTimeDb[j]);
								respectiveProcessCost.push(processesCostDb[j]);
								respectiveProcessSell.push(processesSellDb[j]);
								
								performance.push(Math.round(100 - ((timeTakenLot[i] - processesTimeDb[j]) / processesTimeDb[j] *100)));
	
							} else {
								// console.log("No matches"); //why does it output no match but still get correct output
							}											 
						});

						


					});


					res.render('home', objToPass);	
				}	

			});			
			
		}
	});
	

});

function isLoggedIn(req,res, next){
	// if(req.isAuthenticated()){
	if(true){
		//console.log("YOU PASS");
		return next();
	}
	//console.log("YOU FAIL");
	res.redirect("/login");
}

module.exports = router;



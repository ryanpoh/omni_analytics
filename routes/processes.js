var express = require('express'),
	router = express.Router();

var	Process = require('../models/process');

router.post('/processes', isLoggedIn, function(req,res){  //respond as POST eventhough same route. USING REST API
	//GET DATA FROM THE FORM AND ADD TO ARRAY
	var processName = req.body.processName;
	var processId =req.body.processId;
	var totalQuantity = req.body.totalQuantity;
	var subSizeButton = req.body.subSizeButton;

	// FIXED DATA
	var buttonTime = 20;
	var buttonCost = 0.65;
	var subQuantityButton = totalQuantity*subSizeButton;

	var collarTime = 30;
	var collarCost = 0.85;
	var subSizeCollar = 1;
	var subQuantityCollar = totalQuantity*subSizeCollar;		


	var bodyTime = 15;
	var bodyCost = 1.15;
	var subSizeBody = 1;	
	var subQuantityBody = totalQuantity*subSizeBody;			

	var sleeveTime = 35;
	var sleeveCost = 0.95;
	var subSizeSleeve = 2;	
	var subQuantitySleeve = totalQuantity*subSizeSleeve;	

	totalSubQuantity = subQuantityButton+subQuantityCollar+subQuantityBody+subQuantitySleeve;			


	var newProcess = {	
		processName: processName,  
		processId: processId, 
		totalQuantity: totalQuantity, 
		// auto generated		
		overallCompletion: 0,
		totalSubQuantity: totalSubQuantity,		
		subProcesses: {
						buttonProcess: {
										subProcessId: +processId+ +1, //unary operation
										subSize: subSizeButton, 
										subCompletion: 0, 
										subQuantity: subQuantityButton,
										subTime: buttonTime,
										subCost: buttonCost,
										}, 
						collarProcess: {
										subProcessId: +processId + +2 , 
										subSize: subSizeCollar , 
										subCompletion: 0, 
										subQuantity: subQuantityCollar,
										subTime: collarTime, 
										subCost: collarCost,
										},
						bodyProcess: 	{
										subProcessId: +processId+ +3 ,  
										subSize: subSizeBody ,
										subCompletion: 0, 
										subQuantity: subQuantityBody,
										subTime: bodyTime, 
										subCost: bodyCost,
										},
						sleeveProcess: {
										subProcessId: +processId+ +4 ,
										subSize: subSizeSleeve, 
										subCompletion: 0, 
										subQuantity: subQuantitySleeve,
										subTime: sleeveTime, 
										subCost: sleeveCost, 								
										},
					},
	};
	
	// CREATING A NEW DATA ENTRY AND SAVING IT TO DB
	Process.create(newProcess,function(err, newProcess){
			if(err){
				console.log(err);
			} else {
				console.log('NEW PROCESS ADDED \n=================');
				console.log(newProcess);
				res.redirect('/processes');
			}
	});
});

router.get('/processes', isLoggedIn, function(req,res){
	//GET ALL PROCESSES FROM DB
	Process.find({}, function(err, processesData){ //{} means you take everything from DB
		if(err){
			console.log(err);
		} else {
			res.render('process_index',{processes:processesData});
		}
	});
});

router.get('/processes/new', isLoggedIn, function(req,res){
	res.render("process_new");
});

function isLoggedIn(req,res, next){
	// if(req.isAuthenticated()){
	if(true){
		console.log("YOU PASS");
		return next();
	}
	console.log("YOU FAIL");
	res.redirect("/login");
}





module.exports = router;
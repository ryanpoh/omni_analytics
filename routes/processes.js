var express = require('express'),
	router = express.Router();

var	Process = require('../models/process');

router.post('/lots', isLoggedIn, function(req,res){  //respond as POST eventhough same route. USING REST API
	//GET DATA FROM THE FORM AND ADD TO ARRAY
	var lotName = req.body.lotName;
	var lotId =req.body.lotId;
	var totalQuantity = req.body.totalQuantity;
	var subSizeButton = req.body.subSizeButton;
	var buttonTime = req.body.buttonTime;
	var buttonCost = req.body.buttonCost;	
	var collarTime = req.body.collarTime;
	var collarCost = req.body.collarCost;	
	var bodyTime = req.body.bodyTime;
	var bodyCost = req.body.bodyCost;
	var sleeveTime = req.body.sleeveTime;
	var sleeveCost = req.body.sleeveCost;	
	var markupSell = req.body.markupSell;	
	var picture = req.body.picture;	


	// FIXED DATA
	var buttonSell = buttonCost * markupSell; //50% markup
	var subQuantityButton = totalQuantity*subSizeButton;


	var collarSell = collarCost * markupSell;
	var subSizeCollar = 1;
	var subQuantityCollar = totalQuantity*subSizeCollar;		



	var bodySell = bodyCost * markupSell;
	var subSizeBody = 1;	
	var subQuantityBody = totalQuantity*subSizeBody;			

	var sleeveSell = sleeveCost * markupSell; 
	var subSizeSleeve = 2;	
	var subQuantitySleeve = totalQuantity*subSizeSleeve;	

	totalSubQuantity = subQuantityButton+subQuantityCollar+subQuantityBody+subQuantitySleeve;			
	estimatedCost = buttonCost*subQuantityButton + collarCost*subQuantityCollar + bodyCost*subQuantityBody + sleeveCost*subQuantitySleeve;
	estimatedSell = buttonSell*subQuantityButton + collarSell*subQuantityCollar + bodySell*subQuantityBody + sleeveSell*subQuantitySleeve;


	var newProcess = {	
		lotName: lotName,  
		lotId: lotId, 
		totalQuantity: totalQuantity, 
		// auto generated		
		overallCompletion: 0,
		status: 'Active',
		totalSubQuantity: totalSubQuantity,		
		estimatedCost: estimatedCost,		
		estimatedSell: estimatedSell,		
		picture: picture,		
		subProcesses: {
						buttonProcess: {
										subProcessId: +lotId + +1, //unary operation
										subSize: subSizeButton, 
										subCompletion: 0, 
										subQuantity: subQuantityButton,
										subTime: buttonTime,
										subCost: buttonCost,
										subSell: buttonSell,
										}, 
						collarProcess: {
										subProcessId: +lotId + +2 , 
										subSize: subSizeCollar , 
										subCompletion: 0, 
										subQuantity: subQuantityCollar,
										subTime: collarTime, 
										subCost: collarCost,
										subSell: collarSell,
										},
						bodyProcess: 	{
										subProcessId: +lotId + +3 ,  
										subSize: subSizeBody ,
										subCompletion: 0, 
										subQuantity: subQuantityBody,
										subTime: bodyTime, 
										subCost: bodyCost,
										subSell: bodySell,
										},
						sleeveProcess: {
										subProcessId: +lotId + +4 ,
										subSize: subSizeSleeve, 
										subCompletion: 0, 
										subQuantity: subQuantitySleeve,
										subTime: sleeveTime, 
										subCost: sleeveCost, 								
										subSell: sleeveSell, 								
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
				res.redirect('/lots');
			}
	});
});

router.get('/lots', isLoggedIn, function(req,res){
	//GET ALL PROCESSES FROM DB
	Process.find({}, function(err, processesData){ //{} means you take everything from DB
		if(err){
			console.log(err);
		} else {
			res.render('process_index',{processes:processesData});
		}
	});
});

router.get('/lots/new', isLoggedIn, function(req,res){
	res.render("process_new");
});

// EDIT REST API
router.get('/lots/:lotDataId/edit', isLoggedIn, function(req,res){
	Process.findById(req.params.lotDataId, function(err, foundLot){
		if(err){
			res.redirect("/lots");
		} else {
			res.render("process_edit", {lot: foundLot});			
		}
	});
	
});

// UPDATE REST API
router.put("/lots/:lotDataId", function(req,res){
	Process.findByIdAndUpdate(req.params.lotDataId, req.body.editLot, function(err,updatedLot){
		if(err){
			res.redirect("/lots");
		} else {
			res.redirect("/lots/"+req.params.lotDataId);
		}
	})
});


router.get('/lots/:lotDataId',isLoggedIn, function(req, res){ //SHOW RESTFUL API - WHICH SHOWS MORE INFO ABOUT SOMETHING
	
	
	// TAKEN FROM DB
	var timeTakenLot = []; //[ 10 ]
	var processesIdLot = [];

	var processesTimeDb =[]; //[ 20, 30, 50, 30 ]
	var processesIdDb = []; // [100,200,300]



	// PROCESS INFO	
	var respectiveProcessTime = [];	
	var performance = []; 
	var unixTime = [1, 2 ,3];
	var objToPass = {lots: [], timeTaken: timeTakenLot, processTime: respectiveProcessTime, unixTime: unixTime, performance: performance, foundEmployee: []};
	
	Process.findById(req.params.lotDataId, function(err, foundLot){
		if(err){
			console.log(err);
		} else {

			res.render("process_show", {foundLot: foundLot});

			// objToPass.foundEmployee = foundEmployee; 
			// var string = JSON.stringify(foundEmployee);
			// var obj = JSON.parse(string);
			// var employeeId = obj.employeeID;
			
			// Lot.find({employeeID: employeeId}, function(err, foundLots){ //{} means you take everything from DB
			// 	if(err){
			// 		console.log(err);
			// 	} else {
					
			// 		objToPass.lots = foundLots;    //full RAW lot Database file from DB	
			// 		foundLots.forEach(function(individualLot){
			// 			var string = JSON.stringify(individualLot);
			// 			var obj = JSON.parse(string);
			// 			processesIdLot.push(obj.processId);
			// 			timeTakenLot.push(obj.timeTaken);
			// 		});


			// 		Process.find({}, function(err, processesData){ //{} means you take everything from DB
			// 			if(err){
			// 				console.log(err);
			// 			} else {

			// 				processesData.forEach(function(individualProcess){
			// 					var string = JSON.stringify(individualProcess);
			// 					var obj = JSON.parse(string);
			// 					processesIdDb.push(obj.processId);  //[100] - no duplicates
			// 					processesTimeDb.push(obj.processTime);
			// 				});	

			// 				processesIdLot.forEach(function(processIdLot, i){

			// 					processesIdDb.forEach(function(processIdDb, j){

			// 						if (processIdLot == processIdDb){
			// 							respectiveProcessTime.push(processesTimeDb[j]);
			// 							// console.log( 'time taken = ' + timeTakenLot[j]);
			// 							// console.log('processesTimeDb =' +  processesTimeDb[j]);
			// 							performance.push(Math.round(100 - ((timeTakenLot[i] - processesTimeDb[j]) / processesTimeDb[j] *100)));
			// 							// console.log('CALCULATION =' + performance);
			// 						} else {
			// 							// console.log("No matches"); //why does it output no match but still get correct output
			// 						}											 
			// 					});


			// 				});



			// 				// res.render("process_show", objToPass);
			// 			}	

			// 		});	
					

			// 	}
			// });				
			
		}	
	});
	
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
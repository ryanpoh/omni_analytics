var express = require('express'),
	router = express.Router();

var	Process = require('../models/process');

router.post('/clients', isLoggedIn, function(req,res){  //respond as POST eventhough same route. USING REST API
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
				console.log('NEW CLIENT ADDED \n=================');
				console.log(newProcess);
				res.redirect('/clients');
			}
	});
});

router.get('/clients', isLoggedIn, function(req,res){
	//GET ALL PROCESSES FROM DB
	Process.find({}, function(err, processesData){ //{} means you take everything from DB
		if(err){
			console.log(err);
		} else {
			res.render('process_index',{processes:processesData});
		}
	});
});

router.get('/clients/new', isLoggedIn, function(req,res){
	res.render("process_new");
});

// EDIT REST API
router.get('/clients/:lotDataId/edit', isLoggedIn, function(req,res){
	Process.findById(req.params.lotDataId, function(err, foundLot){
		if(err){
			res.redirect("/clients");
		} else {
			res.render("process_edit", {lot: foundLot});			
		}
	});
	
});

// UPDATE REST API
router.put("/clients/:lotDataId", function(req,res){
	Process.findByIdAndUpdate(req.params.lotDataId, req.body.editLot, function(err,updatedLot){
		if(err){
			res.redirect("/clients");
		} else {
			res.redirect("/clients/"+req.params.lotDataId);
		}
	})
});


router.get('/clients/:lotDataId',isLoggedIn, function(req, res){ //SHOW RESTFUL API - WHICH SHOWS MORE INFO ABOUT SOMETHING
	
	
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
			
		}	
	});
	
});



function isLoggedIn(req,res, next){
	// if(req.isAuthenticated()){
	if(true){
		return next();
	}
	res.redirect("/login");
}





module.exports = router;
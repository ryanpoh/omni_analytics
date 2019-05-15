var express = require('express'),
	router = express.Router();

var	Lot = require('../models/lot');

router.post('/api/update', function(req,res){  //respond as POST eventhough same route. USING REST API
	//GET DATA FROM THE FORM AND ADD TO ARRAY
	var employeeID = req.query.employeeID;
	var lotNumber = req.query.lotNumber;
	var lotSize = req.query.lotSize;
	var lotQuantity = req.query.lotQuantity;
	var jobSheetNumber = req.query.jobSheetNumber;
	var processId = req.query.processId; 
	var timeTaken = req.query.timeTaken;
	var date = req.query.date;
	
	var newLot = {	
		employeeID: employeeID,
		lotNumber: lotNumber, 
		lotSize: lotSize, 
		lotQuantity: lotQuantity,
		jobSheetNumber: jobSheetNumber,
		processId: processId,
		timeTaken: timeTaken,
		date: date
	};
	
	// CREATING A NEW DATA ENTRY AND SAVING IT TO DB
	Lot.create(newLot, function(err, newLot){
			if(err){
				console.log(err);
			} else {
				console.log('NEW LOT ADDED \n=================');
				console.log(newLot);
				res.send('\n DATABASE UPDATE SUCESSFULL');
			}
	});
});

module.exports = router;
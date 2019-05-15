var express = require('express'),
	router = express.Router();

var	Process = require('../models/process');

router.post('/processes', isLoggedIn, function(req,res){  //respond as POST eventhough same route. USING REST API
	//GET DATA FROM THE FORM AND ADD TO ARRAY
	var processName = req.body.processName;
	var processCost = req.body.processCost;
	var processTime = req.body.processTime;
	var processId =req.body.processId;
	var newProcess = {	
		processName: processName, 
		processCost: processCost,
		processTime: processTime, 
		processId: processId 
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
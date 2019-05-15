var express = require('express'),
	router = express.Router();

var	Employee = require('../models/employee');
var	Lot = require('../models/lot');
var	Process = require('../models/process');
		

router.get('/employees', isLoggedIn, function(req,res){
	//GET ALL EMPLOYEES FROM DB
	Employee.find({}, function(err, employeesData){ //{} means you take everything from DB
		if(err){
			console.log(err);
		} else {
			res.render('employee_index',{employees:employeesData});
		}
	});
});

router.post('/employees', isLoggedIn, function(req,res){  //respond as POST eventhough same route. USING REST API
	//GET DATA FROM THE FORM AND ADD TO ARRAY
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var employeeID = req.body.employeeID;
	var position = req.body.position;
	var department = req.body.department;
	var picture = req.body.picture;	
	var newEmployee = {
					   firstName: firstName, 
					   lastName: lastName, 
					   employeeID: employeeID,
					   position: position,
					   department: department,
					   picture: picture,
					  };
	// CREATING A NEW DATA ENTRY AND SAVING IT TO DB
	Employee.create( newEmployee, function( err, newEmployee){
			if(err){
				console.log(err);
			} else {
				//redirect BACK TO EMPLOYEE PAGE
				console.log('NEW EMPLOYEE ADDED \n=================');
				console.log(newEmployee);
				res.redirect('/employees');
			}
		});
});

router.get('/employees/new', isLoggedIn, function(req,res){
	res.render("employee_new");
});


var timeTakenLot = []; //[ 10 ]
var processesIdLot = [];

var processesTimeDb =[]; //
var processesIdDb = []; //

// PROCESS INFO
var respectiveProcessTime = [];	
var performance = []; 
var unixTime = [1, 2 ,3];

var objToPass = {lots: [], unixTime: unixTime, timeTaken: timeTakenLot, processTime: respectiveProcessTime, performance: performance, foundEmployee: []};




router.get('/employees/:employeeDataId',isLoggedIn, function(req, res){ //SHOW RESTFUL API - WHICH SHOWS MORE INFO ABOUT SOMETHING
	
	
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
	
	Employee.findById(req.params.employeeDataId, function(err, foundEmployee){
		if(err){
			console.log(err);
		} else {
			objToPass.foundEmployee = foundEmployee; 
			var string = JSON.stringify(foundEmployee);
			var obj = JSON.parse(string);
			var employeeId = obj.employeeID;
			
			Lot.find({employeeID: employeeId}, function(err, foundLots){ //{} means you take everything from DB
				if(err){
					console.log(err);
				} else {
					
					objToPass.lots = foundLots;    //full RAW lot Database file from DB	
					foundLots.forEach(function(individualLot){
						var string = JSON.stringify(individualLot);
						var obj = JSON.parse(string);
						processesIdLot.push(obj.processId);
						timeTakenLot.push(obj.timeTaken);
					});


					Process.find({}, function(err, processesData){ //{} means you take everything from DB
						if(err){
							console.log(err);
						} else {

							processesData.forEach(function(individualProcess){
								var string = JSON.stringify(individualProcess);
								var obj = JSON.parse(string);
								processesIdDb.push(obj.processId);  //[100] - no duplicates
								processesTimeDb.push(obj.processTime);
							});	

							processesIdLot.forEach(function(processIdLot, i){

								processesIdDb.forEach(function(processIdDb, j){

									if (processIdLot == processIdDb){
										respectiveProcessTime.push(processesTimeDb[j]);
										// console.log( 'time taken = ' + timeTakenLot[j]);
										// console.log('processesTimeDb =' +  processesTimeDb[j]);
										performance.push(Math.round(100 - ((timeTakenLot[i] - processesTimeDb[j]) / processesTimeDb[j] *100)));
										// console.log('CALCULATION =' + performance);
									} else {
										// console.log("No matches"); //why does it output no match but still get correct output
									}											 
								});


							});



							res.render("employee_show", objToPass);
						}	

					});	
					

				}
			});				
			
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
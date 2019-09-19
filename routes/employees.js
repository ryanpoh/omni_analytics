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
	var baseSalary = req.body.baseSalary;	
	var newEmployee = {
					   firstName: firstName, 
					   lastName: lastName, 
					   employeeID: employeeID,
					   position: position,
					   department: department,
					   baseSalary: baseSalary,
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

// EDIT REST API
router.get('/employees/:employeeDataId/edit', isLoggedIn, function(req,res){
	Employee.findById(req.params.employeeDataId, function(err, foundEmployee){
		if(err){
			res.redirect("/employees");
		} else {
			res.render("employee_edit", {employee: foundEmployee});			
		}
	});
	
});

// UPDATE REST API
router.put("/employees/:employeeDataId", function(req,res){
	Employee.findByIdAndUpdate(req.params.employeeDataId, req.body.editEmployee, function(err,updatedEmployee){
		if(err){
			res.redirect("/employees");
		} else {
			res.redirect("/employees/"+req.params.employeeDataId);
		}
	})
});





router.get('/employees/:employeeDataId',isLoggedIn, function(req, res){ //SHOW RESTFUL API - WHICH SHOWS MORE INFO ABOUT SOMETHING
	
	
	// TAKEN FROM DB
	var timeTakenLot = []; 
	var processesIdLot = [];
	var entryCostLot = [];

	var processesTimeDb =[]; 
	var processesIdDb = []; 
	var processesCostDb = []; 
	var processesSellDb = []; 



	// PROCESS INFO	
	var respectiveProcessTime = [];	
	var performance = []; 
	var unixTime = [];
	var objToPass = {
						lots: [], 
						timeTaken: timeTakenLot, 
						processTime: respectiveProcessTime, 
						performance: performance, 
						foundEmployee: [],
						unixTime: unixTime,
						entryCost: entryCostLot,
					};
	
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
										performance.push(Math.round(100 - ((timeTakenLot[i] - processesTimeDb[j]) / processesTimeDb[j] *100)));
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
		//console.log("YOU PASS");
		return next();
	}
	//console.log("YOU FAIL");
	res.redirect("/login");
}



module.exports = router;
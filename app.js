var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride= require("method-override"),	
	passportLocalMongoose = require('passport-local-mongoose');

var User = require("./models/user");
var Superuser = require("./models/superuser");
var	Process = require('./models/process');


	// var newSuperuser = {
	// 				   username: "ryan", 
	// 				   password: "skyline123", 
	// 				  };

	// Superuser.create( newSuperuser, function( err, newSuperuser){
	// 		if(err){
	// 			console.log(err);
	// 		} else {
	// 			//redirect BACK TO EMPLOYEE PAGE
	// 			console.log('NEW SUPERUSER ADDED \n=================');
	// 			console.log(newSuperuser);
	// 		}
	// 	});


var employeeRoutes = require('./routes/employees'),
	processRoutes = require('./routes/processes'),
	indexRoutes = require('./routes/index'),
	apiRoutes = require('./routes/api');


mongoose.connect('mongodb+srv://rypoh1:xPh1Fl7T8hS02Lv7@cluster0-u4hbd.mongodb.net/test?retryWrites=true', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(()=> {
	console.log('Connected to MongoDB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true})); //tell Express to use bodyParser it is for the POST req
app.use(express.static(__dirname + '/public')); //to add local css and js files
app.use(methodOverride("_method"));


app.use(passport.initialize()); //sets up passport so we can use the methods in user.js model
app.use(passport.session());
app.use(require("express-session")({  //requiring and executing with some options
	secret: "hahahaha",
	resave: false,
	saveUninitialized: false
	
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/superuser', function(req, res){ 

	var superuser = req.query.su;
	var superuserPassword = req.query.supw; 
	var userCreate = req.query.uc;
	var passwordCreate = req.query.pwc;

	if (superuser != undefined){
		
		Superuser.find( {'username': superuser }, function( err, superuserData){

			if(err){
				console.log(err);
			} else {

				superuserData.forEach(function(foundSuperuser){
					var string = JSON.stringify(foundSuperuser);
					var obj = JSON.parse(string);
					username = obj.username;
					password = obj.password;

					if(superuser == obj.username & superuserPassword == obj.password){

						User.register(new User({username: userCreate }), passwordCreate, function(err,user){ //username and password
							if(err){
								console.log(err);
								res.send('SKYLINE BACKDOOR CONNECTION: SUCCESSFUL \n===========================\n\n---> STATUS: '+err);
							}
							passport.authenticate("local");
							console.log('NEW USER REGISTRATION SUCCESSFUL' + "\n=======================\n username: " +userCreate +"\n password: "+passwordCreate);
							res.send('SKYLINE BACKDOOR CONNECTION: SUCCESSFUL \n===========================\n\n---> STATUS: NEW USER REGISTRATION SUCCESSFUL' +
									 "\n username: " +userCreate +"\n password: "+passwordCreate);
						});

					} else {
						res.send('SKYLINE BACKDOOR CONNECTION: FAILED \n===========================\n\n---> STATUS: SUPERUSER ACCESS DECLINED');
					}	
				});
			}
		});
	} else {

		res.send('SKYLINE BACKDOOR CONNECTION: FAILED \n===========================\n\n---> STATUS: SUPERUSER ACCESS DECLINED');
	}	
});


// LOGIN
app.get('/login', function(req,res){
	res.render('login');  
});

// login logic (middleware)
app.post("/login", passport.authenticate("local",{
	successRedirect: "/home",
	failureRedirect: "/login"
}) ,function(req,res){
	
});

app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/");
});




app.use(employeeRoutes);
app.use(processRoutes);
app.use (indexRoutes);
app.use(apiRoutes);



function isLoggedIn(req,res, next){
	// if(req.isAuthenticated()){
	if(true){
		console.log("YOU PASS");
		return next();
	}
	console.log("YOU FAIL");
	res.redirect("/login");
}



app.listen(3000, function(){   // DEBUG LOCALLY
// app.listen(process.env.PORT || 5000, function(){  //DEPLOYMENT
	console.log('Skyline v10 server listening on port 5000');
});
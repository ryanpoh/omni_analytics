var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose');

var User = require("./models/user");


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


// UNCOMMENT FOR IN ADMIN APP REGISTRATION ///

// User.register(new User({username: "admintest1"}), "skyline123", function(err,user){ //username and password
// 	if(err){
// 		console.log(err);
// 	}
// 	passport.authenticate("local");
// 	console.log('REGISTRATION SUCCESSFUL');
// });


// var asia = [];


// Process.find({}, function(err, processesData){ //{} means you take everything from DB
// 	if(err){
// 		console.log(err);
// 	} else {
// 		var processes = processesData;
// 		var select_process = processesData[1];
// 		// console.log(select_process);
// 		var string = JSON.stringify(select_process);
// 		// console.log(string);
//         var obj = JSON.parse(string);
// 		console.log(obj);
// 		asia.push(obj.processTime);
		
		
// 	}
// });

// Process.find({}, function(err, processesData){ //{} means you take everything from DB
// 	if(err){
// 		console.log(err);
// 	} else {
// 		var processes = processesData;
// 		var select_process = processesData[1];
// 		console.log(select_process);
// 		var string = JSON.stringify(select_process);
// 		console.log(string);
//         var obj = JSON.parse(string);
// 		console.log(obj);
// 		console.log("Time = " + obj['processTime']);
// 	}
// });


// Process.find({processName:'Manufacturing Paper', processCost:'0.85'}, function(err, processesData){ //{} means you take everything from DB
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log(processesData);
// 	}
// });


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




app.listen(process.env.PORT || 5000, function(){
	console.log('Skyline v8 server listening on port 3000');
});
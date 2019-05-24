var mongoose = require("mongoose");

var employeesDataSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	employeeID: Number,
	position: String,
	department: String,
	// picture: {type: String, default: "https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg-1024x683.jpg"}
	picture: {type: String, 
			  default: "https://www.ibts.org/wp-content/uploads/2017/08/iStock-476085198.jpg"
			 },
	featured:{type: Boolean, 
			  default: false
			 },
	baseSalary: Number,
});

module.exports = mongoose.model("Employee", employeesDataSchema);

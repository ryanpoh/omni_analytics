var mongoose = require("mongoose");

var employeesDataSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	employeeId: Number,
	position: String,
	department: String,
	picture: {type: String, 
			  default:"https://www.ibts.org/wp-content/uploads/2017/08/iStock-476085198.jpg"
			 },
	featured:{type: Boolean, 
			  default: false
			 },
	baseSalary: Number,
});

module.exports = mongoose.model("Employee", employeesDataSchema);

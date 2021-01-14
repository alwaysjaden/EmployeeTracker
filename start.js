var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "dlauswo84!",
  database: "employeeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runApp();
});

function runApp() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add Department",
        "Add Roles",
        "Add Employees",
        "View Department",
        "View Roles",
        "View Employees",
        "Update employee roles",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "Add Department":
            addDepartment();
            break;

        case "Add Roles":
            addRole();
            break;

        case "Add Employees":
            addEmployee();
            break;

        case "View Department":
            viewDepartment();
            break;

        case "View Roles":
            viewRoles();
            break;

        case "View Employees":
            viewEmplyees();
            break;

      case "Update employee roles":
            updateRoles();
            break;

      case "exit":
        connection.end();
        break;
      }
    });
}

function addDepartment() {
  inquirer
    .prompt({
      name: "deparmentName",
      type: "list",
      choices: [
        "Sales",
        "Engineering",
        "Finance",
        "Legal",
        "Human Resource",
        "Administrator",
        "Back to Beginning"
      ]
    })
    .then(function(answer) {
       
      const departmentName = [`${answer.deparmentName}`]
      const query = "INSERT INTO department (name) VALUES (?)";
      connection.query(query, departmentName , function(err, res) {
        if (err) throw err;
        runApp();
      });
    });
   
}

function addRole() {
    inquirer
      .prompt([{
            name: "title",
            type: "list",
            choices: [
            "Sales Lead",
            "Salesperson",
            "Senior Engineer",
            "Junior Engineer",
            "Finance Manager",
            "Finance Associate",
            "Head of Legal",
            "Legal Associate",
            "Human Resource Manager",
            "Human Resource Associate",
            "Administrator",
            "Back to Beginning"
            ]
        },{
            name: "salary",
            type: "input",
            message: "Salary for this Position"
        }
    ])
      .then(function(answer) {

       const job = answer.title;
       const jobDescription = job.split(" ").join("");

       console.log(jobDescription)
       var jobTitle;
        if (jobDescription === "SalesLead" || jobDescription === "Salesperson") {
             jobTitle = "Sales"
            } 
            else if (jobDescription === "Senior Engineer" || jobDescription ==="Junior Engineer"){
               jobTitle = "Engineering"
              return jobTitle
            } else if (jobDescription === "Head of Legal" || jobDescription === "Legal Associate"){
               jobTitle =  "Finance"
            } else if (jobDescription === "Finance Manager" || jobDescription=== "Finance Associate"){
               jobTitle = "Legal"
            } else if (jobDescription=== "Human Resource Manager" || jobDescription === "Human Resource Associate"){
               jobTitle = "Human Resource"
            } else if (jobDescription === "Administrator" ){
               jobTitle = "Administrator"
            }
       
      console.log(jobTitle);

      var jobId;
function getDepartmentId() {
      const query = "SELECT id FROM department WHERE name = ? ";
      connection.query(query, jobTitle , (err, res) => {
          if (err) throw err;  
          console.log(res[0].id) 
          jobId = res[0].id
          roleDataInput()
        });
      }
function roleDataInput() {
        const roleInputs = [`${answer.title}`,`${parseInt(answer.salary)}`,`${jobId}`]
        const query = "INSERT INTO role (title,salary,department_id) VALUES (?,?,?)";
        connection.query(query, roleInputs , function(err, res) {
          if (err) throw err;
          runApp();
        });
      } 
    getDepartmentId()
  })
}

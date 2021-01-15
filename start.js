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

const runApp = () => {
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

const addDepartment = () => {
  inquirer
    .prompt({
      name: "deparmentName",
      type: "list",
      choices: [
        "Sales",
        "Engineering",
        "Finance",
        "Legal",
        "HR",
        "Administrator",
        "Back"
      ]
    })
    .then(function(answer) {
     
      const departmentName = [`${answer.deparmentName}`]
      if (departmentName === "Back") {
        runApp();
      }
      const query = "INSERT INTO department (name) VALUES (?)";
      connection.query(query, departmentName , function(err, res) {
        if (err) throw err;
        runApp();
      });
    });

}

const addRole = () => {
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
            "Administrator"
            ]
        },{
            name: "salary",
            type: "input",
            message: "Salary for this Position"
        }
    ])
      .then(function(answer) {
        
       const job = answer.title;
       console.log(job);
       const jobDescription = job.split(" ").join("");
       var jobTitle;
        if (jobDescription === "SalesLead" || jobDescription === "Salesperson") {
             jobTitle = "Sales"
            } 
            else if (jobDescription === "SeniorEngineer" || jobDescription ==="JuniorEngineer"){
               jobTitle = "Engineering"
              return jobTitle
            } else if (jobDescription === "HeadofLegal" || jobDescription === "LegalAssociate"){
               jobTitle =  "Legal"
            } else if (jobDescription === "FinanceManager" || jobDescription=== "FinanceAssociate"){
               jobTitle = "Finance"
            } else if (jobDescription=== "HumanResourceManager" || jobDescription === "HumanResourceAssociate"){
               jobTitle = "HR"
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


const addEmployee = () => {

  connection.query("SELECT title FROM role", function(err, res) {
    if (err) throw err;
    var roles = [];
    for (var i = 0; i <res.length; i++) {
    roles.push(res[i].title);
    }
    inquirer
    .prompt([{
          name: "firstName",
          type: "prompt",
          message: "What is Employee's First Name ? "
      },{
          name: "lastName",
          type: "input",
          message: "What is Employee's Last Name ? "
      },{
        name: "role",
        type: "list",
        choices: roles
      }
      // {
      //   name: "Manager",
      //   type: "input",
      //   choices: [    ]
      // }
  ])
    .then(function(answer) {

    var roleId;
    // var mangerId;

    function getRoleID() {
          const query = "SELECT id FROM role WHERE title = ? ";
          connection.query(query, job , (err, res) => {
              if (err) throw err;  
              console.log(res[0].id) 
              roleId = parseInt(res[0].id)
              employeeDataInput()
            });
            }



    function employeeDataInput() {
          const roleInputs = [`${answer.firstName}`,`${answer.lastName}`,`${roleId}`,"1"]
          const query = "INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)";
          connection.query(query, roleInputs , function(err, res) {
            if (err) throw err;
            runApp();
          });
          } 
          getRoleID()
  })

  });

}


const viewDepartment = () => {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
  console.table(res);
 runApp();
  });
}

const viewRoles = () => {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err;
  console.table(res);
 runApp();
  });
}

const viewEmplyees = () => {

  var query = "SELECT employee.first_name, employee.last_name, role.title, department.name, role.salary ";
  query += "FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) ";
  query += "ORDER BY employee.id";

  // INNER JOIN department ON (role.department_id = department.id)

  connection.query(query, function(err, res) {
    if (err) throw err;
  console.table(res);
 runApp();
  });
}

const updateRoles = () => {
    connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
      if (err) throw err;
      var employees = [];
      for (var i = 0; i <res.length; i++) {
        const firstNames = res[i].first_name;
        const lastName = res[i].last_name;
        employees.push(firstNames + "," + lastName);
      }

    connection.query("SELECT title FROM role", function(err, res2) {
      if (err) throw err;
      var roles = [];
      for (var i = 0; i <res2.length; i++) {
      roles.push(res2[i].title);
      }


    inquirer
    .prompt([{
          name: "roleChangeEmp",
          type: "list",
          message: "Witch Employee's Role Do you need to update ?",
          choices: employees
      },{
        name: "role",
        type: "list",
        message: "what is his/her new Role?",
        choices: roles
      }
      
    ])
    .then(function(answer) {
      const job = answer.role
      const selectedEmp = (answer.roleChangeEmp).split(",");
    // var mangerId;
      const getRoleID = () => {
        const query = "SELECT id FROM role WHERE title = ?";
        connection.query(query, job, (err, res) => {
          var roleId;
            if (err) throw err;  
            roleId = res[0].id
            // console.log(roleId)
              const newRole = () => {
                const query = "UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?";
                connection.query(query,[ roleId , selectedEmp[0] , selectedEmp[1]], (err, res) => {
                  if (err) throw "err";
                  console.log(`Role of ${answer.roleChangeEmp} has been updated Sucessfully`)
                  runApp();
                });
                runApp();
                };
            newRole()
        });
      }   
      getRoleID() 
    });
  });  
})};




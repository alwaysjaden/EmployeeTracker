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


// display promots to show what user wants to do in application 
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
        "Delete Deparment",
        "Delete Role",
        "Delete Employee",
        "exit"
      ]
    })
    // direct what function each choice of prompts will execute//
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

        case "Delete Deparment":
              deleteDepartment();
              break;

        case "Delete Role":
              deleteRole();
              break;

        case "Delete Employee":
              deleteEmployee();
              break;

      case "exit":
        connection.end();
        break;
      }
    });
}
// function to add New Department 
const addDepartment = () => {
  inquirer
    .prompt({
      name: "deparmentName",
      type: "input",
      message: "What is the Name of the Department?"
    })
    .then(function(answer) {
      // typed input value will be placed to SQL database in department table 
      const departmentName = [`${answer.deparmentName}`]
      console.log(departmentName);
      const query = "INSERT INTO department (name) VALUES (?)";
      connection.query(query, departmentName , (err, res) => {
        if (err) throw err;
        runApp();
      });
    });

}
// function to add New Role 
const addRole = () => {
// call current existing departments to used in order do use existing key value from department table
  var departments= [];
  connection.query("SELECT name FROM department", (err, res3) => {
    if (err) throw err;
    for (var i = 0; i <res3.length; i++) {
      departments.push(res3[i].name);
    } 
  // add another array into choices for the prompt so user can create new department if it doesn't exist
    departments.push("New Department")
  });
  // ask prompts that are needed to create new role//
    inquirer
    .prompt([{
          name: "title",
          type: "input",
          message: "What Role Do you want to Add?"
      },{
          name: "salary",
          type: "input",
          message: "Salary for this Position"
      },{
        // department list will display all departments that are in database 
        name: "deparment",
        type: "list",
        choices: departments
    }])
      .then(function(answer) {

        // if user need to add new department this will allow user to add new department
        if (answer.deparment === "New Department"){
            console.log("Please Create Department First")
            addDepartment();
            } else {
              getDepartmentId()
            } 
        const job = answer.title;
        // const jobTitle = answer.deparment;

        // Get Key Value (ID) of selected department from department table to use in role table 
        function getDepartmentId() {
              const query = "SELECT id FROM department WHERE name = ? ";
              connection.query(query, answer.deparment , (err, res) => {
                  if (res[0] === null || res[0] === undefined) {
                    console.log(" ** Department Doesn't exist!!! ** Please Add Department First to Add Role")
                    runApp();
                    return;
                  } else {      
                  console.log(res[0].id); 
                  jobId = res[0].id;
                  roleDataInput();}                  
                });
              
              };
        // insert newly created role into database : role table
        function roleDataInput() {
                const roleInputs = [`${answer.title}`,`${parseInt(answer.salary)}`,`${jobId}`]
                const query = "INSERT INTO role (title,salary,department_id) VALUES (?,?,?)";
                connection.query(query, roleInputs , (err, res) => {
                  if (err) throw err;
                  console.log(" New Role has been Created")
                  runApp();
                });
              }; 
              
  });
}

// adding new employee
const addEmployee = () => {

  // get existing roll list 
  connection.query("SELECT title FROM role", function(err, res) {
    if (err) throw err;   
    var roles = [];
    for (var i = 0; i <res.length; i++) {
    roles.push(res[i].title);
    }
    roles.push("Create New Role")

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
  ])
    .then(function(answer) {
      // if user need to add new department this will allow user to add new department
      if (answer.deparment === "Create New Role"){
        console.log("Please Create New Role First")
        addRole();
        } else {
          getRoleID()
        } 
      // empty arry in roleId to get id value from role table
    var roleId;
    // console.log(job)
    // get role id that matches selected title of role //
    function getRoleID() {
          const query = "SELECT id FROM role WHERE title = ? ";
          connection.query(query, `${answer.role}` , (err, res) => {
            if (res === null || res === undefined) {
              console.log(" ** Selected Roll Doesn't exist!!! ** Please Add Roll First to your Employee")
              addRole();
              return;
            } else {
              console.log(res[0].id) 
              roleId = parseInt(res[0].id)
              employeeDataInput()
            }
            });
            }
        // add employee data into sql database //
    function employeeDataInput() {
          const roleInputs = [`${answer.firstName}`,`${answer.lastName}`,`${roleId}`,"1"]
          const query = "INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)";
          connection.query(query, roleInputs , (err, res) => {
            if (err) throw err;
            console.log(" New Employee has been Added")
            runApp();
          });
          } 
          
    });
  });
}

// view all department in form of table //
  const viewDepartment = () => {
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
      const array = res
      // remove index number and replace index number with department id
      const transformed = array.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {})
      console.table(transformed);
    // console.table(res);

    runApp();
    });
  }
// view all roles in form of table //
  const viewRoles = () => {
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      const array = res;
      // remove index number and replace index number with role id//
      const transformed = array.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {})
      // console.table(res)
      console.table(transformed);
    // console.table(res);
    runApp();
    });
  }
// view alldata about employee by joining all three tables and get data from each tables //
  const viewEmplyees = () => {
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary ";
    query += "FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) ";
    query += "ORDER BY employee.id";

    // INNER JOIN department ON (role.department_id = department.id)

    connection.query(query, (err, res) => {
      if (err) throw err;
      const array = res;
      // remove index number and replace index number with emplyee id//
      const transformed = array.reduce((acc, {id, ...x}) => { acc[id] = x; return acc}, {})
      console.table(transformed);
    // console.table(res);
    
    runApp();
    });
}
// role update 
const updateRoles = () => {
  // get list of current employees from SQL database 
  connection.query("SELECT first_name, last_name FROM employee", (err, res) => {
    if (err) throw err;
    var employees = [];
    for (var i = 0; i <res.length; i++) {
      // seperate variable for first name and last name //
      const firstNames = res[i].first_name;
      const lastName = res[i].last_name;
      // display full name in prompt
      employees.push(firstNames + "," + lastName);
      }
  // get list of existing roles from SQL database 
  connection.query("SELECT title FROM role", (err, res2) => {
    if (err) throw err;
    var roles = [];
    for (var i = 0; i <res2.length; i++) {
    roles.push(res2[i].title);
    }
    roles.push("Create New Role");

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
      // check if new department is needed 
      if (answer.role === "Create New Role"){
        console.log("Please Create New Role First")
        addRole();
        } else {
          getRoleID();
        } 

      // const job = answer.role
      // split selected name into firstname and lastname 
      const selectedEmp = (answer.roleChangeEmp).split(",");
    // var mangerId;
    // get selected Role ID from SQL database
      function getRoleID(){
        const query = "SELECT id FROM role WHERE title = ?";
        connection.query(query, answer.role, (err, res) => {
          var roleId;
            if (err) throw err;  
            roleId = res[0].id
            // console.log(roleId)//
            // update employee's role to New Role//
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
    });
  });  
})};

//Delete existing employee//
const deleteEmployee = () => {
  //get list of existing Empolyee from SQL Database //
  connection.query("SELECT first_name, last_name, id FROM employee", (err, res4) => {
    if (err) throw err;
    var delEmployees = [];
    for (var i = 0; i <res4.length; i++) {
      const firstNames = res4[i].first_name;
      const lastName = res4[i].last_name;
      const empId = res4[i].id;
      delEmployees.push(firstNames + "," + lastName + "," + empId );
      }

    inquirer
      .prompt({
            name: "empDelete",
            type: "list",
            message: "Withch Employee Do you want to removed from Database?",
            choices: delEmployees
        })
    .then(function(answer) {
    
      const empDelArray = (answer.empDelete).split(",");
      // console.log(empDelArray)//
      // Delete Selected Employee that matched by both First Name and Last Name  //
        const delEmployee = () => {
          const query = "DELETE FROM employee WHERE first_name = ? AND last_name = ? and id = ?";
          connection.query(query,[ empDelArray[0] , empDelArray[1], empDelArray[2]], (err, res) => {
            if (err) throw "err";
            console.log(`Employee  ${answer.empDelete} has been Deleted from Database Sucessfully`)
            runApp();
          });
          runApp();
        };
              delEmployee()
        });
      }         
    );
  };  

  const deleteDepartment = () => {
    //get list of existing department name from SQL Database //
    connection.query("SELECT name FROM department", (err, res5) => {
      if (err) throw err;
      var delDepartment = [];
      for (var i = 0; i <res5.length; i++) {
        const depToDel = res5[i].name;
        delDepartment.push(depToDel);
        }
  
      inquirer
        .prompt({
              name: "depDelete",
              type: "list",
              message: "Withch Department Do you want to removed from Database?",
              choices: delDepartment
          })
      .then(function(answer) {
      
        // delete department that matchs prompt //
        const delDepartment = () => {
          const query = "DELETE FROM department WHERE name = ?";
          connection.query(query,answer.depDelete, (err, res) => {
            if (err) throw "err";
            console.log(`Department ${answer.depDelete} has been Deleted from Database Sucessfully`)
            runApp();
          });
          runApp();
        };
      delDepartment()
          });
        }         
      );
    };


    const deleteRole = () => {
      //get list of existing role title from SQL Database //
      connection.query("SELECT title FROM role", (err, res5) => {
        if (err) throw err;
        var delRole = [];
        for (var i = 0; i <res5.length; i++) {
          const roleToDel = res5[i].title;
          delRole.push(roleToDel);
          }
    
        inquirer
          .prompt({
                name: "roleDelete",
                type: "list",
                message: "Withch Role Do you want to removed from Database?",
                choices: delRole
            })
        .then(function(answer) {
        
          console.log(answer.roleDelete)
  
                // delete department that matchs prompt //
          const delRole = () => {
            const query = "DELETE FROM role WHERE title = ?";
            connection.query(query,answer.roleDelete, (err, res) => {
              if (err) throw "err";
              console.log(`Role ${answer.roleDelete} has been Deleted from Database Sucessfully`)
              runApp();
            });
            runApp();
          };
          delRole()
            });
          }         
        );
      };





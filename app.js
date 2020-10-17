const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const {
    query
} = require("express");

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config)
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err)
                resolve(rows)
            })
        })
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err)
                resolve()
            });
        });
    }
}

const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Greenz123!",
    database: "employee_tracker"
});

// showing employee summary
async function showEmployeeSummary() {
    await db.query('SELECT e.id, e.firts_name AS Firts_Name, e.last_name AS Last_name, title AS Title, salary AS Salary, name AS Department, CONCAT(m.fisrt_name, "", last_name) AS Manager FROm employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id', (err, res) => {
        if (err) throw err;
        console.log(res);

        managers.unshift({ id: null, Manager: "None "});

        inquirer
        .prompt([
            {
                name: "firstname",
                type: "input",
                message: "Enter employee's first name:"
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter employee's last name:"
            },
            {
                name: "role",
                type: "list",
                message: "Choose employee role:",
                choices: positions.map(obj => obj.title)
            },
            {
                name: "manager",
                type: "list",
                message: "Choose employee's manager:",
                choices: positions.map(obj => obj.Manager)
            }
        ]).then((answer) => {
            let positionDetails = positions.find(obj => obj.title === answers.role);
            let manager = managers.find(obj => obj.Manager === answers.manager);
            db.query("INSERT INTO employee (fisrt_name, last_name, role-id, manager_id) VALUES (?)", [[answers.firstName, answers.lastName, positionDetails.id, manager.id]]);
            console.log(`${answers.firstName} was added to the employee database!`);
            runApp();
        })
    })
}

async function removeEmployee() {
    let employees = await db.query('SELECT id, CONCAT(firts_name, " ", last_name) AS name FROM employee');
    employees.push({ id: null, name: "Cancel" });

    inquirer
    .prompt([
        {
            name: "tarhetEmployee",
            type: "list",
            message: ""
        }
    ])
}

// adding new employee
async function addEmployee() {
    let positions = await db.query('SELECT id, title FROM role');
    let managers = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS Manager FROM employee');
    managers.unshift({id: null, Manager: "None"});

    inquirer
        .prompt([{
            name: "firstName",
            type: "input",
            message: "Enter employee's first name:"
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter employee's last name:"
        },
        {
            name: "role",
            type: "list",
            message: "Choose employee role:",
            choices: positions.map(obj => obj.title)
        },
        {
            name: "manager",
            type: "list",
            message: "Choose the employee's manager:",
            choices: managers.map(obj => obj.Manager)
        }
        ]).then((answers) => {
            let positionDetails = positions.find(obj => obj.title === answers.role);
            let manager = managers.find(obj => obj.Manager === answers.manager);
            db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)",
            [[answers.firstName, answers.lastName, positionDetails.id, manager.id]]);
            console.log(`${answers.firstName} was added to the employee database!`);
            runApp();
        });
}

// remove new employee
async function removeEmployee() {
    let employees = await db.query('SELECT id, CONCAT(first_name, "", last_name) AS name FROM employee');
    employees.push({id: null, name: "Cancel"});

    inquirer
    .prompt([
        {
            name: "employeeName",
            type: "list",
            message: "Remove which employee?",
            choices: exmployees.map(obj => obj.name)
        }
    ]).then((responce) => {
        if(responce.employeeName != "Cancel") {
            let unluckyEmployee = employees.find(obj => obj.name === responce.employeeName);
            db.query("DELETE FROM employee WHERE id=?", unluckyEmployee.id);
            console.log(`${responce.employeeName} was let go...`);
        }
        runApp();
    })
};

async function addRole() {};

async function addDepartment() {};

async function updateManager() {};



function runApp() {
    inquirer.prompt({
        name: "mainmenu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "Edit employee info",
            "View roles",
            "Edit roles",
            "View Departments",
            "Edit Departments"
        ]
    }).then(responces => {
        switch (responces.mainmenu) {
            case "View all employees":
                showEmployeeSummary();
                break;
            case "Edit employee info":
                editEmployeeOptions();
                break;
            case "View roles":
                showRoleSummary();
                break;
            case "Edit Roles":
                editRoleOptions();
                break;
            case "View Departments":
                showDepartments();
                break;
            case "Edit Departments":
                editDepartmentOptions();
                break;
        }
    })
}

runApp();
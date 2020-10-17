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

async function employeeSummary() {
    await db.query('SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, title AS Title, salary AS Salary, name AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id', (err, res) => {
        if (err) throw err;
        console.log(res);
        runApp();
    });
}

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

async function removeEmployee() {};

async function updateManager() {};

function runApp() {
    inquirer
    addEmployee();
    break;
    case "Epdate Employee info":
        break;
    case "Remove an employee":
        break;
}

runApp();
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

function runApp() {
    inquirer
    .prompt({
        name: "mainmenu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all employeers",
            "Add a new employee",
            "Add a new role",
            "Add a new Department"
        ]
    }).then( (res) => {
        switch (res.mainmenu) {
            case "View all employeers":
                employeeSummary();
                break;
            case "Add a new employee":
                break;
            case "Add a new role":
                break;
            case "Add a new Department":
                break;
        }
    });
}

runApp();
USE employee_tracker;

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1), ('Salesperson', 80000, 1), ('Lead Engineer', 150000, 2), ('Software Engineer', 120000, 2), ('Accountant', 125000, 3), ('Legal Team Lead', 250000, 4), ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Myers", 1, null), ("Lurie", "Strode", 3, null), ("Tommy", "Doyle", 4, null), ("Marion", "Chambers", 4, 2), ("Lonnie", "Elam", 6, null), ("Lindsey", "Wallace", 2, 1), ("Karen", "Nelson", 2, 1)
var mysql = require("mysql");
var inquirer = require("inquirer");

// connect to local DB
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "FILL ME BACK IN",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// function which prompts the user for what action they should take
function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.log("Welcome to bamazon! Here's a list of available products:");

        for (i = 0; i < res.length; i++) {
            console.log("Name: " + res[i].product_name)
            console.log("Product ID: " + res[i].id)
            console.log("Price: $" + res[i].price + "\n")
        }
        //console.log(res);
        //connection.end();

        startPrompt();
    });
}

function startPrompt() {
    inquirer
        .prompt([
            {
                name: "startOrStop",
                type: "list",
                message: "Would you like to make a purchase?",
                choices: ["Yes", "No", "Show me the choices again"]
            }
        ])
        .then(function (answer) {
            if (answer.startOrStop === "No") {
                console.log("Goodbye!");
                connection.end();
            } else if (answer.startOrStop === "Show me the choices again") {
                start();
            } else {
                buyPrompt();
            }

        });
}

function buyPrompt() {
    inquirer
        .prompt([
            {
                name: "prodChoice",
                type: "input",
                message: "What's the ID of the product you'd like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "count",
                type: "input",
                message: "How many units would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {

            checkPurchase(answer.prodChoice, answer.count);

        });
}

function checkPurchase(itemID, qty) {

    connection.query("SELECT * FROM products WHERE ?",
        {
            id: itemID
        },
        function (err, res) {
            if (err) throw err;

            let stock = res[0].stock_quantity;
            let price = res[0].price;

            if (stock >= qty) {
                console.log("You can buy that!");
                finalizePurchase(itemID, qty, stock, price);
            } else {
                console.log("There aren't enough units to purchase that! Let's start over...");
                startPrompt();

            }
            //console.log(res);
        });
}

function finalizePurchase(itemID, qty, stock, price){

    let newStock = stock - qty;
    let totalCost = qty * price;

    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newStock
            },
            {
                id: itemID
            }
        ],
        function(error) {
            if (error) throw err;
            
            console.log("Purchase successful! Your total is $" + totalCost);
            startPrompt();
        }
    );
}
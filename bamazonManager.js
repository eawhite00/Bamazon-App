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
    password: "<SET YOUR PASSWORD>",
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
    inquirer
        .prompt([
            {
                name: "welcome",
                type: "list",
                message: "What would you like to do?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "I'm done"]
            }
        ])
        .then(function (answer) {
            switch (answer.welcome) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLowInventory();
                    break;
                case "Add to Inventory":
                    chooseProductToAdd();
                    break;
                case "Add New Product":
                    addProduct();
                    break
                case "I'm done":
                    console.log("Goodbye!");
                    connection.end();
                    break;
            }

        });
}

// Just a SELECT for all of the breeder
function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.log("All available products: \n")
        for (i = 0; i < res.length; i++) {
            console.log("Name: " + res[i].product_name)
            console.log("Product ID: " + res[i].id)
            console.log("Price: $" + res[i].price)
            console.log("Quantity in stock: " + res[i].stock_quantity + "\n")
        }

        //Go back to the selection prompt
        start();
    });
}


// Pretty much the same as viewProducts, just with a Where clause
function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;

        console.log("Here's the products with fewer than 5 items in stock: \n")
        for (i = 0; i < res.length; i++) {
            console.log("Name: " + res[i].product_name)
            console.log("Product ID: " + res[i].id)
            console.log("Price: $" + res[i].price)
            console.log("Quantity in stock: " + res[i].stock_quantity + "\n")
        }

        //Go back to the selection prompt
        start();
    });

}

function chooseProductToAdd() {
    inquirer
        .prompt([
            {
                name: "prodChoice",
                type: "input",
                message: "What's the ID of the product you'd like to restock",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "toAdd",
                type: "input",
                message: "How many units would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            //update the inventory with that info
            updateInventory(answer.prodChoice, answer.toAdd);

        });
}

function updateInventory(itemID, additional) {

    //start with the amount of stock we're going to add
    let newStock = additional;

    //First we grab the existing stock of the item from the db
    connection.query("SELECT * FROM products WHERE ?",
    {
        id: itemID
    },
    function (err, res) {
        if (err) throw err;

        //add the existing stock to the amount to add
         newStock += res[0].stock_quantity;

    });


    //set the new stock value in the db
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
            
            console.log("Success! You've added " + additional + " units");
            start();
        }
    );
}

function addProduct() {
    // Prompt for the product info
    inquirer
      .prompt([
        {
          name: "itemName",
          type: "input",
          message: "What is the name of product you would like to add?"
        },
        {
          name: "itemDepartment",
          type: "input",
          message: "What department would you like to place your auction in?"
        },
        {
          name: "itemPrice",
          type: "input",
          message: "What's the item's price'?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
            name: "itemStock",
            type: "input",
            message: "How many of the item will you have?",
            validate: function(value) {
              if (isNaN(value) === false) {
                return true;
              }
              return false;
            }
          }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.itemName,
            department_name: answer.itemDepartment,
            price: answer.itemPrice,
            stock_quantity: answer.itemStock
          },
          function(err) {
            if (err) throw err;
            console.log("Your product has been added!");
            // Back to the start
            start();
          }
        );
      });
  }
const express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var neo4j = require("neo4j-driver");
const { time } = require("console");
//const { query } = require('express');
const app = express();
const port = 3000;

// View engine ans set view engine to ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));

// parser for the requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// bootstrap
// app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
// app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

// neo4j server
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "123"));
var session = driver.session();

// index page
app.get("/", function (req, res) {
  // session
  //   .run("MATCH(n:recipe) return n LIMIT 25")
  //   .then(function (result) {
  //     var recipeArr = [];
  //     result.records.forEach(function (record) {
  //       recipeArr.push({
  //         // id: record._fields[0].identiy.id.low,
  //         name: record._fields[0].properties.name,
  //         time: record._fields[0].properties.time,
  //       });
  //     });
  // res.render("index", {
  //   recipes: recipeArr,
  // });
  // })
  // .catch(function (err) {
  //   console.log(err);
  // });
  res.render("index");
});

// about page
app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/recipe/list", function (req, res) {
  console.log(req.body);
  // var ingredient1 = req.body.ingredient1;
  //var ingredient2 = req.body.ingredient2;
  //console.log(ingredient1)
  //console.log(ingredient2)
  ingredient_array = [];
  const obj = Object.assign({}, req.body);
  var ingredient = "";
  for (const [key, value] of Object.entries(obj)) {
    if (value) {
      ingredient += "'" + value + "'" + ", ";
      ingredient_array.push(value);
    }
  }
  console.log(ingredient.slice(0, -2));
  ingredient = ingredient.slice(0, -2);
  query =
    "WITH [ " +
    ingredient +
    " ] as names MATCH (p:ingredient) WHERE p.name in names WITH collect(p) as ingredient MATCH (m:recipe) WHERE ALL(p in ingredient WHERE (p)<-[:NEED]-(m)) RETURN m ";
  session
    .run(query)
    .then(function (result) {
      console.log(result);
      var recipeArray = [];
      result.records.forEach(function (record) {
        console.log(record);
        recipeArray.push({
          id: record._fields[0].identity.low,
          name: record._fields[0].properties.name,
          time: record._fields[0].properties.time,
          link: record._fields[0].properties.link,
          image: record._fields[0].properties.image,
        });
      });
      result = recipeArray.length;
      res.render("recipes", {
        recipes: recipeArray,
        results: result,
        ingredient_used: ingredient_array,
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log("Server Started on Port 3000");
  console.log("Link: http://localhost:3000/");
});

module.exports = app;

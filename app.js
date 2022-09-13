const express = require('express');
const path = require('path');
var mysql = require('mysql');
const bodyParser = require('body-parser');


app = express();
app.use(express.static(__dirname+"public"));

app.use(bodyParser.urlencoded({extended: true}));

const hostname = '127.0.0.1';
const port = 3000;

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'toor',
});

con.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
});

app.get('/', function (req, res) {
    // get all the data from the database
    // con.query('SELECT * FROM mydb.users', function (err, rows, fields) {
    //     if (err) throw err;
    //     res.json( rows );
    // });
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


// create a route to get form data and insert into database and if database is not created, create it
app.post('/submit', function (req, res) {
  // deconstruct the request body into name,email and password
  const { name, email, password } = req.body;

    var sql = "CREATE DATABASE IF NOT EXISTS mydb";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
    var sql = "CREATE TABLE IF NOT EXISTS mydb.users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
    var sql = "INSERT INTO mydb.users (name, email, password) VALUES ('"+name+"', '"+email+"', '"+password+"')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    con.query('SELECT * FROM mydb.users', function (err, rows, fields) {
          if (err) throw err;
     
          // convert rows to json
          res.json( rows );
      });
  
});

app.delete('/delete',(req,res)=>{
  const { id } = req.body;
  var sql = "DELETE FROM mydb.users WHERE id = '"+id+"'";
  con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record deleted");
  });
  res.redirect('/');
})

app.listen(port);
console.log("server listining on port: "+ port);
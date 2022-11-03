const express = require('express');
const fs = require('fs');
const app = express();
const {exec} = require("child_process")
app.set('view engine', 'ejs');
app.get('/', (req, res, next) => {
  var test = require("./tasks.json");
  var data = {
    names: ['geddy', 'neil', 'alex']
  };
  res.render("index", {data:data, task:test});
});
app.get('/submit', (req, res, next) => {
  res.send(`QUESTIONS ATM: A1(a + b)\n<form method="POST" action="/submit">
  <textarea type="text" name="code" placeholder="code" rows="30" cols="90"></textarea>
  <textarea type="text" name="q" placeholder="q"></textarea>
  <input type="submit">
</form>`);
});

app.post('/submit', function (req, res, next) {
  fs.writeFile("./pain/main.cpp", req.body.code, function(err) {if(err) throw err});
  fs.writeFile("./pain/communicate.txt", req.body.q, function(err) {if(err) throw err});
  exec("sudo docker build -t app .", (err) => {
    if(err) {
      console.log(err.message);
      return;
    }
      exec("sudo docker run app", (err, stdout, stderr) => {
        if(err) {
          res.send(err.message);
        } else if(stderr) {
          res.send(stderr);

        } else if(stdout) {
          res.send(stdout);
        }
      });
  });
});

app.listen(8080);
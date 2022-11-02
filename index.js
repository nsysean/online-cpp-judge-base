const express = require('express');
const fs = require('fs');
const app = express();
const {exec} = require("child_process")
app.use(express.urlencoded());

app.get('/', (req, res, next) => {
  res.send(`<form method="POST" action="/">
  <textarea type="text" name="code" placeholder="code" rows="30" cols="90"></textarea>
  <textarea type="text" name="q" placeholder="q"></textarea>
  <input type="submit">
</form>`);
});

app.post('/', function (req, res, next) {
  fs.writeFile("./pain/main.cpp", req.body.code, function(err) {if(err) throw err});
  fs.writeFile("./pain/communicate.txt", req.body.q, function(err) {if(err) throw err});
  exec("sudo docker build -t app .", (err) => {
    if(err) {
      console.log(err.message);
      return;
    }
      exec("sudo docker run app", (err, stdout, stderr) => {
        if(stdout) {
          res.send(JSON.parse(stdout));
          return;
        }
        if(stderr) {
          console.log(stderr);
          return;
        }
        if(err) {
          console.log(err.message);
          return;
        }
      });
  });
});

app.listen(3000);
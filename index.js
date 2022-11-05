const express = require('express');
const fs = require('fs');
const app = express();
const path = require("path");
const {exec} = require("child_process")
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.get('/', (req, res, next) => {
  var test = require("./tasks.json");
  res.render("index2", {task:test});
});
var file = require("./tasks.json");
file.Tasks.forEach(task => {
  const folder = `./pain/problems/${task.ID}/input/`;
  const ik = require("./submissions.json");
  var idk = parseInt(ik.Submissions[ik.Submissions.length-1].ID) + 1;
  var arr = [];
  fs.readdirSync(folder).forEach(file => {
    if(path.parse(file).name[0]=='E'){
      var a = fs.readFileSync(`./pain/problems/${task.ID}/input/${file}`), b=fs.readFileSync(`./pain/problems/${task.ID}/output/${path.parse(file).name}`+'.out');
    arr.push({
      "INPUT": a,
      "OUTPUT": b
    })
  }
  });
  app.get('/tasks/'+task.ID, (req, res, next) => {
    res.render("task", {tasc: task, arr:arr, subid: idk});
  })
})
app.get('/submissions.json', (req, res, next) => {
  res.send(require("./submissions.json"));
})
app.get('/submissions', (req, res, next) => {
  var cute = require("./submissions.json");
  const urlParams = new URLSearchParams(req.query);
  const id = urlParams.get('id');
  var i = 0;
  const folder = `./pain/problems/${cute.Submissions[id-1].Task}/input/`;
  fs.readdirSync(folder).forEach(file => {
    if(path.parse(file).name[0]!='E'){
      i++;
    }
  });
  res.render("subs", {cts:cute, id:id, tt:i});
})
app.post('/submit', function (req, res, next) {
  var cute = require("./submissions.json");
  console.log(req.body.code);
  cute.Submissions.push({
    "ID": cute.Submissions.length + 1,
    "Task": req.body.q,
    "Code": req.body.code,
    "Verdicts": []
  });
  fs.writeFile("./submissions.json", JSON.stringify(cute), function(err) {if(err) throw err});
  fs.writeFile("./pain/main.cpp", req.body.code, function(err) {if(err) throw err});
  fs.writeFile("./pain/communicate.txt", req.body.q, function(err) {if(err) throw err});
  exec("sudo docker build -t app .", (err) => {
    if(err) {
      console.log(err.message);
      return;
    }
      exec("sudo docker run --network none app", (err, stdout, stderr) => {
        if(err) {
          console.log(err.message);
        } else if(stderr) {
          console.log(stderr);

        } else if(stdout) {
          cute.Submissions[cute.Submissions.length -1].Verdicts=JSON.parse(stdout);
          fs.writeFile("./submissions.json", JSON.stringify(cute), function(err) {if(err) throw err});
          console.log(stdout);
        }
      });
  });
});
app.listen(3000);

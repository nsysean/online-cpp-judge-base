const express = require("express");
const { exec, spawn } = require("child_process");
const bodyParser = require('body-parser');
const fs = require("fs");
const fsExtra = require("fs-extra");
const app = express();
var queue = [];

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/validate', (req, res, next) => {
    res.send(`<form method="POST" action="/validate">
    <textarea type="text" name="tcs" rows="30" cols="30">TCS</textarea>
    <textarea type="text" name="code" rows="30" cols="30">Validator</textarea>
    <input type="submit">
    </form>`);
})

app.post('/validate', function (req, res, next) {
    queue.push(req.body);
    if(queue[queue.length-1] == req.body) {
        console.log(queue.length);
        console.log(req.body);
        fs.writeFile('./main.cpp', req.body.code, function (err) {
            if(err) {
                throw err;
            }
        });
        fs.writeFile(`./input.txt`, req.body.tcs, function(err) {
            if(err) {
                throw err;
            }
        }); 
        exec("cd validator && g++ ../main.cpp && cd ..", (err, stdout) => {
            if(err) {
                throw err;
            } else {
                exec("sudo docker build -t app .", (err, stdout, stderr) => {
                    if(err) {
                        throw err;
                    } else if(stdout) {
                        exec("sudo docker run --network none app", (err, stdout, stderr) => {
                            if(err) {
                                throw err;
                            } else if(stdout) {
                                console.log(stdout);
                            }
                        });
                    }
                });
            }
        });
        exec("sudo docker system prune --force", (err, stdout) => {
            if(err) {
                console.log(err);
            } else if(stdout) {
                console.log(stdout);
            }
        });
        queue.pop();
    }
});

app.listen(8080);
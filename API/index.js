const express = require("express");
const { exec, spawn } = require("child_process");
const bodyParser = require('body-parser');
const fs = require("fs");
const fsExtra = require("fs-extra");
const app = express();
var queue = [];

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/validate', function (req, res, next) {
    queue.push(req.body);
    if(queue[queue.length-1] == req.body) {
        fs.writeFile('./validator/main.cpp', req.body.code, function (err) {
            if(err) {
                throw err;
            }
        });
        fs.writeFile(`./validator/input.txt`, req.body.tcs, function(err) {
            if(err) {
                throw err;
            }
        });
        fs.rmSync("./validator/b.txt", {
            force: true,
        });
        if(req.body.multiple == "true") {
            fs.writeFile('./validator/b.txt', 'a', (err) => {
                if(err) throw err;
            });
        }
        exec("sudo docker build -t app .", (err, stdout) => {
            if(err) {
                throw err;
            } else if(stdout) {
                exec("sudo docker run --network none app", (err, stdout) => {
                    if(err) {
                        throw err;
                    } else if(stdout) {
                        var input = fs.readFileSync('./validator/input.txt'), inputs = [], arr = [];
                        if(req.body.multiple == "true") {
                            do {
                                var pos = input.toString().search("===");
                                var s = input.toString().substring(0, pos);
                                input = input.toString().substring(pos + 5, input.toString().length);
                                inputs.push(s);
                            } while(input.toString().search("===") != -1);
                        }
                        inputs.push(input);
                        var results = JSON.parse("["+stdout.toString().substring(0, stdout.toString().length-2)+"]");
                        for(var inp of inputs) {
                            var i = results.find(element => element.inpu == inp);
                            arr.push(i ? i.err : "Valid");
                        }
                        res.send(arr);
                    }
                });
            }
        });
        exec("sudo docker system prune --force", (err, stdout) => {
            if(err) {
                throw err;
            }
        });
        queue.pop();
    }
});

app.listen(8080);

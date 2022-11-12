const express = require("express");
const { exec, spawn } = require("child_process");
const bodyParser = require('body-parser');
const fs = require("fs");
const fsExtra = require("fs-extra");
const app = express();
var queue = [], queue2 = [];

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/validate', function(req, res, next) {
    res.send(`<form action='/validate' method='post'> 
    <input type='submit' value='Submit'> 
</form>`);
});

app.post('/validate', function (req, res, next) {
    req.body.tcs = "1\r\n===\r\n0\r\n";
    req.body.code =  `#include "testlib.h"

    int main(int argc, char* argv[]) {
    registerValidation(argc, argv);
        inf.readInt(1, 100, "n");
        inf.readEoln();
        inf.readEof();
    }`;
    req.body.multiple = "true"
    queue.push(req.body);
    console.log(req.body);
    if(queue[0] == req.body) {
        fs.writeFile('./validator/main.cpp', req.body.code, function (err) {
            if(err) {
                console.log(err);
            }
        });
        fs.writeFile(`./validator/input.txt`, req.body.tcs, function(err) {
            if(err) {
                console.log(err);
            }
        });
        fs.rmSync("./validator/b.txt", {
            force: true,
        });
        if(req.body.multiple == "true") {
            fs.writeFile('./validator/b.txt', 'a', (err) => {
                if(err) console.log(err);
            });
        }
        exec("sudo docker build -f vali -t app .", (err, stdout) => {
            if(err) {
                console.log(err);
            } else if(stdout) {
                exec("sudo docker run --network none app", (err, stdout) => {
                    if(err) {
                        var s = err.toString(); 
                        res.send(JSON.parse(`{ "Success": false, "error": "`+JSON.stringify(s.substring(s.search("\nmain.cpp"), s.search("at"))).replaceAll("\"", "").replaceAll("\\", "")+`"}`));
                        console.log(err);
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
                        res.send(JSON.parse(`{ "Success": true, "Results": ${JSON.stringify(arr).replace("\\", "")} }`));
                        console.log(JSON.parse(`{ "Success": true, "Results": ${JSON.stringify(arr).replace("\\", "")} }`));
                    } else {
                        var input = fs.readFileSync('./validator/input.txt'), arr = [];
                        if(req.body.multiple == "true") {
                            do {
                                var pos = input.toString().search("===");
                                var s = input.toString().substring(0, pos);
                                input = input.toString().substring(pos + 5, input.toString().length);
                                arr.push("Valid");
                            } while(input.toString().search("===") != -1);
                        }
                        arr.push(i ? i.err : "Valid");
                        res.send(JSON.parse(`{ "Success": true, "Results": ${JSON.stringify(arr).replace("\\", "")} }`));
                        console.log(JSON.parse(`{ "Success": true, "Results": ${JSON.stringify(arr).replace("\\", "")} }`));
                    }
                });
            }
        });
        exec("sudo docker system prune --force", (err, stdout) => {
            if(err) {
                console.log(err);
            }
        });
        queue.shift();
    }
}); 

app.post('/checker', function(req, res, next) {
    console.log(req.body);
    queue2.push(req.body);
    if(queue2[0] == req.body) {
        fs.writeFile('./checker/main.cpp', req.body.code, function (err) {
            if(err) {
                console.log("HI", err);
            }
        });
        
        for(var j = 0; j < req.body.tcs.length; j++) {
            const task = req.body.tcs[j];
            (async () => {
                await fsExtra.emptyDir(`./checker/input/`), fsExtra.emptyDir(`./checker/output`), fsExtra.emptyDir(`./checker/ans`).then(() => {
                    fs.writeFile(`./checker/input/${j}.in`, task.in, function (err) {
                        if(err) {
                            console.log(err);
                        }
                    });
                    fs.writeFile(`./checker/output/${j}.out`, task.out, function (err) {
                        if(err) {
                            tconsole.log(err);;
                        }
                    });
                    fs.writeFile(`./checker/ans/${j}.ans`, task.ans, function (err) {
                        if(err) {
                            console.log(err);
                        }
                    });
                });
            })();
            if(j == req.body.tcs.length - 1) {
                exec("sudo docker build -f check -t app .", (err, stdout) => {
                    if(err) {
                        console.log(err);
                    } else if(stdout) {
                        exec("sudo docker run --network none app", (err, stdout) => {
                            if(err) {
                                var s = err.toString().trim();
                                res.send(JSON.parse(`{ "Success": false, "error": "`+JSON.stringify(s.substring(s.search("\nmain.cpp"), s.search("at"))).replaceAll("\"", "").replaceAll("\\", "")+`"}`));
                                console.log(    err);
                            } else if(stdout) {
                                res.send(JSON.parse(`{ "Success": true, "results": [`+stdout.toString().substring(0,stdout.toString().length-2)+"]}"));
                                console.log(JSON.parse(`{ "Success": true, "results": [`+stdout.toString().substring(0,stdout.toString().length-2)+"]}"));
                            }
                        });
                    }
                });
            }
        }
        exec("sudo docker system prune --force", (err, stdout) => {
            if(err) {
                console.log(err);
            }
        });
        queue2.shift();
    }
});

app.listen(8080);
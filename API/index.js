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

// app.post('/validate', function (req, res, next) {
function cts() {
    var req = {
        "body": {
            multiple: true,
            tcs: "2\r\n"
        }
    };
    queue.push(req.body);
    if(queue[queue.length-1] == req.body) {
        console.log(queue.length);
        console.log(req.body);
        /*fs.writeFile('./validator/main.cpp', req.body.code, function (err) {
            if(err) {
                throw err;
            }
        });
        fs.writeFile(`./validator/input.txt`, req.body.tcs, function(err) {
            if(err) {
                throw err;
            }
        });*/
        fs.rmSync("./validator/b.txt", {
            force: true,
        });
        if(req.body.multiple == true) {
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
                        console.log(stdout);
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
}
cts();
//});

app.listen(8080);
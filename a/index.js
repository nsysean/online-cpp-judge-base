const { exec, spawn } = require("child_process");
const fs = require("fs");
const { exit } = require("process");
try {
    var arr = [];
    exec("g++ main.cpp", (error, stdout, stderr) => {
        if(error) {
            console.log(`[{"tc":"0","Result":"fail","reason":"invalid code"}]`);
        } else if(stderr) {
            console.log(`[{"tc":"0","Result":"fail","reason":"invalid code"}]`);
        } else {
            fs.readdirSync("./tc").forEach(file => {
                const string = fs.readFileSync('./tc/'+file);
                const child = spawn("./a.out");
                try {
                    child.stdin.write(string);
                }
                catch(err) {
                    console.log(`[{"tc":"0","Result":"fail","reason":"invalid code"}]`);
                }
                child.stdin.end();
                var a = false;
                setTimeout(() => {
                    child.kill();
                    if(a==false) console.log(`{"tc":"${string.toString()}","Result":"fail","Reason":"TLE"}`);
                }, 1000);
                child.stdout.on("data", (data) => {
                    console.log(`{"tc":"${string.toString()}","Result":"${(data.toString().startsWith("pass")?"pass":"fail")}","Reason":"${data}"}`);
                    child.kill();
                    a = true;
                });
            });
        }
    });
}
catch(err) {
    throw err;
}

const { spawn, exec } = require("child_process");
const fs = require("fs");

var input = fs.readFileSync('input.txt');
exec("g++ main.cpp", (err) => {
    if(err) {
        throw err;
    } else {
        const child = spawn("./a.out");

        input = input.toString().replaceAll("\r\n", "\n");

        child.stdin.write(input);
        child.stdin.end();

        child.stderr.on('data', (data) => {
            console.log(data.toString());
        });
    }
});
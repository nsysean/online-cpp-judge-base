const { spawn, exec } = require("child_process");
const fs = require("fs");

const input = fs.readFileSync('input.txt');
exec("g++ main.cpp", (err) => {
    if(err) {
        throw err;
    } else {
        const child = spawn("./a.out");
        child.stdin.on('error', (error) => console.log("error caught: ", error));
        console.log(input);
        child.stdin.write(input);
        child.stdin.end();

        child.stderr.on('data', (data) => {
            console.log(data.toString());
        });
    }
});
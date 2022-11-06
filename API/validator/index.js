const { spawn } = require("child_process");
const child = spawn("./a.out");
const fs = require("fs");

const input = fs.readFileSync('input.txt');

child.stdin.write("1");
child.stdin.end();

child.stderr.on('data', (data) => {
    console.log(data.toString());
});
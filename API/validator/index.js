const { spawn } = require("child_process");
const child = spawn("./a.out");
const fs = require("fs");

const input = fs.readFileSync('input.txt');

child.stdin.write(input.toString());
child.stdin.end();

child.stdout.on('data', (data) => {
    console.log(data);
});
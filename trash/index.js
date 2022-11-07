const exec = require('child_process').exec;
const task = "https://codeforces.com/problemset/problem/4/A";
var obj;
exec(`node gettask.js ${task}`, (error, stdout, stderr) => {
    if (error) {
        throw error;
    }
    obj = JSON.parse(stdout);
})

const express = require("express");
const app = express();
const fs = require("fs");
  const question = fs.readFileSync("./communicate.txt").toString();
  var size = fs.readdirSync(`./problems/${question}/input/`).length;
  const arr = [];
  const { exec, spawn } = require("child_process");
const { exit } = require("process");
  var i=0;
  try {
  exec("g++ main.cpp", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
    }else if (stderr) {
      console.log(`stderr: ${stderr}`);
    } else {
    const fs = require("fs"), path = require("path");
    const folder = `./problems/${question}/input/`;
    fs.readdirSync(folder).forEach(file => {
      var string = fs.readFileSync(folder+file);
      const child = spawn("./a.out");
      child.stdin.write(string);
      child.stdin.end();
      setTimeout(() => {  
        arr.push(`TEST ${path.parse(file).name}: WRONG ANSWER`);
        i++;
        if(i==size) console.log(JSON.stringify(arr));
        child.kill();
      }, 1000);
      var cts = fs.readFileSync(`./problems/${question}/output/`+path.parse(file).name+".out");
      child.stdout.on("data", (data) => {
        if(data.equals(cts)) {
          arr.push(`TEST ${path.parse(file).name}: ACCEPTED`);
        } else {
          arr.push(`TEST ${path.parse(file).name}: WRONG ANSWER`);
        }
        i++;
        if(i==size) {
          console.log(JSON.stringify(arr));
        }
      });
    });
    }
  });
}
catch(err) {
  console.log(err);
}

const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
  const question = fs.readFileSync("./communicate.txt").toString();
  const folder = `./problems/${question}/input/`;
  var g = 0;
  fs.readdirSync(folder).forEach(file => {
    if(path.parse(file).name[0]=='E')g++;

  });
  var size = fs.readdirSync(`./problems/${question}/input/`).length - g;
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
      if(path.parse(file).name[0]!='E'){
      var string = fs.readFileSync(folder+file);
      const child = spawn("./a.out");
      child.stdin.write(string);
      child.stdin.end();
      const d = new Date();
      let ms = d.getMilliseconds();

      setTimeout(() => {  
        arr.push(`TEST ${path.parse(file).name}: TLE`);
        i++;
        if(i==size) console.log(JSON.stringify(arr));
        child.kill();
      }, 1000);
      var cts = fs.readFileSync(`./problems/${question}/output/`+path.parse(file).name+".out");
      child.stdout.on("data", (data) => {
        const e = new Date();
        let mse = e.getMilliseconds();
        if(mse<ms) mse+=1000;
        arr.push({"Accepted": data.equals(cts), "Time": mse-ms});
        i++;
        if(i==size) {
          console.log(JSON.stringify(arr));
        }
      });
    } 
    });
    }
  });
}
catch(err) {
  console.log(err);
}

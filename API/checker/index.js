const { spawn, exec } = require("child_process");
const fs = require("fs");

exec("g++ main.cpp", (err) => {
    if(err) {
        throw err;
    } else {
      fs.readdir('./input', function(err, data) {
        if(err) throw err;
        for(const file of data) {
          const child = spawn('./a.out', ['./input/' + file, './output/' + file.replace("in", "out"), './ans/' + file.replace("in", "ans")]);
          child.stderr.on('data', (data) => {
            console.log(`{"result": "${data.toString().replace("\n", "")}"},`);
          });
          child.stdout.on('data', (data) => {
            console.log(`{"result": "${data.toString().replace("\n", "")}"},`);
          });
        }
      });
    }
});

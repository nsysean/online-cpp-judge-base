const { spawn, exec } = require("child_process");
const fs = require("fs");

var input = fs.readFileSync('input.txt');
exec("g++ main.cpp", (err) => {
    if(err) {
        throw err;
    } else {
        if (fs.existsSync('./b.txt')) {
            var inputs = [];
            function validate(string) {
                const child = spawn("./a.out");
    
                child.stdin.write(string.replaceAll("\r\n", "\n"));
                child.stdin.end();
    
                child.stderr.on('data', (data) => {
                    console.log(`{"err": "${data.toString().replace("\n", "")}", "inpu": ${JSON.stringify(string)}},`);
                });
            }
            do {
                var pos = input.toString().search("===");
                var s = input.toString().substring(0, pos);
                input = input.toString().substring(pos + 5, input.toString().length);
                inputs.push(s);
            } while(input.toString().search("===") != -1);
            inputs.push(input);
            for (const tcs of inputs) {
                validate(tcs);
            }
        } else {
            function validate(string) {
                const child = spawn("./a.out");
    
                child.stdin.write(string.toString().replaceAll("\r\n", "\n"));
                child.stdin.end();
    
                child.stderr.on('data', (data) => {
                    console.log(`{"err": "${data.toString().replace("\n", "")}", "inpu": ${JSON.stringify(string.toString())}},`);
                });
            }
            validate(input);
        }
    }
});
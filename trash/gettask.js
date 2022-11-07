const superagent = require("superagent").agent();
var Xray = require('x-ray');
var x = Xray();
const cts = async () => {
    await superagent
    .post("https://codeforces.com/enter?back=%2F")
    .send({handleOrEmail: 'dbsseanng_', password: 'seansean5%', action: 'enter'})
    .set('Content-Type', 'application/x-www-form-urlencoded');

    let q = await superagent.get(process.argv.slice(2)[0]);
    x(q.text, {
        title: '.title',
        time: '.time-limit',
        time2: '.time-limit .property-title',
        mem: '.memory-limit',
        mem2: '.memory-limit .property-title',
        inputfile: '.input-file',
        inputfile2: '.input-file .property-title',
        outputfile: '.output-file',
        outputfile2: '.output-file .property-title',
        desc: '.problem-statement div:not([class])@html',
        inputspec: '.input-specification',
        inputspec2: '.input-specification .section-title',
        outputspec: '.output-specification',
        outputspec2: '.output-specification .section-title',
        tests: '.sample-tests',
        notes: '.note ol@html'
    })(function(err, obj) {
        if(err) return err;
        obj.time = obj.time.substr(obj.time2.length, obj.time.length - obj.time2.length),
        obj.mem = obj.mem.substr(obj.mem2.length, obj.mem.length - obj.mem2.length),
        obj.inputfile = obj.inputfile.substr(obj.inputfile2.length, obj.inputfile.length - obj.inputfile2.length),
        obj.outputfile = obj.outputfile.substr(obj.outputfile2.length, obj.outputfile.length - obj.outputfile2.length),
        obj.inputspec = obj.inputspec.substr(obj.inputspec2.length, obj.inputspec.length - obj.inputspec2.length),
        obj.outputspec = obj.outputspec.substr(obj.outputspec2.length, obj.outputspec.length - obj.outputspec2.length);
        for (var key in obj) {
            if(key.endsWith("2")) {
                delete obj[key];
            }
        }
        console.log(JSON.stringify(obj));
    });
}
cts();
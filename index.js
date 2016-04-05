#!/usr/bin/env node
require('shelljs/global');

const program = require('commander');
program.arguments('<port>')
  .option('-k, --kill', 'Tries to force kill a process using this port.')
  .action(function(port) {
    const command = `lsof -i :${port} | awk '{ print $2; }' | head -n 2 | grep -v PID`
    const res = exec(command);

    if (res.code === 0) {
      const pid = res.output.trim();

      if (program.kill) {
        exec(`sudo kill -9 ${pid}`);
      }
    } else if (res.code === 1){
      console.log("No process found which uses port " + port);
    }

  })
  .parse(process.argv);

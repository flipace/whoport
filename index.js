#!/usr/bin/env node
'use strict';
require('shelljs/global');

const program = require('commander');

var isWin = /^win/.test(process.platform);

program.arguments('<port>')
  .option('-k, --kill', 'Tries to force kill a process using this port.')
  .action(function(port) {
    let command;

    if (isWin) {
      command = `netstat -aon | find ":${port} " | find "LISTENING"`;
    } else {
      command = `lsof -i :${port} | awk '{ print $2; }' | head -n 2 | grep -v PID`;
    }

    const res = exec(command);

    if (res.code === 0) {
      let pid = res.output.trim();

      if (isWin) {
        const args = pid.split(/\s+/g);
        pid = args.pop();
      }

      if (program.kill) {
        if (isWin) {
          exec(`taskkill /PID ${pid}`);
        } else {
          exec(`sudo kill -9 ${pid}`);
        }
      }
    } else if (res.code === 1){
      console.log("No process found which uses port " + port);
    }

  })
  .parse(process.argv);

#!/usr/bin/env node --harmony
'use strict';
require('shelljs/global');

const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const program = require('commander');

var isWin = /^win/.test(process.platform);

program.arguments('<port>')
  .option('-k, --kill', 'Tries to force kill a process using this port.')
  .action(function(port) {
    co(function *() {
      let command;

      if (isWin) {
        command = `netstat -aon | find ":${port} " | find "LISTENING"`;
      } else {
        command = `lsof -i :${port} -n -P | grep 'LISTEN' | awk '{ print $2; }' | head -n 2 | grep -v PID`;
      }

      const res = exec(command, { silent: true });

      if (res.code === 0) {
        let pid = res.output.trim();

        if (isWin) {
          const args = pid.split(/\s+/g);
          pid = args.pop();
        } else {
          pid = pid.split(/\s+/g);
        }

        console.log(`PID: ${chalk.blue.bold(pid.join(', '))} listening on port ${chalk.red.bold(port)}`);

        if (!program.kill) {
          program.kill = yield prompt.confirm(`Do you want to kill the process? (no = default | y):  `);
          process.stdin.pause();
        }

        if (program.kill) {
          console.log(`Trying to kill process...`);
          let killResult;

          if (isWin) {
            killResult = exec(`taskkill /PID ${pid}`);
          } else {
            killResult = exec(`kill -9 ${pid.join(' ')}`);
          }

          if (killResult.code === 0) {
            console.log(chalk.green('Process(es) killed.'));
          } else {
            console.log(chalk.yellow('Process(es) couldn\'t be killed. Maybe you need to try as root.'));
          }
        }
      } else if (res.code === 1){
        console.log("No process found which uses port " + port + ". Maybe you need to try as root.");
      }
    });
  })
  .on('--help', function(){
    if (isWin) {
      // we could show windows specific information here
    } else {
      console.log('    HINT: If no process can be found which listens for a port, but you\'re sure one is using it, you can use "sudo whoport {port}" to check processes for all users. You might also need to invoke "sudo whoport {port} -k" to kill a process.\n');
    }
  })
  .parse(process.argv);

  if (typeof(program.args[0]) === 'undefined') {
    program.help();
  }

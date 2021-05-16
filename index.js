#!/usr/bin/env node
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
        let pid = res.stdout.trim();

        if (isWin) {
          let lines = pid.split(/\r\n/g);
          pid = [];
          for(var line of lines) {
            let pinfo = line.split(/\s+/g);
            let id = pinfo.pop();
            if(pid.indexOf(id) == -1)
              pid.push(id);
          }
        } else {
          pid = pid.split(/\s+/g);
        }

        const pids = Array.from(new Set(pid)); // remove duplicates

        const pnames = [];
        for (let i = 0; i < pids.length; i++) {
          const pid = pids[i];
          if (!isWin) {
            const ps = exec(`ps -p ${pid} -o comm=`, { silent: true });
            if (ps.code === 0) {
              const pname = ps.stdout.trim();
              pnames.push(pname);
            } else {
              pnames.push('N/A');
            }
          }
        }

        console.log(
          `PID: ${chalk.blue.bold(pids.join(', '))}\n` +
          (!isWin ? `Process name: ${chalk.green.bold(pnames.join(', '))}\n` : '') +
          `Listening on port: ${chalk.red.bold(port)}`
        );

        if (!program.kill) {
          program.kill = yield prompt.confirm(`Do you want to kill the process? (no = default | y):  `);
          process.stdin.pause();
        }

        if (program.kill) {
          console.log(`Trying to kill process...`);
          let killResult;

          if (isWin) {
            killResult = exec(`taskkill /PID ${pids.join(' /PID ')} /T /F`);
          } else {
            killResult = exec(`kill -9 ${pids.join(' ')}`);
          }

          if (killResult.code === 0) {
            console.log(chalk.green('Process(es) killed.'));
          } else {
            console.log(chalk.yellow('Process(es) couldn\'t be killed. Maybe you need to try as', (isWin?'administrator':'root') + '.'));
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

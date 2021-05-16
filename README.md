[![npm version](https://badge.fury.io/js/whoport.svg)](https://badge.fury.io/js/whoport)
[![GitHub issues](https://img.shields.io/github/issues/flipace/whoport.svg)](https://github.com/flipace/whoport/issues)
# whoport
A simple nodejs based CLI tool to check if and which PID uses a given port number and optionally kill it.

### Installation
```npm i -g whoport```

### Compatibility

**Tested on:**
- macOS 10.10.5, 10.11.4, 10.14.6
- Windows 7
- Debian 7.8 (wheezy)

Due to the use of ```netstat``` for Windows operating systems, whoport should also work on Windows Vista and above. (thanks [@lewisje](https://github.com/lewisje) for the hint!)

### How it works

- OSX uses ```lsof``` to check for processes and ```kill -9``` to kill one or more PIDs.
- Windows uses ```netstat``` to check for processes and ```taskkill``` to kill the PID.

### Usage

```
# check and display PID and process name if present
whoport 9090

# kill process which uses port
whoport 9090 -k
```

### FAQ
#### No process found but something is listening. (OSX)
You need to execute whoport with sudo if a process runs via another or root user. Also see [man lsof](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man8/lsof.8.html) section "Security".

### Contributing

Pull Requests are very welcome!

If you find any issues, please report them via [Github Issues](https://github.com/flipace/whoport/issues) and include your nodejs version and OS.

### License
(MIT)

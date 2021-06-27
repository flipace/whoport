# Change Log

### v0.3.0
- Adds process name to output -> merged [#5](https://github.com/flipace/whoport/pull/5), thanks @BonneVoyager 
```
> whoport 8000
PID: 71937
Process name: node
Listening on port: 8000
Do you want to kill the process? (no = default | y):
```

### v0.2.0
- merged [#4](https://github.com/flipace/whoport/pull/4), thanks @milanorszagh

### v0.1.2
- removes --harmony flag (fixes [#3](https://github.com/flipace/whoport/issues/3))

### v0.1.1
- removes sudo from osx commands and adds information about lsof security restrictions to readme ([#2](https://github.com/flipace/whoport/issues/2))

### v0.1.0
- adds confirm input to easily kill a process without providing -k.
- improves & colors output of PID information
- improves process detection on OSX
- improves README.md information
- fixes bug on Windows which caused ports to be found like "8080" when looking for processes listening on port "80" ([c645c47](https://github.com/flipace/whoport/commit/c645c475c2ab8e584bd8a508382f79e691a94ccb) - by [@lewisje](https://github.com/lewisje))

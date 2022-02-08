# FrontEnd-AudioClean

Source code for the AudioClean frontend

## Getting Started

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v14.17.6

### Installing

* First, the node packages needs to be installed
```
npm i
```

### Executing program

The code is pointing to the localhost:8000 which is the backend, this can be changed in the [constant.js](https://github.com/nestorcalvo/FrontEnd-AudioClean/blob/master/src/constants.js) file, this has to be changed if the backend is running in another IP address.

```
npm run
```


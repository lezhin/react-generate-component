# React Generate Component

This is a tool that automatically generate React Component files.

<img src="https://media.giphy.com/media/xUOrwmSOd4RzrP8ofK/giphy.gif" width="450">

## Installation

```
$ npm install -g @lezhin/react-generate-component
```

## Usage

### CLI

```
Usage: rgc [options] <name ...>


Options:

-V, --version        output the version number
-c, --config <path>  set a custom path to look for a config file
-o, --override       set a allow files to override
-h, --help           output usage information
```

## Node.js

```
const rgc = require('@lezhin/react-generate-component').generate;

const componentNames = ['hello', 'world'];
const customConfig = {};
const allowOverride = false;

rgc(componentNames, customConfig, allowOverride).then(() => {
    console.log('Generated!');
});
```

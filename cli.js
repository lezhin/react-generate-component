#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const {generate} = require('./index');
const {args, config, override} = program
    .version('0.0.2')
    .usage('[options] <name ...>')
    .option('-c, --config <path>', 'set a custom path to look for a config file')
    .option('-o, --override', 'set a allow files to override')
    .parse(process.argv);

generate(
    args,
    (config && path.resolve(config)) || path.join(process.cwd(), '/rgc.config.js'),
    override
);

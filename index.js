const fs = require('fs');
const path = require('path');
const promisify = require('util.promisify');
const clc = require('cli-color');
const prettier = require('prettier');
const extend = require('extend');
const capitalize = require('capitalize');
const mkdirp = require('mkdirp');
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const mkdir = promisify(mkdirp);

function pretting(code, parser = 'babylon') {
    return prettier.format(code, {
        tabWidth: 4,
        bracketSpacing: false,
        singleQuote: true,
        jsxBracketSameLine: true,
        parser: parser
    });
}

function generate(componentNames, customConfig = {}, allowOverride = false) {
    if (!componentNames || componentNames.length === 0) {
        const error = new Error('Error: Provide a component name');
        console.error(clc.red(error));
        return Promise.reject(error);
    }

    componentNames = componentNames.map((c) => capitalize(c));

    const config = extend(true, {}, require('./config'), customConfig);
    const {output, filenames, templates, hookscripts} = config;
    const result = {};

    hookscripts.pre(componentNames, config);

    return Promise.all(componentNames.map((name) => {
        const filepath = path.join(path.resolve(output), name);

        return new Promise((resolve, reject) => {
            allowOverride ? resolve() : stat(filepath)
                .then(() => reject(new Error(`Error: Exists file path, ${filepath}`)))
                .catch(() => resolve());
        }).then(() => {
            return Promise.all(Object.keys(filenames).map((key) => {
                const filename = filenames[key].replace('[name]', name);
                const fullpath = path.join(filepath, filename);

                return mkdir(filepath).then(() => {
                    const source = pretting(
                        templates[key](name),
                        key === 'style' ? 'postcss' : 'babylon'
                    );

                    return writeFile(fullpath, source, 'utf8');
                }).then(() => {
                    console.info(clc.greenBright(`Info: Created ${path.join(output, name, filename)}`));
                });
            }));
        }).then(() => {
            result[name] = true;
        }).catch((err) => {
            result[name] = false;
            console.error(clc.red(err.message));
        });
    })).then(() => {
        console.info(clc.cyan('Info: Completed!'));
        hookscripts.post(componentNames, config, result);
    });
}

module.exports = {
    generate,
    pretting
};

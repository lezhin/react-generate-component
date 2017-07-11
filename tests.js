require('prettier/parser-babylon');
require('prettier/parser-postcss');

const fs = require('fs');
const mock = require('mock-fs');
const expect = require('chai').expect;
const capitalize = require('capitalize');
const {generate, pretting} = require('./index');
const config = require('./config');

describe('Greeting Test', () => {
    beforeEach(() => {
        mock({
            'project1': {},
            'project2/src/Hello': {
                'existSomeFile.txt': 'exist text.'
            }
        });

        process.chdir('project1');
    });

    afterEach(() => {
        mock.restore();
    });

    describe('Test to create files', () => {
        it('Should occur error when name of component is omitted.', () => {
            // Given
            // When
            return generate()

            // Then
                .then(failTest, (err) => {
                    expect(err.message).to.equal('Error: Provide a component name');
                });
        });

        it('Should generate component, style, test and main file when pass name of component.', () => {
            // Given
            // When
            return generate(['hello'])

            // Then
                .then(() => {
                    expect(fs.statSync('src/Hello/Hello.js')).to.be.an('object');
                    expect(fs.statSync('src/Hello/Hello.scss')).to.be.an('object');
                    expect(fs.statSync('src/Hello/Hello.spec.js')).to.be.an('object');
                    expect(fs.statSync('src/Hello/index.js')).to.be.an('object');
                });
        });

        it('Should generate each component, style, test and main file when pass multiple name of component.', () => {
            // Given
            // When
            return generate(['hello', 'world'])

            // Then
                .then(() => {
                    expect(fs.statSync('src/Hello/Hello.js')).to.be.an('object');
                    expect(fs.statSync('src/Hello/Hello.scss')).to.be.an('object');
                    expect(fs.statSync('src/Hello/Hello.spec.js')).to.be.an('object');
                    expect(fs.statSync('src/Hello/index.js')).to.be.an('object');
                    expect(fs.statSync('src/World/World.js')).to.be.an('object');
                    expect(fs.statSync('src/World/World.scss')).to.be.an('object');
                    expect(fs.statSync('src/World/World.spec.js')).to.be.an('object');
                    expect(fs.statSync('src/World/index.js')).to.be.an('object');
                });
        });

        it('Should generate files under the directory when pass value of customConfig.output as "./components."', () => {
            // Given
            const customConfig = {
                output: './components'
            };

            // When
            return generate(['hello'], customConfig)

            // Then
                .then(() => {
                    expect(fs.statSync('components/Hello/Hello.js')).to.be.an('object');
                    expect(fs.statSync('components/Hello/Hello.scss')).to.be.an('object');
                    expect(fs.statSync('components/Hello/Hello.spec.js')).to.be.an('object');
                    expect(fs.statSync('components/Hello/index.js')).to.be.an('object');
                });
        });

        it('Should generate component file as appointed name when pass value of customConfig.filenames.main as "[name].jsx."', () => {
            // Given
            const customConfig = {
                filenames: {main: '[name].jsx'}
            };

            // When
            return generate(['hello'], customConfig)

            // Then
                .then(() => {
                    expect(fs.statSync('src/Hello/Hello.jsx')).to.be.an('object');
                });
        });

        it('Should generate style file as appointed name when pass value of customConfig.filenames.style as "[name].scss."', () => {
            // Given
            const customConfig = {
                filenames: {style: '[name].sass'}
            };

            // When
            return generate(['hello'], customConfig)

            // Then
                .then(() => {
                    expect(fs.statSync('src/Hello/Hello.sass')).to.be.an('object');
                });
        });

        it('Should generate test file as appointed name when pass value of customConfig.filenames.test as "[name].test.js."', () => {
            // Given
            const customConfig = {
                filenames: {test: '[name].test.js'}
            };

            // When
            return generate(['hello'], customConfig)

            // Then
                .then(() => {
                    expect(fs.statSync('src/Hello/Hello.test.js')).to.be.an('object');
                });
        });

        it('Should generate main file as appointed name when pass value of customConfig.filenames.index as "[name].js."', () => {
            // Given
            const customConfig = {
                filenames: {index: 'export.js'}
            };

            // When
            return generate(['hello'], customConfig)

            // Then
                .then(() => {
                    expect(fs.statSync('src/Hello/export.js')).to.be.an('object');
                });
        });

        it('Should ignore command when same name exist.', () => {
            process.chdir('../project2');

            // Given
            // When
            return generate(['hello'])

            // Then
                .then(() => {
                    expect(fs.readFileSync('src/Hello/existSomeFile.txt', 'utf8')).to.equal('exist text.');
                });
        });

        it('Should generate not existing files.', () => {
            process.chdir('../project2');

            // Given
            // When
            return generate(['hello', 'world'])

            // Then
                .then(() => {
                    expect(fs.readFileSync('src/Hello/existSomeFile.txt', 'utf8')).to.equal('exist text.');
                    expect(fs.statSync('src/World/World.js', 'utf8')).to.be.an('object');
                    expect(fs.statSync('src/World/World.scss', 'utf8')).to.be.an('object');
                    expect(fs.statSync('src/World/World.spec.js', 'utf8')).to.be.an('object');
                    expect(fs.statSync('src/World/index.js', 'utf8')).to.be.an('object');
                });
        });

        it('Should generate files and override existing files when pass existallowOverride as true.', () => {
            process.chdir('../project2');

            // Given
            const allowOverride = true;

            // When
            return generate(['hello'], null, allowOverride)

            // Then
                .then(() => {
                    expect(fs.statSync('src/Hello/Hello.js', 'utf8')).to.be.an('object');
                    expect(fs.statSync('src/Hello/Hello.scss', 'utf8')).to.be.an('object');
                    expect(fs.statSync('src/Hello/Hello.spec.js', 'utf8')).to.be.an('object');
                    expect(fs.statSync('src/Hello/index.js', 'utf8')).to.be.an('object');
                });
        });
    });

    describe('Test to create template code', () => {
        it('Should be become code of component file with return value of main() of config.templates.', () => {
            // Given
            // When
            return generate(['hello'])

            // Then
                .then(() => {
                    const componentCode = fs.readFileSync('src/Hello/Hello.js', 'utf8');
                    const compiledCode = pretting(config.templates.main(capitalize('hello')));

                    expect(componentCode).to.equal(compiledCode);
                });
        });

        it('Should be become code of style file with return value of style() of config.templates.', () => {
            // Given
            // When
            return generate(['hello'])

            // Then
                .then(() => {
                    const styleCode = fs.readFileSync('src/Hello/Hello.scss', 'utf8');
                    const compiledCode = pretting(config.templates.style(capitalize('hello')), 'postcss');

                    expect(styleCode).to.equal(compiledCode);
                });
        });

        it('Should be become code of test file with return value of test() of config.templates.', () => {
            // Given
            // When
            return generate(['hello'])

            // Then
                .then(() => {
                    const testCode = fs.readFileSync('src/Hello/Hello.spec.js', 'utf8');
                    const compiledCode = pretting(config.templates.test(capitalize('hello')));

                    expect(testCode).to.equal(compiledCode);
                });
        });

        it('Should be become code of main file with return value of index() of config.templates.', () => {
            // Given
            // When
            return generate(['hello'])

            // Then
                .then(() => {
                    const indexCode = fs.readFileSync('src/Hello/index.js', 'utf8');
                    const compiledCode = pretting(config.templates.index(capitalize('hello')));

                    expect(indexCode).to.equal(compiledCode);
                });
        });

        it('Should be become code of component file with return value of passed main() to customConfig.templates.', () => {
            // Given
            const customConfig = {
                templates: {
                    main(name) {
                        return `class ${name} {}`;
                    }
                }
            };

            // When
            return generate(['hello'], customConfig)

            // Then
                .then(() => {
                    const componentCode = fs.readFileSync('src/Hello/Hello.js', 'utf8');
                    const compiledCode = pretting(customConfig.templates.main(capitalize('hello')));

                    expect(componentCode).to.equal(compiledCode);
                });
        });

        it('Should be become code of style file with return value of passed style() to customConfig.templates.', () => {
            // Given
            const customConfig = {
                templates: {
                    style(name) {
                        return `.${name.toLowerCase()} {}`;
                    }
                }
            };

            // When
            return generate(['hello'], customConfig)

            // Then
                .then(() => {
                    const styleCode = fs.readFileSync('src/Hello/Hello.scss', 'utf8');
                    const compiledCode = pretting(customConfig.templates.style(capitalize('hello')), 'postcss');

                    expect(styleCode).to.equal(compiledCode);
                });
        });

        it('Should be become code of test file with return value of passed test() to customConfig.templates.', () => {
            // Given
            const customConfig = {
                templates: {
                    test(name) {
                        return `import ${name} from './${name}';`;
                    }
                }
            };

            // When
            return generate(['hello'], customConfig)

            // Then
                .then(() => {
                    const testCode = fs.readFileSync('src/Hello/Hello.spec.js', 'utf8');
                    const compiledCode = pretting(customConfig.templates.test(capitalize('hello')));

                    expect(testCode).to.equal(compiledCode);
                });
        });

        it('Should be become code of main file with return value of passed index() to customConfig.templates.', () => {
            // Given
            const customConfig = {
                templates: {
                    index(name) {
                        return `import ${name} from './${name}';`;
                    }
                }
            };

            // When
            return generate(['hello'], customConfig)

            // Then
                .then(() => {
                    const indexCode = fs.readFileSync('src/Hello/index.js', 'utf8');
                    const compiledCode = pretting(customConfig.templates.index(capitalize('hello')));

                    expect(indexCode).to.equal(compiledCode);
                });
        });
    });
});

function failTest(){
    throw new Error("Expected promise to be rejected but it was fulfilled");
}

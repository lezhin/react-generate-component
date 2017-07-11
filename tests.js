require('prettier/parser-babylon');
require('prettier/parser-postcss');

const fs = require('fs');
const mock = require('mock-fs');
const expect = require('chai').expect;
const capitalize = require('capitalize');
const {generate, pretting} = require('./index');
const config = require('./config');

describe('Greeting 테스트', () => {
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

    describe('파일 생성 테스트', () => {
        it('Component 이름을 생략하면 에러가 발생한다.', () => {
            // Given
            // When
            return generate()

            // Then
                .then(failTest, (err) => {
                    expect(err.message).to.equal('Error: Provide a component name');
                });
        });

        it('Component 이름을 전달하면 컴포넌트, 스타일, 테스트, 메인 파일이 생성된다.', () => {
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

        it('Component 이름을 2개 전달하면 컴포넌트, 스타일, 테스트, 메인 파일이 각각 생성된다.', () => {
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

        it('customConfig.output의 값을 "./components"로 지정하면 해당 디렉터리 하위에 파일이 생성된다.', () => {
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

        it('customConfig.filenames.main의 값을 "[name].jsx"로 지정하면 지정한 이름으로 컴포넌트 파일이 생성된다.', () => {
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

        it('customConfig.filenames.style의 값을 "[name].sass"로 지정하면 지정한 이름으로 스타일 파일이 생성된다.', () => {
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

        it('customConfig.filenames.test의 값을 "[name].test.js"로 지정하면 지정한 이름으로 테스트 파일이 생성된다.', () => {
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

        it('customConfig.filenames.index의 값을 "export.js"로 지정하면 지정한 이름으로 메인 파일이 생성된다.', () => {
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

        it('컴포넌트를 생성할 디렉터리가 이미 존재하면 파일 생성이 무시된다.', () => {
            process.chdir('../project2');

            // Given
            // When
            return generate(['hello'])

            // Then
                .then(() => {
                    expect(fs.readFileSync('src/Hello/existSomeFile.txt', 'utf8')).to.equal('exist text.');
                });
        });

        it('컴포넌트를 여러개 생성 할 때 이미 존재하는 디렉터리를 제외한 컴포넌트만 생성된다.', () => {
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

        it('allowOverride 인자를 true로 전달하면 디렉터리가 이미 존재해도 파일이 생성된다.', () => {
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

    describe('템플릿 코드 생성 테스트', () => {
        it('config.templates의 main() 반환값이 컴포넌트 파일의 코드가 된다.', () => {
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

        it('config.templates의 style() 반환값이 스타일 파일의 코드가 된다.', () => {
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

        it('config.templates의 test() 반환값이 테스트 파일의 코드가 된다.', () => {
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

        it('config.templates의 index() 반환값이 메인 파일의 코드가 된다.', () => {
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

        it('customConfig.templates의 main()를 전달하면 그 함수의 반환값이 컴포넌트 파일의 코드가 된다.', () => {
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

        it('customConfig.templates의 style()를 전달하면 그 함수의 반환값이 스타일 파일의 코드가 된다.', () => {
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

        it('customConfig.templates의 test()를 전달하면 그 함수의 반환값이 테스트 파일의 코드가 된다.', () => {
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

        it('customConfig.templates의 index()를 전달하면 그 함수의 반환값이 메인 파일의 코드가 된다.', () => {
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

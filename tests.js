require('prettier/parser-babylon');
require('prettier/parser-postcss');
require('./config');

const fs = require('fs');
const mock = require('mock-fs');
const expect = require('chai').expect;
const generate = require('./index');

describe('Greeting 테스트', () => {
    beforeEach(() => {
        mock({
            'project1': {}
        });
    });

    afterEach(() => {
        mock.restore();
    });

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
        process.chdir('project1');

        // Given
        const componentNames = ['hello'];

        // When
        return generate(componentNames)

        // Then
            .then(() => {
                expect(fs.statSync('src/Hello/Hello.js')).to.be.an('object');
                expect(fs.statSync('src/Hello/Hello.scss')).to.be.an('object');
                expect(fs.statSync('src/Hello/Hello.spec.js')).to.be.an('object');
                expect(fs.statSync('src/Hello/index.js')).to.be.an('object');
            });
    });

    it('Component 이름을 2개 전달하면 컴포넌트, 스타일, 테스트, 메인 파일이 각각 생성된다.', () => {
        process.chdir('project1');

        // Given
        const componentNames = ['hello', 'world'];

        // When
        return generate(componentNames)

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
});

function failTest(){
    throw new Error("Expected promise to be rejected but it was fulfilled");
}

const Case = require('case');

module.exports = {
    output: './src',
    filenames: {
        index: 'index.js',
        main: '[name].js',
        style: '[name].scss',
        test: '[name].spec.js'
    },
    templates: {
        main(name) {
            return (`
                import React from 'react';
        
                const ${name} = ({children}) => (
                    <div className="${Case.kebab(name)}">
                        {children}
                    </div>
                );
                
                export default ${name};
            `);
        },
        style(name) {
            return (`
                // ------------------------------------- //
                // Style of ${name}
                // ------------------------------------- //
                
                $module: '${Case.kebab(name)}';
                
                .#{$module} {
                    // ...
                }
            `);
        },
        test(name) {
            return (`
                import React from 'react';
                import ${name} from './${name}';
                
                describe('Test of ${name}', () => {
                    it('Test case 1.', () => {
                        // Given
                        // When
                        // Then
                    });
                });
            `);
        },
        index(name) {
            return (`
                import ${name} from './${name}';
                
                export default ${name};
            `);
        }
    }
};

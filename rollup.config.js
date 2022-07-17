import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import { version } from './package.json';

const globals = {
    'v8n-bd': 'v8n',
};

const now = new Date();
const year = now.getFullYear();

const banner = `/**
* @license
* ----------------------------------
* v${version}
*
* Distributed under MIT license
*
*/\n\n`;

const footer = '';

export default [
    {
        input: 'src/validate.js',
        external: ['v8n-bd'],
        output: [
            {
                file: 'lib/validate.js',
                format: 'umd',
                name: 'vl',
                exports: 'named',
                sourcemap: true,
                globals,
                banner,
                footer
            },
            {
                file: 'lib/validate.esm.js',
                format: 'es'
            }
        ],
        plugins: [
            eslint({ exclude: ['package.json'] }),
            json(),
            babel()
        ]
    },
    {
        input: 'src/validate.js',
        external: ['v8n-bd'],
        output: [
            {
                file: 'lib/validate.min.js',
                format: 'umd',
                name: 'vl',
                exports: 'named',
                sourcemap: true,
                globals,
                banner,
                footer
            }
        ],
        plugins: [
            json(),
            babel(),
            terser({ output: { comments: /@license/ } })
        ]
    }
]

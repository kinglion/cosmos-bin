'use strict';

const Command = require('common-bin');
const EXCLUDES = Symbol('cov#excludes');

class CovCommand extends Command {
    constructor(rawArgv){
        super(rawArgv);
        this.usage = 'Usage: cosmos-bin cov';

        this.option = {
            x: {
                description: 'istanbul coverage ignore, one or more fileset patterns',
                type: 'array',
            },
        };

        // you can add ignore dirs here
        this[EXCLUDES] = new Set([
            'examples/**',
            'mocks_*/**',
        ]);
    }

    get description() {
        return 'Run test with coverage';
    }

    * run({cwd, argv, execArgv}) {
        
    }
}

module.exports = CovCommand;
'use strict';

const path = require('path');
const Command = require('common-bin');

class CosmosBin extends Command {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = 'Usage: cosmos-bin [command] [option]';

        // load directory
        this.load(path.join(__dirname, 'lib/cmd'));
    }
}

module.exports = CosmosBin;
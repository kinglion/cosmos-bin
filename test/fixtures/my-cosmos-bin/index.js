'use strict';

const path = require('path');
const Command = require('../../..');

class MyCosmosBinCommand extends Command {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = 'usage: cosmos-bin [command] [options]';

    }
}

module.exports = MyCosmosBinCommand;
'use strict';

const Command = require('common-bin');
const fs = require('fs');
const path = require('path');
const utils = require('../utils');
require('colors');


class ScanCommand extends Command {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = 'Usage: cosmos-bin scan [document]';
    }

    get description() {
        return 'scan document file then calcout array';
    }

    * run({cwd}) {

        const sourceList = yield utils.scan(cwd);
        const list = []

        for(let i = 0; i < sourceList.length; i ++) {
          list.push('require("assets/'+path.basename(sourceList[i])+'")')
        }
        console.log(list)
    }
}

module.exports = ScanCommand;

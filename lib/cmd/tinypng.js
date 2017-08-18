'use strict';

const Command = require('common-bin');
const fs = require('fs');
const path = require('path');
const conf = require('../../conf/config');
const utils = require('../utils');
const util = require('util');
const tinify = require('tinify');
const EXCLUDES = Symbol('tiny#excludes');
require('colors');


class TinypngCommand extends Command {
    constructor(rawArgv) {
        super(rawArgv);
        this.usage = 'Usage: cosmos-bin tinypng [file] [options]';
        this.option = {
            x: {
                description: 'upload to tinypng filter, one or more fileset patterns',
                type: 'array',
            },
        };
        this[EXCLUDES] = conf.TINYPNG_FILTER;
    }

    get description() {
        return 'Run tinypng with cosmos-bin';
    }

    * run({cwd, argv, execArgv}) {
        tinify.key = conf.TINYPNG_API_KEY;

        tinify.validate(function(err) {
            if (err) throw err;
            // Validation of API key failed.
        })

        const targetDir = `${conf.TINYPNG_SIGN}${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}`;

        if (argv.x) {
            if (Array.isArray(argv.x)) {
                for (const exclude of argv.x) {
                    this.addExclude(exclude);
                }
            } else {
                this.addExclude(argv.x);
            }
        }

        const sourceList = yield utils.scan(cwd, this[EXCLUDES], [targetDir, conf.TINYPNG_SIGN]);
        const uploadList = yield utils.copy(sourceList, targetDir, cwd);

        for(let i = 0; i < uploadList.length; i ++) {
            tinify.fromFile(uploadList[i]).toFile(uploadList[i], function(err) {
                const originSize = fs.statSync(sourceList[i]).size,
                      compressSize = fs.statSync(uploadList[i]).size;

                console.log(`处理完毕图片:${sourceList[i]} ${originSize} -> ${compressSize} 压缩: ${(1 - compressSize / originSize) * 100}%`.green);
            });
        }

        console.log(`生成目录:./${targetDir}`.bold.bgGreen);
    }

    /**
     * 添加文件后缀过滤
     * @param {String} exclude - glob pattern
     */
    addExclude(exclude) {
        this[EXCLUDES].push(exclude);
    }
}

module.exports = TinypngCommand;
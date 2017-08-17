'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
    scan,
    copy
}

/**
 * 扫描文件夹
 * @param {string | array} _path 路径或者单个文件
 * @param {string | array} filter 需要过滤的后缀
 * @param {string | array} exclude 排除的目录
 * @return {arr} 
 */
function *scan(_path, filter, exclude) {
    let _output = [];
    if (typeof _path !== 'string' || !_path instanceof Array) {
        throw 'function scan first param must be string or array.'
    } else {
        if (typeof _path === 'string') {
            const stat = fs.statSync(_path)

            if (stat.isFile()) {
                if (filter instanceof String) {
                    if(path.extname(_path).indexOf(filter) > -1) {
                        _output.push(_path)
                    }
                }
                if (filter instanceof Array) {
                    filter.some(fi => {
                        if(path.extname(_path).indexOf(fi) > -1) {
                            _output.push(_path)
                            return true;
                        }
                        return false;
                    })
                }
            }

            if (stat.isDirectory()) {
                const dir = fs.readdirSync(_path);

                for (let file of dir) {
                    let isExclude = false;

                    if (exclude) {
                        if (exclude instanceof String) {
                            if (_path.indexOf(exclude) > -1) {
                                isExclude = true;
                            }
                        }

                        if (exclude instanceof Array) {
                            exclude.forEach(ex => {
                                if (_path.indexOf(ex) > -1) {
                                    isExclude = true;
                                }
                            })
                        }
                    }

                    if(!isExclude) _output = _output.concat(yield scan(path.join(_path, file), filter, exclude));
                }
            }

            return Promise.resolve(_output)
        }
        
    }
}

/**
 * 拷贝文件到其他目录
 * @param {array} _paths
 * @param {string} targetDir 目标文件夹
 * @param {string} cwd 当前目录
 */
function copy(_paths, targetDir, cwd) {
    let _output = [];

    // 如果目标文件夹不存在，创建一个
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir)
    }

    _paths.forEach(function(_path) {
        try {
            const dir = path.join(targetDir, _path.replace(cwd, ''));
            mkdir(path.dirname(dir));
            fs.writeFileSync(dir, fs.readFileSync(_path));
            _output.push(dir);
        } catch (err) {
            console.log(err)
        }
    })

    return Promise.resolve(_output);
}

function mkdir(_path, callback) {
    if (!fs.existsSync(_path)) {
        mkdir(path.dirname(_path), function() {
            fs.mkdirSync(_path);
        })
    } else {
        callback && callback()
    }
}
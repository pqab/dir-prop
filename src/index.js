const fs = require('fs');
const path = require('path');

/*
 * exclude: exclude directory name (default: node_modules, .git)
 * recursion: recursion loop from root directory (default: true)
 * root: specific relative or absolute directory (default: __dirname)
*/
module.exports = (options = {}) => {
  var {
    exclude: exclude = ['node_modules', '.git'],
    recursion: recursion = true,
    root: root = '__dirname'
  } = options;
  this.count = 0;
  this.exclude = exclude;
  this.recursion = recursion;
  this.result = {};
  this.root = root;

  getInfo().then(() => {
    console.log('end');
    console.log(this.result);
  }).catch((err) => {
    console.log(err);
  })
}

var getInfo = (p = '') => new Promise((resolve, reject) => {
  var run = (p) => {
    this.count++;
    fs.readdir(path.join(this.root, p), (err, data) => {
      if (err)
        return reject(err);
      for (const [index, value] of data.entries()) {
        new Promise(() => {
          var _index = index,
              _value = value;
          fs.stat(path.join(this.root, p, _value), (err, stat) => {
            if (err)
              return reject(err);
            if (stat.isDirectory() && this.recursion && !path.join(p, _value).match(new RegExp(`.*(${this.exclude.join('|')}).*`, 'g')))
                run(path.join(p, _value));
            else if (stat.isFile())
              updateMap(path.join(p, _value));
            if (_index === data.length - 1) {
              this.count--;
              if (this.count === 0)
                return resolve();
            }
          })
        })
      }
      if (data.length === 0) {
        this.count--;
        if (this.count === 0)
          return resolve();
      }
    })
  }
  run(p);
})

var updateMap = (p = '', result = this.result) => {
  var split = p.split(path.sep);
  result[split[0]] = result[split[0]] || {};
  if (split.length === 1)
    return result;
  return updateMap(split.slice(1).join('/'), result[split[0]]);
}

/*
 * TODO:
 * throw error
 * readme.md
 * file properties
*/

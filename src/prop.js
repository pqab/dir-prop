const fs = require('fs');
const path = require('path');

/*
 * exclude: excluded directory name (default: node_modules, .git)
 * recursion: recursion from root directory (default: true)
 * root: specific relative or absolute directory (default: __dirname)
*/
module.exports = (options = {}) => new Promise((resolve, reject) => {
  var {
    exclude: exclude = ['node_modules', '.git'],
    recursion: recursion = true,
    root: root = __dirname
  } = options;
  this.count = 0;
  this.exclude = exclude;
  this.recursion = recursion;
  this.result = {};
  this.root = root;

  getInfo().then(() => {
    return resolve(this.result);
  }).catch((err) => {
    return reject(err);
  })
})

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
              updateMap(path.join(p, _value), stat);
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

var updateMap = (p = '', stat = {}, result = this.result) => {
  var split = p.split(path.sep);
  if (split.length === 1) {
    result[split[0]] = result[split[0]] || stat;
    return result;
  } else {
    result[split[0]] = result[split[0]] || {};
  }
  return updateMap(split.slice(1).join('/'), stat, result[split[0]]);
}

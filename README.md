Read directory into JSON tree module for [node](https://nodejs.org).

[![NPM version](https://img.shields.io/npm/v/dir-prop.svg)](https://www.npmjs.com/package/dir-prop)

## Installation

npm install dir-prop

## Usage

```js
const { dirProp } = require('dir-prop');
dirProp({
  root: path.join(__dirname, '../')
}).then((data) => {
  console.log(data);
});
```

Use with express server ([Demo](https://dir-prop-77617p9138kn.runkit.sh/))

```js
const { dirServer } = require('dir-prop');

app.use(express.static(path.join(__dirname, '../'),
  { dotfiles: 'allow' }));

app.use('/', dirServer({
  root: path.join(__dirname, '../'),
  template: true
}));
```

## Options

| options   | description                             | default            | accept  |
| --------- | --------------------------------------- | ------------------ | ------- |
| exclude   | excluded directory name                 | node_modules, .git | [array] |
| recursion | recursion from root directory           | true               | boolean |
| root      | specific relative or absolute directory | __dirname          | String  |

Use with express server

| options   | description                                                             | default | accept    |
| --------- | ----------------------------------------------------------------------- | ------- | --------- |
| app       | express app                                                             |         | app       |
| method    | http method for request param, otherwise will use default options param |         | get, post |
| template  | use template if provided, otherwise will retuen raw json data           |         | String    |

## dir to prop

```
root
  |- demo
      |- demo
  |- src
      |- index.js
      ...
  |- README.md
  ...
```

to

```
{
  demo: {
    demo: Stats { /* fs.stat */
      dev: 16777220,
      mode: 33188,
      nlink: 1,
      ...
    }
  },
  src : {
    'index.js': Stats {
      ...
    },
    ...
  },
  'README.md': Stats {
    ...
  }
}
```

# D

Read directory into JSON tree module for [node](https://nodejs.org).

## Installation

npm install ...

## Usage

```js
const { dirProp } = require('dir-tree');
dirProp({
  root: path.join(__dirname, '../')
}).then((data) => {
  console.log(data);
});
```

Use with express server

```js
const { dirServer } = require('dir-tree');

app.use(express.static(path.join(__dirname, '../'),
  { dotfiles: 'allow' }));

app.use('/', dirServer({
  root: path.join(__dirname, '../'),
  template: true
}));
```

## Options

## Demo

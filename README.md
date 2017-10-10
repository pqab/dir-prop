Read directory into JSON tree module for [node](https://nodejs.org).

## Installation

npm install dir-prop

## Usage

```js
const { dirProp } = require('dir-tree');
dirProp({
  root: path.join(__dirname, '../')
}).then((data) => {
  console.log(data);
});
```

Use with express server ([Demo](https://dir-prop-77617p9138kn.runkit.sh/))

```js
const { dirServer } = require('dir-tree');

app.use(express.static(path.join(__dirname, '../'),
  { dotfiles: 'allow' }));

app.use('/', dirServer({
  root: path.join(__dirname, '../'),
  template: true
}));
```

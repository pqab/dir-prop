const fs = require('fs');

const dirProp = require('./prop');
const defaultTemplate = require('./template');

/*
 * method: http method for request param, otherwise will use default options param (default: undefined, accept: get, post)
 * template: use template if provided, otherwise will retuen raw json data (default: undefined, accept: boolean, string template path)
*/
module.exports = (options = {}) => (req, res) => {
  const { app: app, method: method = '', template: template } = options;
  if (method.match(/get/i))
    updateOptions(options, req.query);
  else if (method.match(/post/i))
    updateOptions(options, req.params);
  dirProp(options).then((data) => {
    if (template) {
      if (typeof template === 'boolean')
        return res.send(defaultTemplate(data));
      fs.stat(template, (err) => {
        if (err)
          return res.send(defaultTemplate(data));
        if (app && app.get && app.get('view engine'))
          return res.render(template, data);
        else
          return res.send(require(template)(data));
      })
    } else {
      return res.json(data);
    }
  });
}

var updateOptions = (options, params) => {
  Object.assign(options, params);
}

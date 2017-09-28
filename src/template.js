module.exports = (data) => {
  return `
    <!DOCTYPE>
    <html>
      <head>
        <title>Test</title>
        <script>
          window.addEventListener('load', () => {
            console.log('load');
            var data = ${JSON.stringify(data)};
            toList(data);
          })

          var toList = (data, prefix) => {
            Object.keys(data).map((key) => {
              var root = document.getElementById(prefix? prefix : 'root'),
                  li = document.createElement('li'),
                  ul = document.createElement('ul');
              if (typeof data[key] === 'object' && !data[key].mode) {
                ul.id = prefix || '' + '/' + key;
                li.innerHTML = key;
                li.append(ul);
                root.append(li);
                return toList(data[key], prefix || '' + '/' + key);
              }
              li.innerHTML = key;
              root.append(li);
              return;
            })
          }
        </script>
      </head>
      <body>
        <ul id="root"></ul>
      </body>
    </html>
  `
}

var toArray = (data, prefix) => {
  return Object.keys(data).map((key) => {
    if (typeof data[key] === 'object' && data[key].constructor.name != 'Stats')
      return toArray(data[key], `${prefix || ''}/${key}`);
    var result = {};
    result[`${prefix || ''}/${key}`] = data[key];
    return result;
  })
}

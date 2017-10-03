module.exports = (data) => {
  return `
    <!DOCTYPE>
    <html>
      <head>
        <title>DIR</title>
        <style>
          li { font-weight: bold; padding-left: 15px; position: relative; }
          li:before { background: black; content: ''; display: inline-block; height: 15px; left: 0; position: absolute; width: 3px; }
          li:after { background: black; content: ''; height: 3px; left: 0px; position: absolute; top: 8px; width: 15px; }
          li:last-child:before { height: 10px; }
          ul { list-style: none; }
          ul:not(#root) { padding: 0; }
          ul.data { display: none; }
          ul.data li { border:1px dotted black; box-sizing: border-box; display: block; font-weight: normal; padding-left: 0; }
          ul.data li:before, ul.data li:after { content: none; }
          ul.data li[data-key='image'], ul.data li .key, ul.data li .value { display: block; }
          ul.data li[data-key='image'] img { width: 100% }
          #wrapper > div { display: inline-block; }
          #wrapper > div:first-child { width: 25%; }
        </style>
        <script>
          var all = false;
          window.addEventListener('load', () => {
            console.log('load');
            var data = ${JSON.stringify(data)};
            toList(data);

            document.querySelectorAll('li').forEach((element) => {
              element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (element.children.length > 0 && element.children[0].tagName.match(/ul/i)) {
                  element.children[0].style.display = window.getComputedStyle(element.children[0], null).display === 'none'? 'block' : 'none'
                  if (element.children[0].className === 'data') {
                    fetch(element.id).then((response) => {
                      return response.text();
                    }).then((text) => {
                      document.getElementById('result').innerHTML = text;
                    })
                  }
                }
              })
            })

            /*document.getElementById('all').addEventListener('click', () => {
              document.querySelectorAll('ul:not(#root)').forEach((element) => {
                element.style.display = 'block';
              })
              if (all) {
                document.querySelectorAll('.data').forEach((element) => {
                  element.style.display = 'none';
                })
              }
              all = !all;
            })*/

            document.getElementById('search').addEventListener('input', (element) => {
              console.log(document.getElementById('search').value);
            })
          })

          var toList = (data, prefix) => {
            Object.keys(data).map((key) => {
              var root = document.getElementById(prefix? prefix : 'root'),
                  li = document.createElement('li'),
                  ul = document.createElement('ul');
              if (typeof data[key] === 'object' && !data[key].mode) {
                ul.id = (prefix || '') + '/' + key;
                li.innerHTML = key;
                li.append(ul);
                root.append(li);
                return toList(data[key], (prefix || '') + '/' + key);
              }
              li.id = (prefix || '') + '/' + key;
              li.innerHTML = key;
              ul.className = 'data';
              var li2 = document.createElement('li'),
                  img = document.createElement('img');
              if (key.match(/.*(jpg)$/g)) {
                img.src = (prefix || '') + '/' + key;
                li2.dataset.key = 'image';
                li2.append(img);
                ul.append(li2);
              }
              Object.keys(data[key]).map((key2) => {
                li2 = document.createElement('li')
                li2.dataset.key = key2;
                li2.innerHTML = '<span class="key">' + key2 + '</span><span class="value">' + data[key][key2] + '</span>';
                ul.append(li2);
              })
              li.append(ul);
              root.append(li);
              return;
            })
          }
        </script>
      </head>
      <body>
        <!-- <input id="all" type="button" value="ALL" /> -->
        <div id="top">
          <input id="search" type="text" placeholder="search" />
        </div>
        <div id="wrapper">
          <div><ul id="root"></ul></div>
          <div id="result"></div>
        </div>
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

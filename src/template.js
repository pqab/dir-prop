module.exports = (data) => {
  return `
    <!DOCTYPE>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>dir tree</title>
        <style>
          #root li { font-weight: bold; padding-left: 15px; position: relative; }
          #root li:before { background: red; content: ''; display: inline-block; height: 15px; left: 0; position: absolute; width: 3px; }
          #root li:after { background: red; content: ''; height: 3px; left: 0px; position: absolute; top: 8px; width: 15px; }
          #root li:last-child:before { height: 10px; }
          #root li:hover { cursor: pointer; }
          .hover { color: DimGray; cursor: pointer; }
          .hover:active { color: black; }
          ul { list-style: none; }
          ul:not(#root) { padding: 0; }
          ul.data { display: none; }
          ul.data li { border:1px dotted black; box-sizing: border-box; display: block; font-weight: normal; padding-left: 0; }
          ul.data li:before, ul.data li:after, #result-stat li:before, #result-stat li:after { content: none; }
          #search { font-size: 18px; height: 45px; width: 100%; }
          #wrapper > div { border: 1px dotted black; box-sizing: border-box; display: inline-block; height: calc(100vh - 65px); overflow-x: hidden; margin: 0; overflow-y: auto; vertical-align: top; width: calc(100% - 254px); }
          #wrapper > div:first-child { width: 250px; }
          #result-stat { border: 1px dotted black; display: none; }
          #result-stat li { border: 1px dotted black; box-sizing: border-box; display: inline-block; font-weight: normal; padding-left: 0; }
          #result-stat .key, #result-stat .value { display: block; }
          #result-img { width: 100%; }
        </style>
        <script>
          var all = false;
          window.addEventListener('load', () => {
            var data = ${JSON.stringify(data)};
            toList(data);

            document.querySelectorAll('li').forEach((element, index) => {
              element.addEventListener('mouseover', (e) => {
                e.stopPropagation();
                e.target.className = 'hover';
              });
              element.addEventListener('mouseout', (e) => {
                e.target.className = '';
              });
              element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (element.children.length > 0 && element.children[0].tagName.match(/ul/i)) {
                  var _response, image = false;
                  if (element.children[0].className === 'data') {
                    fetch(element.id).then((response) => {
                      _response = response;
                      return _response.clone().blob();
                    }).then((text) => {
                      document.getElementById('result-stat').style.display = 'block';
                      document.getElementById('result-text').style.display = 'none';
                      document.getElementById('result-img').style.display = 'block';
                      document.getElementById('result-img').src = URL.createObjectURL(text);
                      document.getElementById('result-img').addEventListener('error', (err) => {
                        err.target.style.display = 'none';
                        document.getElementById('result-text').style.display = 'block';
                      })
                      return _response.clone().text();
                    }).then((text) => {
                      document.getElementById('result-text').innerText = text;
                      document.getElementById('result-stat').innerHTML = element.children[0].innerHTML;
                    })
                  }
                }
              })
            })

            document.getElementById('search').addEventListener('input', (element) => {
              var searchText = document.getElementById('search').value;
              if (!searchText) {
                document.querySelectorAll('#root li:not(.data-li)').forEach((element) => {
                  element.style.display = 'block';
                })
              } else {
                document.querySelectorAll('#root li:not(.data-li)').forEach((element) => {
                  element.style.display = 'none';
                })
                document.querySelectorAll('#root li:not(.data-li)').forEach((element) => {
                  if (!element.id)
                    return;
                  if (element.id.match(new RegExp(searchText), 'g')) {
                    do {
                      element.style.display = 'block';
                      element = element.parentElement;
                    } while (element && element.id !== 'root');
                  }
                })
              }
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
              var li2 = document.createElement('li');
              Object.keys(data[key]).map((key2) => {
                if (key2.match(/Ms/g))
                  return;
                li2 = document.createElement('li');
                li2.className = 'data-li';
                li2.dataset.key = key2;
                li2.innerHTML = '<span class="key" title="' + convertStatKey(key2).description + '">' + convertStatKey(key2).name + ' (' + key2 + ')</span><span class="value">' + data[key][key2] + '</span>';
                ul.append(li2);
              })
              li.append(ul);
              root.append(li);
              return;
            })
          }

          var convertStatKey = (key) => {
            var map = {
              'dev': {
                name: 'Device ID',
                description: 'Device ID.'
              },
              'mode': {
                name: 'File type and mode',
                description: 'File type and mode.'
              },
              'nlink': {
                name: 'Hard links',
                description: 'Number of hard links.'
              },
              'uid': {
                name: 'User ID',
                description: 'User ID of owner.'
              },
              'gid': {
                name: 'Group ID',
                description: 'Group ID of owner.'
              },
              'rdev': {
                name: 'Represents Device',
                description: 'Describes the device that this file (inode) represents.'
              },
              'blksize': {
                name: 'Blocks Size',
                description: 'Block size for filesystem I/O.'
              },
              'ino': {
                name: 'Inode number',
                description: 'Inode number.'
              },
              'size': {
                name: 'Size',
                description: 'Size of the file.'
              },
              'blocks': {
                name: 'Blocks',
                description: 'Number of 512B blocks allocated.'
              },
              'atime': {
                name: 'Access Time',
                description: 'Time when file data last accessed.'
              },
              'mtime': {
                name: 'Modified Time',
                description: 'Time when file data last modified.'
              },
              'ctime': {
                name: 'Change Time',
                description: 'Time when file status was last changed (inode data modification).'
              },
              'birthtime': {
                name: 'Birth Time',
                description: 'Time of file creation.'
              }
            }
            return map[key];
          }
        </script>
      </head>
      <body>
        <div id="top">
          <input id="search" type="text" placeholder="search" />
        </div>
        <div id="wrapper">
          <div><ul id="root"></ul></div>
          <div id="result">
            <ul id="result-stat"></ul>
            <img id="result-img"></img>
            <pre id="result-text"></pre>
          </div>
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

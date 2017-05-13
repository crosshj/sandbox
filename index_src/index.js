const site = 'https://crosshj.com';
const source = 'https://github.com/crosshj';
const root = '/sandbox/';

fetch('https://api.github.com/repos/crosshj/sandbox/contents/src?ref=gh-pages')
  .then(res => res.json())
  .then(json => {
    console.table(json);

    const rootEl = document.getElementById('projects');
    var ul = document.createElement('ul');
    json.forEach(j => {
      const li = document.createElement('li');
      li.textContent = j.name;
      [{site}, {source}].forEach(base => {
        const a = document.createElement('a');
        a.href = (base.site || base.source) + root + (base.source ? 'tree/gh-pages/' : '') + j.path;
        a.textContent = base.site ? '[demo]' : '[source]';
        li.appendChild(a);
      });

      ul.appendChild(li);
    });
    rootEl.appendChild(ul);
  })

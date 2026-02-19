/* nav.js — shared site navigation, auto-injected */
(function(){
  var current = location.pathname.split('/').pop() || 'index.html';
  var items = [
    { label: 'Home', href: './' , match: ['index.html',''] },
    { label: 'Hub', href: './hub.html', match: ['hub.html'] },
    { label: 'Search', href: './search.html', match: ['search.html'] },
    { label: 'News', href: './news.html', match: ['news.html'] },
    { label: 'Links', href: './links.html', match: ['links.html'] },
    { label: 'Cast', href: './cast.html', match: ['cast.html'] },
    { label: 'Timeline', href: './timeline.html', match: ['timeline.html'] },
    { label: 'Investigations', href: './investigations.html', match: ['investigations.html'] },
    { label: 'Flights', href: './flights.html', match: ['flights.html'] },
    { label: 'Map', href: './map.html', match: ['map.html'] },
    { label: 'How to Help', href: './contribute.html', match: ['contribute.html'] },
    { label: 'GitHub', href: 'https://github.com/Eyeswidewoke/PDF-FIles', external: true }
  ];

  var nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label','Site navigation');

  var inner = document.createElement('div');
  inner.className = 'site-nav-inner';

  var brand = document.createElement('a');
  brand.href = './';
  brand.className = 'site-nav-brand';
  brand.textContent = 'THE PDF FILES';
  inner.appendChild(brand);

  var toggle = document.createElement('button');
  toggle.className = 'site-nav-toggle';
  toggle.setAttribute('aria-label','Toggle menu');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  inner.appendChild(toggle);

  var ul = document.createElement('ul');
  ul.className = 'site-nav-links';
  items.forEach(function(item){
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    if(item.external){ a.target='_blank'; a.rel='noopener'; }
    if(item.match && item.match.indexOf(current) !== -1){
      a.classList.add('active');
    }
    li.appendChild(a);
    ul.appendChild(li);
  });
  inner.appendChild(ul);
  nav.appendChild(inner);

  var noise = document.querySelector('.noise');
  if(noise && noise.nextSibling){
    noise.parentNode.insertBefore(nav, noise.nextSibling);
  } else {
    document.body.insertBefore(nav, document.body.firstChild);
  }

  toggle.addEventListener('click',function(){
    nav.classList.toggle('open');
  });

  var style = document.createElement('style');
  style.textContent = ''
    +'.site-nav{position:sticky;top:0;z-index:9999;background:#1a1310;border-bottom:1px solid #3a2f28;font-family:var(--mono,"IBM Plex Mono",monospace)}'
    +'.site-nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;padding:0 1rem;min-height:46px;gap:.5rem}'
    +'.site-nav-brand{color:#c9a44a;font-weight:700;font-size:.82rem;letter-spacing:.06em;text-decoration:none;white-space:nowrap;margin-right:auto}'
    +'.site-nav-brand:hover{color:#e0c070}'
    +'.site-nav-toggle{display:none;background:none;border:none;cursor:pointer;padding:6px;flex-direction:column;gap:4px}'
    +'.site-nav-toggle span{display:block;width:20px;height:2px;background:#c9a44a;border-radius:2px;transition:transform .2s}'
    +'.site-nav-links{display:flex;list-style:none;margin:0;padding:0;gap:.15rem;flex-wrap:wrap;align-items:center}'
    +'.site-nav-links a{display:block;padding:.35rem .55rem;color:#d4c4a8;font-size:.68rem;font-weight:600;text-decoration:none;border-radius:5px;letter-spacing:.02em;white-space:nowrap;transition:background .15s,color .15s}'
    +'.site-nav-links a:hover{background:#2a2118;color:#fff}'
    +'.site-nav-links a.active{background:#3a2a1a;color:#c9a44a}'
    +'@media(max-width:760px){'
    +'.site-nav-toggle{display:flex}'
    +'.site-nav-links{display:none;width:100%;flex-direction:column;padding:.5rem 0}'
    +'.site-nav.open .site-nav-links{display:flex}'
    +'.site-nav-inner{flex-wrap:wrap}'
    +'}';
  document.head.appendChild(style);
})();

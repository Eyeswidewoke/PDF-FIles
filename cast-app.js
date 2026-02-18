(function () {
  "use strict";

  const DOC_ID_PATTERN = /(EFTA|EPSTEIN)(-?)(\d{4,})/i;
  const NEIGHBOR_WINDOWS = new Set([1, 2, 5, 10]);
  const DEFAULT_NEIGHBOR_WINDOW = 2;

  const TIER_LABELS = {7:"Co-Conspirator",6:"Active Collaborator",5:"Peripheral Participant",4:"Enabler",3:"Aware",2:"Acquaintance",1:"Ambient"};
  const TIER_COLORS = {7:"#b71c1c",6:"#c62828",5:"#d84315",4:"#e65100",3:"#ef6c00",2:"#f57f17",1:"#9e9e9e"};
  const CATEGORY_ORDER = ["08_Epstein_Network","01_Family","02_Inner_Circle","03_Cabinet_Admin","04_Campaign_Political","05_Legal_Investigations","06_Media_Propaganda","07_Business_Finance","08_Foreign","09_Opponents_Whistleblowers","10_Victims_Accusers","11_Historical_References"];

  const state = {network:null,bundle:null,members:[],edges:[],memberBySlug:new Map(),filteredMembers:[],filteredEdges:[],availablePaths:new Set(),linkMaps:{castPages:new Map(),castProfiles:new Map(),peopleBuckets:new Map()},viewerPath:"",viewerRequestToken:0,viewerNeighborWindow:DEFAULT_NEIGHBOR_WINDOW};

  const $ = (id) => document.getElementById(id);

  function escapeHtml(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
  function normalizeKey(s){return String(s||"").replace(/\.md$/i,"").replace(/\s*\(cast page\)$/i,"").replace(/\s*\(people bucket\)$/i,"").replace(/\s+/g," ").replace(/^_+/,"").replace(/[^a-z0-9]+/gi," ").toLowerCase().trim();}
  function normalizePath(s){return String(s||"").replace(/\\/g,"/").replace(/^\.?\//, "").trim();}
  function formatNumber(n){return Number(n||0).toLocaleString();}
  function slugFromName(n){return normalizeKey(n).replace(/\s+/g,"-");}
  function isExternalHref(h){var v=String(h||"").trim();return/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v)||v.startsWith("//");}

  function indexAvailablePaths(){var p=new Set();((state.bundle&&state.bundle.collections)||[]).forEach(function(c){(c.items||[]).forEach(function(i){var pa=normalizePath(i&&i.path);if(pa&&!isExternalHref(pa))p.add(pa);});});state.availablePaths=p;}
  function firstAvailablePath(){for(var i=0;i<arguments.length;i++){var c=normalizePath(arguments[i]);if(c&&state.availablePaths.has(c))return c;}return"";}
  function findPathByBasename(p){var c=normalizePath(p);if(!c)return"";var parts=c.split("/"),base=(parts[parts.length-1]||"").toLowerCase();if(!base)return"";var m=[];state.availablePaths.forEach(function(x){var cx=normalizePath(x);if(cx.toLowerCase().endsWith("/"+base)||cx.toLowerCase()===base)m.push(cx);});return m.length===1?m[0]:m.length?m.sort()[0]:"";}
  function resolveKnownPath(p){var c=normalizePath(p);if(!c)return"";var d=firstAvailablePath(c,c.replace(/^content\/emails\/email-cast-flagged\//i,"content/emails/cast-flagged/"),c.replace(/^content\/emails\/cast-flagged\//i,"content/emails/email-cast-flagged/"));return d||findPathByBasename(c);}

  function sanitizeNeighborWindow(v){var n=Number(v);return NEIGHBOR_WINDOWS.has(n)?n:DEFAULT_NEIGHBOR_WINDOW;}
  function parseNumberedPath(p){var c=normalizePath(p);if(!c)return null;var parts=c.split("/"),fn=parts.pop()||"",m=fn.match(DOC_ID_PATTERN);if(!m)return null;var id=Number(m[3]);if(!Number.isFinite(id))return null;return{path:c,dir:parts.join("/"),filename:fn,token:m[0],prefix:m[1],separator:m[2]||"",width:m[3].length,id:id};}
  function buildNeighborPath(parsed,id){if(!parsed||!Number.isFinite(id)||id<=0)return"";var tok=parsed.prefix+parsed.separator+String(id).padStart(parsed.width,"0");return normalizePath((parsed.dir?parsed.dir+"/":"")+parsed.filename.replace(parsed.token,tok));}
  function collectNeighborTargets(path,ws){var parsed=parseNumberedPath(path);if(!parsed)return[];var seen=new Set(),out=[];for(var d=-ws;d<=ws;d++){var tid=parsed.id+d;if(tid<=0)continue;if(d===0){var ck=normalizePath(parsed.path);if(!seen.has(ck)){seen.add(ck);out.push({delta:0,id:tid,path:parsed.path,attemptedPath:parsed.path});}continue;}var ap=buildNeighborPath(parsed,tid),kn=resolveKnownPath(ap),key=normalizePath(kn||ap);if(!key||seen.has(key))continue;seen.add(key);out.push({delta:d,id:tid,path:kn||"",attemptedPath:ap});}return out;}
  function neighborDeltaLabel(d){return!Number(d)?"Current":(d>0?"+"+d:String(d));}

  function updateViewerNeighborControls(path){
    var sel=$("viewerNeighborWindow"),btn=$("viewerNeighborsBtn"),met=$("viewerNeighborMeta");
    state.viewerPath=normalizePath(path||state.viewerPath||"");
    state.viewerNeighborWindow=sanitizeNeighborWindow(sel?sel.value:state.viewerNeighborWindow);
    if(sel)sel.value=String(state.viewerNeighborWindow);
    if(btn)btn.textContent="Open +/-"+state.viewerNeighborWindow+" neighbors";
    var parsed=parseNumberedPath(state.viewerPath);
    if(!parsed){if(btn)btn.disabled=true;if(met)met.textContent=state.viewerPath?"No numeric EFTA/EPSTEIN ID in this file name.":"Open a numbered file to enable nearby context.";return;}
    var targets=collectNeighborTargets(state.viewerPath,state.viewerNeighborWindow);
    var avail=targets.filter(function(e){return e.delta!==0&&!!e.path;}).length;
    if(btn)btn.disabled=false;
    if(met)met.textContent=avail?"Found "+formatNumber(avail)+" nearby file(s).":"No nearby numbered files for this window.";
  }

  function pathToFetchUrl(p){var c=normalizePath(p);return"./"+c.split("/").map(function(s){try{return encodeURIComponent(decodeURIComponent(s));}catch(_){return encodeURIComponent(s);}}).join("/");}
  function resolveInternalPath(base,href){var raw=String(href||"").trim();if(!raw||raw.startsWith("#")||isExternalHref(raw))return"";var nh=raw.split("#")[0].split("?")[0];if(!nh)return"";nh=nh.replace(/\\/g,"/").replace(/^(?:\.\/)+/,"");if(nh.startsWith("/"))return normalizePath(nh);if(/^(content|data)\//i.test(nh))return normalizePath(nh);var b=normalizePath(base||""),bd=b.includes("/")?b.slice(0,b.lastIndexOf("/")+1):"";try{var url=new URL(nh,"https://local/"+bd);return normalizePath(decodeURIComponent(url.pathname).replace(/^\/+/,""));}catch(_){return normalizePath(nh);}}

  function categoryLabel(c){var cats=(state.network&&state.network.categories)||{};return(cats[c]&&cats[c].label)||c||"Uncategorized";}
  function categoryColor(c){var cats=(state.network&&state.network.categories)||{};return(cats[c]&&cats[c].color)||"#555";}
  function categoryIcon(c){var cats=(state.network&&state.network.categories)||{};return(cats[c]&&cats[c].icon)||"";}
  function stripSummary(s){var r=String(s||"").replace(/^\uFEFF/,"").replace(/^#+\s*/,"").replace(/\*\*/g,"").replace(/\*/g,"").replace(/`/g,"").trim();if(!r)return"(no summary)";return r.length>240?r.slice(0,237)+"...":r;}

  function collectionItemsByTitle(t){var colls=(state.bundle&&state.bundle.collections)||[];var f=colls.find(function(c){return String(c.title||"").toLowerCase()===String(t).toLowerCase();});return(f&&f.items)||[];}

  function buildLinkMaps(){
    collectionItemsByTitle("Cast Pages").forEach(function(item){var l=String(item.label||"");if(/^cast-hub\.md$/i.test(l))return;state.linkMaps.castPages.set(normalizeKey(l),normalizePath(item.path));});
    collectionItemsByTitle("Cast Profiles").forEach(function(item){state.linkMaps.castProfiles.set(normalizeKey(item.label),normalizePath(item.path));});
    collectionItemsByTitle("People Email Buckets").forEach(function(item){state.linkMaps.peopleBuckets.set(normalizeKey(item.label),normalizePath(item.path));});
  }

  function sumMentions(member){var groups=member.connections||{},total=0;Object.values(groups).forEach(function(arr){(arr||[]).forEach(function(e){if(!e||e.slug===member.slug)return;total+=Number(e.mentions||0);});});return total;}

  function buildMemberRecords(){
    var members=(state.network&&state.network.members)||[];
    var records=members.map(function(member){
      var key=normalizeKey(member.name);
      var catPfx=String(member.category||"").toLowerCase().replace(/_/g,"-");
      var pageByCat=catPfx?"content/cast/pages/"+catPfx+"-"+slugFromName(member.name)+".md":"";
      var pageFB=member.slug?"content/cast/pages/08-epstein-network-"+String(member.slug)+".md":"";
      var pagePath=firstAvailablePath(state.linkMaps.castPages.get(key),pageByCat,pageFB)||normalizePath(pageByCat||pageFB);
      var bucketPath=firstAvailablePath(state.linkMaps.peopleBuckets.get(key)||"");
      return{slug:member.slug,name:member.name,category:member.category,categoryLabel:categoryLabel(member.category),connectionCount:Number(member.connection_count||0),connectionMentions:sumMentions(member),summary:stripSummary(member.summary),pagePath:pagePath,bucketPath:bucketPath,dossier:member.dossier||"",tier:member.tier||0,searchBlob:""};
    });
    var used=new Set();
    records.forEach(function(m,i){var s=String(m.slug||"").trim();if(!s)s="cast-member-"+(i+1);if(used.has(s))s=s+"-"+(i+1);used.add(s);m.slug=s;m.searchBlob=(m.name+" "+m.categoryLabel+" "+m.summary).toLowerCase();});
    state.members=records;
    state.memberBySlug=new Map(state.members.map(function(m){return[m.slug,m];}));
  }

  function buildEdgeRecords(){
    var pairMap=new Map();
    ((state.network&&state.network.members)||[]).forEach(function(member){
      var groups=member.connections||{};
      Object.entries(groups).forEach(function(entry){var context=entry[0],list=entry[1];
        (list||[]).forEach(function(target){if(!target||!target.slug||target.slug===member.slug)return;var pair=[member.slug,target.slug].sort(),key=pair[0]+"||"+pair[1];if(!pairMap.has(key))pairMap.set(key,{aSlug:pair[0],bSlug:pair[1],mentions:0,contexts:new Set()});var rec=pairMap.get(key);rec.mentions+=Number(target.mentions||0);rec.contexts.add(context);});
      });
    });
    state.edges=Array.from(pairMap.values()).map(function(e){var a=state.memberBySlug.get(e.aSlug),b=state.memberBySlug.get(e.bSlug);return Object.assign({},e,{aName:(a&&a.name)||e.aSlug,bName:(b&&b.name)||e.bSlug,contexts:Array.from(e.contexts.values()).sort()});}).sort(function(a,b){return b.mentions-a.mentions||a.aName.localeCompare(b.aName);});
  }

  /* ── Rendering ───────────────────────────────────── */

  function renderStats(){
    var cats=(state.network&&state.network.categories)||{};
    var withDossier=state.members.filter(function(m){return!!m.dossier;}).length;
    var epNet=state.members.filter(function(m){return m.category==="08_Epstein_Network";}).length;
    var stats=[["Total Cast",state.members.length],["Sections",Object.keys(cats).length],["Epstein Network",epNet],["Dossier Pages",withDossier],["Connection Pairs",state.edges.length]];
    $("summaryStats").innerHTML=stats.map(function(s){return'<div class="big-stat"><div class="n">'+formatNumber(s[1])+'</div><div class="l">'+escapeHtml(s[0])+"</div></div>";}).join("");
  }

  function renderCategoryBars(){
    var cats=(state.network&&state.network.categories)||{};
    var rows=Object.entries(cats).map(function(e){return{code:e[0],label:e[1].label||e[0],count:Number(e[1].count||0),color:e[1].color||"",icon:e[1].icon||""};});
    rows.sort(function(a,b){return b.count-a.count||a.label.localeCompare(b.label);});
    var max=Math.max.apply(null,rows.map(function(r){return r.count;}).concat([1]));
    $("categoryBars").innerHTML=rows.map(function(r){
      var cs=r.color?"background:"+escapeHtml(r.color):"";
      return'<div class="cat-row"><span class="cat-name">'+escapeHtml(r.icon+" "+r.label)+'</span><span class="cat-track"><span class="cat-fill" style="width:'+((r.count/max)*100).toFixed(2)+"%;"+cs+'"></span></span><span class="cat-count">'+formatNumber(r.count)+"</span></div>";
    }).join("");
  }

  function memberCardHtml(member){
    var tierBadge=member.tier>0?'<span class="tier-badge" style="background:'+(TIER_COLORS[member.tier]||"#555")+'">Tier '+member.tier+" \u2014 "+escapeHtml(TIER_LABELS[member.tier]||"")+"</span>":"";
    var catColor=categoryColor(member.category);
    var dossierUrl=member.dossier?"./"+member.dossier:"";
    var btns=[];
    if(dossierUrl)btns.push('<a class="btn primary" href="'+escapeHtml(dossierUrl)+'">View Profile</a>');
    if(member.pagePath)btns.push('<button class="btn" data-open-path="'+escapeHtml(member.pagePath)+'">Cast Page</button>');
    if(member.bucketPath)btns.push('<button class="btn" data-open-path="'+escapeHtml(member.bucketPath)+'">Email Bucket</button>');
    if(!btns.length&&member.pagePath)btns.push('<button class="btn" data-open-path="'+escapeHtml(member.pagePath)+'">Cast Page</button>');

    return'<article class="member-card">'+'<div class="member-name">'+escapeHtml(member.name)+"</div>"+'<div class="member-cat" style="color:'+escapeHtml(catColor)+'">'+escapeHtml(categoryIcon(member.category)+" "+member.categoryLabel)+"</div>"+tierBadge+'<p class="member-summary">'+escapeHtml(member.summary)+"</p>"+'<div class="member-actions">'+btns.join("")+"</div></article>";
  }

  function populateDirectoryFilters(){
    var cats=(state.network&&state.network.categories)||{};
    var sel=$("memberCategory");
    sel.innerHTML='<option value="">All sections</option>';
    var ordered=CATEGORY_ORDER.filter(function(c){return cats[c];});
    var extra=Object.keys(cats).filter(function(c){return CATEGORY_ORDER.indexOf(c)<0;}).sort();
    ordered.concat(extra).forEach(function(code){
      var meta=cats[code];
      var opt=document.createElement("option");
      opt.value=code;
      opt.textContent=(meta.icon||"")+" "+(meta.label||code);
      sel.appendChild(opt);
    });
  }

  function applyMemberFilters(){
    var q=String($("memberSearch").value||"").toLowerCase().trim();
    var cat=String($("memberCategory").value||"");
    var sort=String($("memberSort").value||"section");
    var filtered=state.members.filter(function(m){
      if(cat&&m.category!==cat)return false;
      if(!q)return true;
      return m.searchBlob.indexOf(q)>=0;
    });
    if(sort==="name"){filtered.sort(function(a,b){return a.name.localeCompare(b.name);});}
    else if(sort==="tier"){filtered.sort(function(a,b){return(b.tier||0)-(a.tier||0)||a.name.localeCompare(b.name);});}
    else{filtered.sort(function(a,b){var ai=CATEGORY_ORDER.indexOf(a.category),bi=CATEGORY_ORDER.indexOf(b.category);var oa=ai>=0?ai:999,ob=bi>=0?bi:999;if(oa!==ob)return oa-ob;return a.name.localeCompare(b.name);});}
    state.filteredMembers=filtered;
    renderMemberList();
  }

  function renderMemberList(){
    var members=state.filteredMembers;
    $("memberMeta").textContent=formatNumber(members.length)+" cast member(s)";
    if(!members.length){$("memberList").innerHTML='<p class="result-meta">No cast members match this filter.</p>';return;}
    var sort=String($("memberSort").value||"section");
    if(sort==="section"){
      var groups=new Map();
      members.forEach(function(m){var k=m.category;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(m);});
      var html="";
      groups.forEach(function(gm,catCode){
        var icon=categoryIcon(catCode),label=categoryLabel(catCode),color=categoryColor(catCode);
        html+='<div class="section-group"><div class="section-header" style="border-left:4px solid '+escapeHtml(color)+'">';
        html+='<span class="section-icon">'+escapeHtml(icon)+'</span>';
        html+='<span class="section-label">'+escapeHtml(label)+'</span>';
        html+='<span class="section-count">'+formatNumber(gm.length)+'</span>';
        html+='</div><div class="member-list-inner">';
        html+=gm.map(function(m){return memberCardHtml(m);}).join("");
        html+='</div></div>';
      });
      $("memberList").innerHTML=html;
    }else{
      $("memberList").innerHTML=members.map(function(m){return memberCardHtml(m);}).join("");
    }
    bindPathButtons($("memberList"));
  }

  function renderTopConnected(){
    var top=state.members.filter(function(m){return m.tier>=5;}).sort(function(a,b){return(b.tier||0)-(a.tier||0)||a.name.localeCompare(b.name);}).slice(0,12);
    if(!top.length)top=state.members.filter(function(m){return m.connectionCount>0;}).sort(function(a,b){return b.connectionCount-a.connectionCount;}).slice(0,12);
    $("topConnected").innerHTML=top.map(function(m){return memberCardHtml(m);}).join("");
    bindPathButtons($("topConnected"));
  }

  function applyEdgeFilters(){
    var q=String($("edgeSearch").value||"").toLowerCase().trim();
    var min=Number($("edgeMin").value||1);
    state.filteredEdges=state.edges.filter(function(e){if(e.mentions<min)return false;if(!q)return true;return(e.aName+" "+e.bName).toLowerCase().indexOf(q)>=0;});
    renderEdges();
  }

  function renderEdges(){
    $("edgeMeta").textContent=formatNumber(state.filteredEdges.length)+" pair(s)";
    $("edgeRows").innerHTML=state.filteredEdges.length?state.filteredEdges.slice(0,2000).map(function(e){
      var l=state.memberBySlug.get(e.aSlug),r=state.memberBySlug.get(e.bSlug);
      var lu=l&&l.dossier?"./"+l.dossier:"",ru=r&&r.dossier?"./"+r.dossier:"";
      return"<tr><td>"+escapeHtml(e.aName)+" + "+escapeHtml(e.bName)+"</td><td>"+formatNumber(e.mentions)+"</td><td>"+(lu?'<a class="btn" href="'+escapeHtml(lu)+'">'+escapeHtml(e.aName)+"</a> ":escapeHtml(e.aName)+" ")+(ru?'<a class="btn" href="'+escapeHtml(ru)+'">'+escapeHtml(e.bName)+"</a>":escapeHtml(e.bName))+"</td></tr>";
    }).join(""):'<tr><td colspan="3" style="color:var(--muted)">No pairs match.</td></tr>';
  }

  function bindPathButtons(scope){if(!scope)return;scope.querySelectorAll("[data-open-path]").forEach(function(b){b.addEventListener("click",function(){openDoc(b.getAttribute("data-open-path"));});});}
  function bindInlineLinks(scope,currentPath){if(!scope)return;scope.querySelectorAll("a[data-inline-link='1']").forEach(function(a){a.addEventListener("click",function(ev){var h=a.getAttribute("href")||"";if(isExternalHref(h))return;var r=resolveInternalPath(currentPath,h);if(!r)return;ev.preventDefault();var k=resolveKnownPath(r);if(k){openDoc(k);return;}showMissingDoc(r);});});}
  function switchTab(k){document.querySelectorAll(".tab-btn").forEach(function(b){b.classList.toggle("active",b.dataset.tab===k);});document.querySelectorAll(".tab-content").forEach(function(p){p.classList.toggle("active",p.id==="tab-"+k);});}
  function bindTabs(){document.querySelectorAll(".tab-btn").forEach(function(b){b.addEventListener("click",function(){switchTab(b.dataset.tab);});});}

  /* ── Markdown + Doc viewer ────────────────────────── */
  function markdownToHtml(input){
    var src=String(input||"").replace(/\r\n/g,"\n"),lines=src.split("\n"),inCode=false,codeBuf=[],inUl=false,inOl=false,out=[];
    var closeLists=function(){if(inUl){out.push("</ul>");inUl=false;}if(inOl){out.push("</ol>");inOl=false;}};
    var inline=function(text){var v=escapeHtml(text),ct=[];v=v.replace(/`([^`]+)`/g,function(_,c){var t="@@C"+ct.length+"@@";ct.push("<code>"+c+"</code>");return t;});v=v.replace(/\*\*([^*\n]+)\*\*/g,"<strong>$1</strong>").replace(/__([^_\n]+)__/g,"<strong>$1</strong>").replace(/~~([^~\n]+)~~/g,"<del>$1</del>").replace(/(^|[^\w])\*([^*\n]+)\*(?!\*)/g,"$1<em>$2</em>").replace(/(^|[^\w])_([^_\n]+)_(?!_)/g,"$1<em>$2</em>").replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a href="$2" data-inline-link="1">$1</a>');return v.replace(/@@C(\d+)@@/g,function(_,i){return ct[Number(i)]||"";});};
    lines.forEach(function(raw){var line=raw||"";if(line.startsWith("```")){closeLists();if(!inCode){inCode=true;codeBuf=[];}else{out.push("<pre><code>"+escapeHtml(codeBuf.join("\n"))+"</code></pre>");inCode=false;codeBuf=[];}return;}if(inCode){codeBuf.push(line);return;}var h=line.match(/^(#{1,4})\s+(.+)$/);if(h){closeLists();out.push("<h"+h[1].length+">"+inline(h[2])+"</h"+h[1].length+">");return;}var ul=line.match(/^\s*[-*+]\s+(.+)$/);if(ul){if(inOl){out.push("</ol>");inOl=false;}if(!inUl){out.push("<ul>");inUl=true;}out.push("<li>"+inline(ul[1])+"</li>");return;}var ol=line.match(/^\s*\d+\.\s+(.+)$/);if(ol){if(inUl){out.push("</ul>");inUl=false;}if(!inOl){out.push("<ol>");inOl=true;}out.push("<li>"+inline(ol[1])+"</li>");return;}var q=line.match(/^\s*>\s?(.*)$/);if(q){closeLists();out.push("<blockquote>"+inline(q[1])+"</blockquote>");return;}if(!line.trim()){closeLists();return;}closeLists();out.push("<p>"+inline(line)+"</p>");});
    if(inCode)out.push("<pre><code>"+escapeHtml(codeBuf.join("\n"))+"</code></pre>");closeLists();return out.join("\n");
  }

  function showMissingDoc(path){var ov=$("viewerOverlay"),bd=$("viewerBody");if(!ov||!bd)return;var c=normalizePath(path);state.viewerPath=c;updateViewerNeighborControls(c);ov.classList.add("open");bd.innerHTML='<p style="color:#ffcf8a">File not in public bundle:<br><code>'+escapeHtml(c)+'</code></p>';}

  async function openNeighborDocs(){
    var ov=$("viewerOverlay"),bd=$("viewerBody");if(!ov||!bd)return;
    var bp=normalizePath(state.viewerPath||""),parsed=parseNumberedPath(bp);if(!parsed){updateViewerNeighborControls(bp);return;}
    var ws=sanitizeNeighborWindow(state.viewerNeighborWindow);state.viewerNeighborWindow=ws;
    var targets=collectNeighborTargets(bp,ws);if(!targets.some(function(e){return e.delta!==0&&!!e.path;})){bd.innerHTML='<p style="color:var(--muted)">No nearby files found.</p>';updateViewerNeighborControls(bp);return;}
    ov.classList.add("open");var rt=++state.viewerRequestToken;bd.innerHTML='<p style="color:var(--muted)">Loading neighbors...</p>';
    var loaded=await Promise.all(targets.map(async function(entry){if(!entry.path)return Object.assign({},entry,{status:"missing",text:""});try{var r=await fetch(pathToFetchUrl(entry.path),{cache:"no-store"});if(!r.ok)return Object.assign({},entry,{status:"missing",text:""});return Object.assign({},entry,{status:"ok",text:await r.text()});}catch(err){return Object.assign({},entry,{status:"error",text:""});}}));
    if(rt!==state.viewerRequestToken)return;
    var html=['<div class="neighbor-pack"><div class="neighbor-pack-head"><button class="btn primary" data-open-path="'+escapeHtml(bp)+'">Back To Current</button></div>'];
    loaded.forEach(function(entry){html.push('<section class="neighbor-doc"><div class="neighbor-doc-head"><span class="chip">'+escapeHtml(neighborDeltaLabel(entry.delta))+'</span><code>'+escapeHtml(entry.path||entry.attemptedPath||"")+'</code></div>');if(entry.status==="ok")html.push('<div class="neighbor-doc-body">'+markdownToHtml(entry.text)+'</div>');else html.push('<p class="neighbor-doc-note">Not available.</p>');html.push('</section>');});
    html.push('</div>');bd.innerHTML=html.join("");bindPathButtons(bd);updateViewerNeighborControls(bp);
  }

  async function openDoc(path){
    var ov=$("viewerOverlay"),bd=$("viewerBody");if(!ov||!bd)return;
    var rt=++state.viewerRequestToken,clean=resolveKnownPath(path)||normalizePath(path);
    state.viewerPath=clean;updateViewerNeighborControls(clean);ov.classList.add("open");bd.innerHTML='<p style="color:var(--muted)">Loading...</p>';
    try{var resp=await fetch(pathToFetchUrl(clean),{cache:"no-store"});if(rt!==state.viewerRequestToken)return;if(!resp.ok){if(resp.status===404){showMissingDoc(clean);return;}throw new Error("HTTP "+resp.status);}var text=await resp.text();if(rt!==state.viewerRequestToken)return;bd.innerHTML=markdownToHtml(text);bindInlineLinks(bd,clean);}
    catch(err){if(rt!==state.viewerRequestToken)return;bd.innerHTML='<p style="color:#ff7a7a">Could not load: <code>'+escapeHtml(clean)+"</code></p>";}
  }

  function closeDoc(){state.viewerRequestToken+=1;$("viewerOverlay").classList.remove("open");}

  function bindControls(){
    $("memberSearch").addEventListener("input",applyMemberFilters);
    $("memberCategory").addEventListener("change",applyMemberFilters);
    $("memberSort").addEventListener("change",applyMemberFilters);
    $("edgeSearch").addEventListener("input",applyEdgeFilters);
    $("edgeMin").addEventListener("change",applyEdgeFilters);
    var nw=$("viewerNeighborWindow");if(nw)nw.addEventListener("change",function(){state.viewerNeighborWindow=sanitizeNeighborWindow(nw.value);updateViewerNeighborControls(state.viewerPath);});
    var nb=$("viewerNeighborsBtn");if(nb)nb.addEventListener("click",function(){openNeighborDocs();});
    var ov=$("viewerOverlay");ov.addEventListener("click",function(e){if(e.target===ov)closeDoc();});
    updateViewerNeighborControls("");
  }

  async function loadData(){
    var[nr,br]=await Promise.all([fetch("./content/cast/cast-network.json",{cache:"no-store"}),fetch("./data/public-data.json",{cache:"no-store"})]);
    if(!nr.ok)throw new Error("Failed to load cast network");if(!br.ok)throw new Error("Failed to load public-data");
    state.network=await nr.json();state.bundle=await br.json();indexAvailablePaths();
  }

  async function boot(){
    try{await loadData();buildLinkMaps();buildMemberRecords();buildEdgeRecords();bindTabs();bindControls();populateDirectoryFilters();renderStats();renderCategoryBars();renderTopConnected();applyMemberFilters();applyEdgeFilters();}
    catch(err){document.body.innerHTML+='<p style="padding:1rem;color:#ff7a7a;text-align:center">Failed to load: '+escapeHtml(String(err))+"</p>";}
  }

  window.openDoc=openDoc;window.closeDoc=closeDoc;
  document.addEventListener("DOMContentLoaded",boot);
})();

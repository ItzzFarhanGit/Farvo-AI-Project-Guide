/* AI Project Guide – app logic. Content data (STEPS, FAQ, UI) lives in data.js */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const load=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const reduced=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
const UI2={studio:["Build this prompt in Prompt Studio →","இந்த prompt-ஐ Prompt Studio-இல் உருவாக்குங்கள் →"]};

let lang=load("lang","en");if(lang!=="en"&&lang!=="ta")lang="en";
let theme=document.documentElement.dataset.theme==="dark"?"dark":"light";
let cur=Math.min(Math.max(parseInt(load("cur",0),10)||0,0),STEPS.length-1);
let checks=load("checks",{});if(!checks||typeof checks!=="object")checks={};
const L=()=>lang==="ta"?1:0,esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- Steps ---------- */
function stepDone(i){return STEPS[i].c.every((_,j)=>checks[i+"-"+j])}
function progress(){
  let tot=0,n=0;STEPS.forEach((s,i)=>s.c.forEach((_,j)=>{tot++;if(checks[i+"-"+j])n++}));
  const p=Math.round(n/tot*100);$("#bar").style.width=p+"%";$("#pct").textContent=p+"%";
  $$("#pills button").forEach((b,i)=>b.classList.toggle("done",stepDone(i)));
}
function renderCard(anim){
  const s=STEPS[cur],l=L(),u=k=>UI[k][l];
  const studioBtn=cur===2?`<a class="btn sm studio-link" href="#studio">✨ ${UI2.studio[l]}</a>`:"";
  $("#card").innerHTML=`<div class="shot"><img src="assets/images/step${cur+1}.jpg" onerror="this.onerror=null;this.src='assets/images/step${cur+1}.svg'" alt="${u("img")} ${cur+1}" width="1400" height="788"></div>
  <div class="body"><span class="badge">${u("step")} ${cur+1} ${u("of")} ${STEPS.length}</span><h3>${esc(s.t[l])}</h3>
  ${s.d.map(p=>`<p>${esc(p[l])}</p>`).join("")}
  <h4>💡 ${u("ex")}</h4><p class="ex">${esc(s.ex[l])}</p>
  <h4>🤖 ${u("pr")}</h4><div class="pbox"><pre id="prompt">${esc(s.p)}</pre><div class="pbox-actions"><button class="btn sm copy-btn" id="copy">${u("cp")}</button>${studioBtn}</div></div>
  <h4>✅ ${u("ck")}</h4><ul class="chk">${s.c.map((c,j)=>`<li><label><input type="checkbox" data-k="${cur}-${j}" ${checks[cur+"-"+j]?"checked":""}><span>${esc(c[l])}</span></label></li>`).join("")}</ul>
  <div class="nav2"><button class="btn ghost" id="prev" ${cur===0?"disabled":""}>← ${u("pv")}</button><button class="btn" id="next" ${cur===STEPS.length-1?"disabled":""}>${u("nx")} →</button></div></div>`;
  if(anim){const c=$("#card");c.classList.remove("swap");void c.offsetWidth;c.classList.add("swap")}
  $$("#pills button").forEach((b,i)=>{b.classList.toggle("on",i===cur);b.setAttribute("aria-selected",i===cur)});
  $("#copy").onclick=copyPrompt;$("#prev").onclick=()=>go(cur-1);$("#next").onclick=()=>go(cur+1);
  $$(".chk input").forEach(i=>i.onchange=()=>{checks[i.dataset.k]=i.checked;save("checks",checks);progress()});
}
function go(i,scroll=true){
  if(i<0||i>=STEPS.length)return;cur=i;save("cur",cur);renderCard(true);progress();
  if(scroll)$("#steps").scrollIntoView({behavior:reduced?"auto":"smooth"});
}
function copyPrompt(){
  const t=STEPS[cur].p,b=$("#copy"),done=()=>{b.textContent="✔ "+UI.cd[L()];b.classList.add("ok");setTimeout(()=>{b.textContent=UI.cp[L()];b.classList.remove("ok")},1800)};
  function fallback(){const a=document.createElement("textarea");a.value=t;a.setAttribute("readonly","");a.style.cssText="position:fixed;opacity:0;top:0";document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove();done()}
  if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(done,fallback);else fallback();
}

/* ---------- Static text, language ---------- */
function renderStatic(){
  $$("[data-en]").forEach(e=>{const v=e.dataset[lang];if(v!==undefined)e.textContent=v.replace(/&amp;/g,"&")});
  document.documentElement.lang=lang;document.body.classList.toggle("ta",lang==="ta");
  $("#lang").textContent=lang==="ta"?"English":"தமிழ்";
  $("#flow").innerHTML=STEPS.map((s,i)=>`<li data-i="${i}" tabindex="0" role="button">${esc(s.t[L()])}</li>`).join("");
  $$("#flow li").forEach(li=>{const f=()=>go(+li.dataset.i);li.onclick=f;li.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();f()}}});
  $("#faqs").innerHTML=FAQ.map(f=>`<details><summary>${esc(f[L()])}</summary><p>${esc(f[L()+2])}</p></details>`).join("");
  document.dispatchEvent(new CustomEvent("langchange",{detail:lang}));
}

/* ---------- Theme (dark / light) ---------- */
function setTheme(){
  document.documentElement.dataset.theme=theme;
  const b=$("#theme"),dark=theme==="dark";
  b.setAttribute("aria-pressed",dark);b.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");
  const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=dark?"#0a0818":"#ffffff";
}
function toggleTheme(){
  const next=theme==="dark"?"light":"dark",apply=()=>{theme=next;save("theme",theme);setTheme()};
  if(document.startViewTransition&&!reduced){
    const r=$("#theme").getBoundingClientRect(),s=document.documentElement.style;
    s.setProperty("--tx",(r.left+r.width/2)+"px");s.setProperty("--ty",(r.top+r.height/2)+"px");
    document.startViewTransition(apply);
  }else apply();
}
$("#theme").onclick=toggleTheme;
if(window.matchMedia){
  const mq=matchMedia("(prefers-color-scheme:dark)"),onSys=e=>{if(load("theme",null)===null){theme=e.matches?"dark":"light";setTheme()}};
  mq.addEventListener?mq.addEventListener("change",onSys):mq.addListener&&mq.addListener(onSys);
}

/* ---------- Wiring ---------- */
$("#pills").innerHTML=STEPS.map((_,i)=>`<button role="tab" aria-label="Step ${i+1}">${i+1}</button>`).join("");
$$("#pills button").forEach((b,i)=>b.onclick=()=>go(i,false));
$("#lang").onclick=()=>{lang=lang==="en"?"ta":"en";save("lang",lang);renderStatic();renderCard(false)};
const closeMenu=()=>{$("#menu").classList.remove("open");$("#burger").setAttribute("aria-expanded","false")};
$("#burger").onclick=()=>{const o=$("#menu").classList.toggle("open");$("#burger").setAttribute("aria-expanded",o)};
$$("#menu a").forEach(a=>a.addEventListener("click",closeMenu));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});

/* ---------- Motion: scroll progress, active nav link, reveal-on-scroll ---------- */
(function(){
  const bar=$("#scrollbar");let tick=false;
  const upd=()=>{const h=document.documentElement.scrollHeight-innerHeight;bar.style.transform="scaleX("+(h>0?Math.min(scrollY/h,1):0)+")";tick=false};
  addEventListener("scroll",()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
  if(!("IntersectionObserver" in window)){$$(".reveal").forEach(e=>e.classList.add("in"));return}
  const rv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");rv.unobserve(e.target)}}),{threshold:.08,rootMargin:"0px 0px -6% 0px"});
  $$(".reveal").forEach(e=>rv.observe(e));
  const links=$$("#menu a"),map={};links.forEach(a=>map[a.getAttribute("href").slice(1)]=a);
  const nv=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.removeAttribute("aria-current"));const a=map[e.target.id];if(a)a.setAttribute("aria-current","true")}}),{rootMargin:"-45% 0px -50% 0px"});
  Object.keys(map).forEach(id=>{const s=document.getElementById(id);if(s)nv.observe(s)});
})();

setTheme();renderStatic();renderCard(false);progress();

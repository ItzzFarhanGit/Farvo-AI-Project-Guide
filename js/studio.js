/* Prompt Studio – builds a complete, error-proof Claude prompt from a project name + options.
   All user text is written with textContent (never innerHTML), so nothing typed can break the page. */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const isTa=()=>document.documentElement.lang==="ta";
const T=(en,ta)=>isTa()?ta:en;
const KEY="studio-v2";
const reduced=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;

/* ---------- Project types ---------- */
const G={
college:{en:"College",ta:"கல்லூரி",e:"🎓",label:"college management system",kw:"college university campus school student lecturer academy institute teacher course exam attendance education",
 roles:{ADMIN:["Dashboard Overview","Student Management","Lecturer Management","Department Management","Course Management","Subject Management","Class Management","Attendance Management","Examination Management","Results Management (grades + GPA, explain the demo grading scale)","Timetable Management","Assignment Management","Library Management","Notice Board","Events Management","Fees Management (simulation only)","Reports","User Profile","Settings"],LECTURER:["Dashboard","My Classes","My Subjects","Student List","Attendance","Assignments","Examinations","Results","Timetable","Notices","Profile Settings"],STUDENT:["Dashboard","My Profile","My Courses","My Subjects","My Attendance","My Results","My Assignments","Timetable","Exam Schedule","Library","Notices","Events","Profile Settings"]},
 data:["20 Students","8 Lecturers","5 Departments","10 Courses","15 Subjects","10 Assignments","10 Books","10 Notices","5 Upcoming Events"],cred:[["admin","admin123"],["lecturer","lecturer123"],["student","student123"]],img:"university campus, students studying, library, graduation, classroom"},
hospital:{en:"Hospital",ta:"மருத்துவமனை",e:"🏥",label:"hospital management system",kw:"hospital clinic medical health doctor patient pharmacy nurse care",
 roles:{ADMIN:["Dashboard","Patients","Doctors","Departments","Appointments","Wards & Beds","Pharmacy / Medicines","Lab Tests","Billing (simulation)","Staff","Reports","Notices","Settings"],DOCTOR:["Dashboard","My Appointments","My Patients","Prescriptions","Lab Requests","Schedule","Profile"],PATIENT:["Dashboard","My Profile","Book Appointment","My Prescriptions","Lab Reports","Bills","Notices","Profile Settings"]},
 data:["20 Patients","8 Doctors","6 Departments","15 Appointments","12 Medicines","10 Lab Tests","10 Bills","5 Notices"],cred:[["admin","admin123"],["doctor","doctor123"],["patient","patient123"]],img:"modern hospital, doctors, medical equipment, nurse, pharmacy"},
shop:{en:"Shop",ta:"கடை",e:"🛍️",label:"e-commerce store",kw:"shop store ecommerce commerce cart product market sale fashion shoe retail grocery supermarket",
 roles:{ADMIN:["Dashboard","Products","Categories","Orders","Customers","Inventory","Coupons","Payments (simulation)","Reviews","Reports","Settings"],CUSTOMER:["Home","Product Listing + Filters","Product Details","Cart","Checkout (simulation)","My Orders","Wishlist","Profile"]},
 data:["24 Products with real photos","6 Categories","15 Customers","12 Orders","5 Coupons","10 Reviews"],cred:[["admin","admin123"],["customer","customer123"]],img:"product photography, lifestyle shopping, packaging, storefront"},
library:{en:"Library",ta:"நூலகம்",e:"📚",label:"library management system",kw:"library book librarian reading",
 roles:{LIBRARIAN:["Dashboard","Books","Categories","Members","Issue / Return","Fines","Reservations","Reports","Settings"],MEMBER:["Dashboard","Search Books","My Borrowed Books","Reservations","Fines","Profile"]},
 data:["30 Books with cover photos","6 Categories","15 Members","12 Issued records","5 Fines","5 Notices"],cred:[["librarian","lib123"],["member","member123"]],img:"library shelves, open books, reading room, book covers"},
hotel:{en:"Hotel",ta:"ஹோட்டல்",e:"🏨",label:"hotel booking system",kw:"hotel resort booking room reservation guest travel tour lodge hostel",
 roles:{ADMIN:["Dashboard","Rooms","Bookings","Guests","Housekeeping","Payments (simulation)","Staff","Reports","Settings"],GUEST:["Home","Browse Rooms","Book Room","My Bookings","Offers","Profile"]},
 data:["15 Rooms with photos","20 Guests","15 Bookings","8 Staff","5 Offers"],cred:[["admin","admin123"],["guest","guest123"]],img:"luxury hotel room, resort pool, lobby, restaurant, beach"},
restaurant:{en:"Restaurant",ta:"உணவகம்",e:"🍽️",label:"restaurant management system",kw:"restaurant food cafe menu kitchen delivery canteen bakery",
 roles:{ADMIN:["Dashboard","Menu Items","Categories","Orders","Tables","Reservations","Staff","Inventory","Reports","Settings"],CUSTOMER:["Home","Menu","Cart","Reserve Table","My Orders","Profile"]},
 data:["25 Menu items with food photos","6 Categories","10 Tables","15 Orders","8 Staff"],cred:[["admin","admin123"],["customer","customer123"]],img:"plated food, restaurant interior, chefs, ingredients"},
gym:{en:"Gym",ta:"உடற்பயிற்சி",e:"🏋️",label:"gym management system",kw:"gym fitness trainer workout membership yoga",
 roles:{ADMIN:["Dashboard","Members","Trainers","Memberships & Plans","Attendance","Payments (simulation)","Equipment","Reports","Settings"],TRAINER:["Dashboard","My Members","Workout Plans","Schedule","Profile"],MEMBER:["Dashboard","My Plan","Workout Plans","Attendance","Payments","Profile"]},
 data:["25 Members","6 Trainers","4 Plans","10 Equipment","8 Workout plans"],cred:[["admin","admin123"],["trainer","trainer123"],["member","member123"]],img:"gym equipment, workout, trainers, yoga studio"},
inventory:{en:"Inventory",ta:"இருப்பு",e:"📦",label:"inventory management system",kw:"inventory stock warehouse supplier purchase asset",
 roles:{ADMIN:["Dashboard","Products","Categories","Suppliers","Purchase Orders","Sales","Stock Alerts","Reports","Settings"],STAFF:["Dashboard","Products","Stock In/Out","Orders","Profile"]},
 data:["30 Products","6 Categories","8 Suppliers","12 Purchase orders","15 Sales"],cred:[["admin","admin123"],["staff","staff123"]],img:"warehouse, packages, shelves, logistics"},
generic:{en:"Other",ta:"மற்றவை",e:"✨",generic:true,label:"management system",kw:"",
 roles:{ADMIN:["Dashboard","Main records (Add/Edit/Delete/Search)","Categories","Users","Reports","Notices","Settings"],USER:["Dashboard","My Profile","My Records","Notices","Profile Settings"]},
 data:["20 main records","5 categories","10 users","10 notices"],cred:[["admin","admin123"],["user","user123"]],img:"photography that matches the project topic"}
};
const TYPE_KEYS=Object.keys(G);
const sing=w=>w.replace(/s$/,"");
TYPE_KEYS.forEach(k=>G[k].kwSet=new Set(G[k].kw.split(" ").filter(Boolean).map(sing)));

const COLORS=[
 {id:"violet",en:"Violet",ta:"ஊதா",hex:"#6C4DFF"},{id:"blue",en:"Blue",ta:"நீலம்",hex:"#2563EB"},
 {id:"emerald",en:"Emerald",ta:"பச்சை",hex:"#059669"},{id:"orange",en:"Orange",ta:"ஆரஞ்சு",hex:"#EA580C"},
 {id:"rose",en:"Rose",ta:"ரோஸ்",hex:"#E11D48"},{id:"teal",en:"Teal",ta:"டீல்",hex:"#0D9488"}];
const OPTS=[
 {k:"img",en:"Real photos (with safe fallback)",ta:"உண்மையான படங்கள் (பாதுகாப்பு fallback உடன்)"},
 {k:"dark",en:"Dark / Light mode toggle",ta:"இருள் / ஒளி முறை மாற்றி"},
 {k:"anim",en:"Smooth animations",ta:"மென்மையான அனிமேஷன்கள்"},
 {k:"chart",en:"Charts (Chart.js)",ta:"வரைபடங்கள் (Chart.js)"},
 {k:"csv",en:"CSV export + print reports",ta:"CSV ஏற்றுமதி + அச்சு அறிக்கைகள்"},
 {k:"notes",en:"Beginner-friendly code comments",ta:"தொடக்கநிலையாளர்களுக்கான code குறிப்புகள்"},
 {k:"zip",en:"Final ZIP download",ta:"இறுதி ZIP பதிவிறக்கம்"}];
const EXAMPLES=["Smart Hospital Management System","Online Book Store","Gym Membership Manager","Hotel Room Booking System","Restaurant Order System"];
const DEF={name:"Smart College Management System",type:"college",locked:false,stack:"front",color:"violet",opts:{img:true,dark:true,anim:true,chart:true,csv:true,notes:true,zip:true},extra:""};

/* ---------- State (saved in localStorage, validated on load) ---------- */
const clone=o=>JSON.parse(JSON.stringify(o));
function restore(){
  const s=clone(DEF);
  try{
    const r=JSON.parse(localStorage.getItem(KEY));
    if(r&&typeof r==="object"){
      if(typeof r.name==="string")s.name=r.name.slice(0,80);
      if(G[r.type])s.type=r.type;
      s.locked=r.locked===true;
      if(r.stack==="php"||r.stack==="front")s.stack=r.stack;
      if(COLORS.some(c=>c.id===r.color))s.color=r.color;
      if(r.opts&&typeof r.opts==="object")OPTS.forEach(o=>{if(typeof r.opts[o.k]==="boolean")s.opts[o.k]=r.opts[o.k]});
      if(typeof r.extra==="string")s.extra=r.extra.slice(0,1500);
    }
  }catch(e){}
  return s;
}
let S=restore(),touched=false,saveTimer=0;
function persist(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}},250)}

/* ---------- Helpers ---------- */
const cleanName=n=>n.replace(/[\u0000-\u001f]/g," ").replace(/["\u201c\u201d]/g,"'").replace(/\s+/g," ").trim().slice(0,80);
const validName=n=>cleanName(n).length>=3;
const slugOf=n=>cleanName(n).replace(/[^A-Za-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"my-project";
const fileOf=r=>r.toLowerCase().replace(/[^a-z0-9]+/g,"-");
function detect(name){
  const words=(name.toLowerCase().match(/[a-z0-9]+/g)||[]).map(sing);
  let best="generic",top=0;
  TYPE_KEYS.forEach(k=>{if(k==="generic")return;let sc=0;words.forEach(w=>{if(G[k].kwSet.has(w))sc++});if(sc>top){top=sc;best=k}});
  return best;
}

/* ---------- Prompt builder ---------- */
function build(s){
  const name=cleanName(s.name);if(name.length<3)return "";
  const g=G[s.type],front=s.stack==="front",o=s.opts,slug=slugOf(name);
  const col=COLORS.find(c=>c.id===s.color)||COLORS[0];
  const roles=Object.keys(g.roles),extra=s.extra.trim();
  let n=0;const H=t=>"# "+(++n)+". "+t;const L=[];
  const add=(...a)=>a.forEach(x=>L.push(x));

  add("# ROLE","Act as a Senior Full-Stack Developer, UI/UX Designer and QA Engineer.",`Build a complete, modern, professional "${name}" project that works with ZERO errors.`,"");

  add(H("PROJECT OVERVIEW"),`"${name}" is a ${g.label} with separate dashboards for: ${roles.join(", ")}.`,
   front?"This is a FRONTEND-ONLY project.":"This is a full-stack PHP + MySQL project.",
   g.generic?`First understand what "${name}" means in the real world, then design domain-specific modules, entities, form fields, labels and realistic sample data for it. Never use vague words like "records" or "items" in the interface.`
            :`Adapt the modules, labels and sample data below to the exact project name "${name}".`,"");

  add(H("TECHNOLOGY RULES"));
  if(front)add("* Use ONLY HTML5, CSS3 and Vanilla JavaScript. No build tools, no npm.",
   "* DO NOT USE: PHP, MySQL, Node.js, MongoDB, Firebase, React, Angular, Vue or any backend or database.",
   "* All data lives in JavaScript arrays/objects saved to browser localStorage.",
   "* The project must work by DOUBLE-CLICKING login.html (file://) AND on static hosting such as Vercel or Netlify. Use relative paths only.",
   "* Load scripts with plain <script src=\"...\"> tags in the correct order (shared files first). Do NOT use ES modules (type=\"module\", import/export) and do NOT fetch() local files: both fail on file://.",
   "* Allowed CDN libraries only: Font Awesome 6 (https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css), Google Fonts"+(o.chart?", Chart.js 4 (https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js)":"")+".");
  else add("* Use PHP 8 (PDO), MySQL, HTML5, CSS3 and Vanilla JavaScript. It must run on XAMPP at http://localhost/"+slug+".",
   "* Provide database.sql (CREATE DATABASE IF NOT EXISTS, tables with foreign keys, sample data) and config/db.php (host localhost, user root, empty password, easy to edit).",
   "* Use PDO prepared statements for every query, password_hash()/password_verify(), session_start() with a role check on every page, CSRF tokens on all forms, server-side validation and htmlspecialchars() on all output.",
   "* DO NOT USE: React, Angular, Vue, Node.js, MongoDB, Firebase, Composer packages.",
   "* Use a BASE_URL constant or relative paths so links work from every sub-folder.");
  add("");

  add(H("DESIGN REQUIREMENTS"),
   "Premium, modern SaaS-style dashboard, like a professional ERP / admin panel.",
   `Primary colour: ${col.en} (${col.hex}) with matching gradients, deep navy sidebar, soft shadows, rounded cards, clean typography (Inter or Poppins).`,
   `Layout: collapsible sidebar, top bar (global search, notifications, profile menu, ${o.dark?"dark/light toggle, ":""}current date and time), responsive grid, interactive tables, modal dialogs, dropdowns, toast notifications, attractive empty states, Font Awesome icons${o.chart?", Chart.js charts":""}.`,
   "Fully responsive on desktop, laptop, tablet and 360px mobile (sidebar becomes a slide-in drawer; wide tables scroll horizontally inside their own container).","");

  if(o.img)add(H("REAL IMAGES"),
   "Use REAL high-quality photos, not grey boxes. Use direct Unsplash URLs (https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=1200&q=80) ONLY for photos you are sure exist. Use them for the login background, dashboard banners, module headers and avatars (https://i.pravatar.cc/150?img=N).",
   "Image themes: "+g.img+".",
   "Every <img> needs meaningful alt text, loading=\"lazy\", width/height attributes and onerror=\"this.onerror=null;this.src='assets/images/placeholder.svg'\". Create assets/images/placeholder.svg (a clean gradient placeholder) so nothing ever looks broken offline.","");

  if(o.anim)add(H("ANIMATIONS"),
   "Add tasteful, smooth animations using only transform and opacity (60fps): page fade-in, staggered card entrance, count-up numbers on stat cards, animated chart drawing, smooth sidebar collapse, modal scale-in/out, toast slide-in, button hover/press feedback, row hover highlight, skeleton loaders while data renders, and an animated login card with gentle floating background shapes.",
   "Wrap motion in @media (prefers-reduced-motion: reduce) so it switches off for users who prefer it.","");

  if(o.dark)add(H("DARK / LIGHT MODE"),
   "Add a Dark / Light toggle button (sun/moon icon) on the login page and in every top bar. Implement it with CSS variables on :root and [data-theme=\"dark\"]. Default to the system preference (prefers-color-scheme), remember the choice in localStorage, and apply it with a tiny inline script in <head> before first paint so there is no white flash.",
   "Charts, tables, modals, inputs and toasts must all have good contrast in BOTH themes.","");

  add(H("USER ROLES AND MODULES"));
  roles.forEach((r,i)=>{add("## "+String.fromCharCode(65+i)+". "+r+" DASHBOARD");g.roles[r].forEach((m,j)=>add((j+1)+". "+m));add("")});

  add(H("LOGIN SYSTEM"),
   "Attractive login page: logo (assets/images/logo.svg), system name, username, password with show/hide, remember me, login button, forgot-password UI and inline validation messages (no alert()).",
   "Demo credentials:");
  roles.forEach((r,i)=>{const c=g.cred[i]||["user","user123"];add(r+": "+c[0]+" / "+c[1])});
  add("Redirect each role to its own dashboard. Every dashboard must check the stored session and send the visitor back to login.html when not logged in or when the role does not match. Add logout."+(front?" This is a DEMO login, NOT secure authentication; say so clearly in the README.":""),"");

  add(H("DASHBOARD OVERVIEW"),
   "Statistic cards for the main entities, "+(o.chart?"4 interactive charts (trends, distribution, performance, activity), ":"")+"recent activities, upcoming items and latest notices.","");

  add(H("FUNCTIONALITY"),
   "Every module must have working Add / Edit / Delete / View / Search / Filter / Sort / Pagination, with form validation, a confirm-before-delete modal and success/error toasts.",
   "Role-specific modules must stay consistent with the shared data (a record added by the admin is visible to the other roles).");
  if(front)add("Each role has ONE dashboard page (for example "+fileOf(roles[0])+".html) whose sidebar switches between module views with JavaScript (no page reloads), so no navigation link can ever be broken.");
  add("");

  add(H("DATA MANAGEMENT"));
  if(front)add("Keep everything in localStorage under one namespaced key (for example \""+slug+"-data\"). Seed realistic sample data on first load only, when storage is empty. Wrap every storage read/write in try/catch and fall back to the seed data if the stored JSON is corrupted. Include a \"Reset Demo Data\" button.");
  else add("Use MySQL tables with relations and foreign keys. Include database.sql with sample data.");
  add("Realistic fictional sample data (no real people):");g.data.forEach(d=>add("* "+d));add("");

  const feats=["Sidebar collapse + responsive mobile drawer","Global search UI, profile dropdown, notification dropdown","Current date and time","Form validation, loading states, toast notifications, confirmation dialogs"];
  if(o.dark)feats.push("Dark / Light mode (remembered)");if(o.csv)feats.push("Export any table to CSV","Print-friendly reports");
  add(H("ADDITIONAL FEATURES"));feats.forEach(f=>add("* "+f));add("");

  add(H("FOLDER STRUCTURE"));
  if(front)add(slug+"/","├── index.html            (redirects to login.html)","├── login.html",...roles.map(r=>"├── "+fileOf(r)+".html"),
   "├── css/ (style.css, dashboard.css, responsive.css, login.css)",
   "├── js/ (storage.js, auth.js, components.js, app.js, "+roles.map(r=>fileOf(r)+".js").join(", ")+(o.chart?", charts.js":"")+")",
   "├── assets/ (images/placeholder.svg, images/logo.svg, icons/)","└── README.md");
  else add(slug+"/","├── index.php, login.php, logout.php","├── config/db.php","├── database.sql","├── includes/ (header.php, sidebar.php, footer.php, auth.php, functions.php)",
   ...roles.map(r=>"├── "+fileOf(r)+"/ (dashboard.php + one page per module)"),
   "├── css/ (style.css, dashboard.css, responsive.css)","├── js/ (app.js, components.js"+(o.chart?", charts.js":"")+")","├── assets/ (images/, icons/)","└── README.md");
  add("");

  add(H("RULES"),
   "* Every button, link, form and navigation item must work. No dead links, no empty modules, no \"coming soon\" or placeholder functionality.",
   "* ZERO errors in the browser console on every page: no undefined variables or functions, and every ID/class used in JavaScript must exist in the HTML.",
   "* Reusable functions, clean code, no duplicate code, consistent naming.",
   "* Never use alert(), confirm() or prompt(); use custom toasts and modals.",
   "* Consistent UI and spacing across all dashboards.",
   "* Do not add unnecessarily complex features. Working and reliable beats fancy.");
  if(o.notes)add("* Add short, beginner-friendly comments above every function explaining what it does in simple English.");
  add("");

  const chk=["every file referenced by any <script>, <link>, <img> or href exists at that exact path","script order has no dependency errors","login works for every demo account and lands on the right dashboard","Add / Edit / Delete / Search work in every module and survive a page refresh","the layout is fine at 360px, 768px and 1366px wide"];
  if(o.dark)chk.push("dark and light mode both look correct");chk.push("the browser console shows no errors");
  add(H("QUALITY CHECK (do this before delivering)"),"Re-read your own code and verify that: "+chk.map((c,i)=>"("+(i+1)+") "+c).join("; ")+".","Fix every problem you find BEFORE delivering, then list what you verified.","");

  add(H("README.md"),"Include: introduction, technologies, features, folder structure, how to run"+(front?" (double-click login.html, or drag the folder onto Vercel/Netlify to host it)":" (XAMPP + import database.sql)")+", demo credentials, "+(front?"how localStorage works, ":"")+"your assumptions, limitations"+(front?" (frontend-only demo, not for real production use without a secure backend and database)":"")+".","");

  if(extra)add(H("EXTRA REQUIREMENTS"),extra,"");

  add("# FINAL DELIVERY","I need the COMPLETE WORKING PROJECT, not snippets, not a summary and not just a homepage.",
   "Do not ask me questions: make sensible assumptions and write them in the README.",
   "Create every HTML"+(front?"":"/PHP")+", CSS and JS file, implement all dashboards and modules, then run the quality check and fix any errors.",
   o.zip?"Package everything into one downloadable ZIP named "+slug+".zip. If you cannot create a ZIP, create all files in the exact folder structure and present each one for download.":"Present every file for download in the exact folder structure.",
   "If the output is very long, build in this order without stopping early: shared files, login, main/admin dashboard, other roles, README. If you hit a length limit, stop at a clean file boundary and tell me exactly which files remain so I can reply \"continue\".",
   "Start building the complete project now.");
  return L.join("\n");
}

/* ---------- UI rendering ---------- */
let text="",toastTimer=0;
function toast(m){const t=$("toast");t.textContent=m;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200)}

function renderTypes(){
  const box=$("s-types");box.textContent="";
  TYPE_KEYS.forEach(k=>{
    const b=document.createElement("button");b.type="button";b.dataset.k=k;
    const on=S.type===k;b.className="type"+(on?" on":"")+(on&&!S.locked?" auto":"");b.setAttribute("aria-pressed",on);
    const e=document.createElement("span");e.className="emo";e.textContent=G[k].e;e.setAttribute("aria-hidden","true");
    const l=document.createElement("span");l.textContent=isTa()?G[k].ta:G[k].en;
    b.append(e,l);box.appendChild(b);
  });
  $("s-auto").hidden=!S.locked;
}
function renderColors(){
  const box=$("s-colors");box.textContent="";
  COLORS.forEach(c=>{
    const lab=document.createElement("label");lab.className="swatch";lab.title=isTa()?c.ta:c.en;
    const inp=document.createElement("input");inp.type="radio";inp.name="s-color";inp.value=c.id;inp.checked=S.color===c.id;
    const dot=document.createElement("span");dot.className="dot";dot.style.background=c.hex;
    const nm=document.createElement("span");nm.className="sw-name";nm.textContent=isTa()?c.ta:c.en;
    lab.append(inp,dot,nm);box.appendChild(lab);
  });
}
function renderOpts(){
  const box=$("s-opts");box.textContent="";
  OPTS.forEach(o=>{
    const lab=document.createElement("label");lab.className="sw";
    const inp=document.createElement("input");inp.type="checkbox";inp.dataset.k=o.k;inp.checked=!!S.opts[o.k];
    const tr=document.createElement("span");tr.className="track";tr.setAttribute("aria-hidden","true");
    const tx=document.createElement("span");tx.className="txt";tx.textContent=isTa()?o.ta:o.en;
    lab.append(inp,tr,tx);box.appendChild(lab);
  });
}
function renderExamples(){
  const box=$("s-examples");box.textContent="";
  EXAMPLES.forEach(x=>{const b=document.createElement("button");b.type="button";b.className="exchip";b.textContent=x;b.onclick=()=>{S.name=x;S.locked=false;touched=true;$("s-name").value=x;$("s-name").focus();update()};box.appendChild(b)});
}
function renderStack(){document.querySelectorAll("#s-stack button").forEach(b=>{const on=b.dataset.v===S.stack;b.classList.toggle("on",on);b.setAttribute("aria-pressed",on)})}

function nameMsg(){
  const m=$("s-name-msg"),ok=validName(S.name);m.classList.toggle("err",!ok&&touched);$("s-name").setAttribute("aria-invalid",!ok&&touched);
  if(!ok){m.textContent=touched?T("Please enter a project name (at least 3 characters).","திட்டப் பெயரை உள்ளிடுங்கள் (குறைந்தது 3 எழுத்துகள்)."):T("Type your project name. The type is detected from your words.","உங்கள் திட்டப் பெயரை உள்ளிடுங்கள். சொற்களைக் கொண்டு வகை தானாகக் கண்டறியப்படும்.");return}
  const tl=isTa()?G[S.type].ta:G[S.type].en;
  if(S.locked)m.textContent=T("Type chosen by you: ","நீங்கள் தேர்ந்தெடுத்த வகை: ")+tl;
  else if(S.type==="generic")m.textContent=T("No exact match, so “Other” is used. You can pick a type below.","சரியான பொருத்தம் இல்லை, எனவே “மற்றவை” பயன்படுத்தப்படுகிறது. கீழே வகையைத் தேர்ந்தெடுக்கலாம்.");
  else m.textContent=T("Detected type: ","கண்டறிந்த வகை: ")+tl;
}
function readiness(){
  const ok=validName(S.name);let p=0;
  if(ok)p+=40;p+=15;p+=10;p+=Math.min(OPTS.filter(o=>S.opts[o.k]).length,5)*3;if(S.extra.trim().length>=20)p+=20;
  if(!ok)p=Math.min(p,25);
  const hint=!ok?T("Enter a project name to begin.","தொடங்க திட்டப் பெயரை உள்ளிடுங்கள்.")
    :S.extra.trim().length<20?T("Tip: paste ChatGPT’s feature list into “Extra ideas” for an even stronger prompt.","குறிப்பு: இன்னும் வலுவான prompt-க்கு “கூடுதல் யோசனைகள்” பகுதியில் ChatGPT தந்த அம்சப் பட்டியலைச் சேர்க்கவும்.")
    :T("Great! Your prompt is ready to paste into Claude.","அருமை! உங்கள் prompt Claude-இல் ஒட்டத் தயார்.");
  $("s-ready-pct").textContent=p+"%";$("s-ready-bar").style.width=p+"%";$("s-ready-hint").textContent=hint;
}
function update(){
  if(!S.locked)S.type=detect(S.name);
  renderTypes();renderStack();nameMsg();
  text=build(S);const out=$("s-out"),ok=text!=="";
  out.classList.toggle("empty",!ok);
  out.textContent=ok?text:T("Your prompt will appear here as soon as you enter a project name.","திட்டப் பெயரை உள்ளிட்டவுடன் உங்கள் prompt இங்கே தோன்றும்.");
  $("s-copy").disabled=!ok;$("s-dl").disabled=!ok;
  const col=COLORS.find(c=>c.id===S.color)||COLORS[0];
  $("s-tag").textContent=(isTa()?G[S.type].ta:G[S.type].en)+" · "+(S.stack==="front"?"Frontend":"PHP + MySQL")+" · "+(isTa()?col.ta:col.en);
  const words=ok?text.split(/\s+/).length:0;
  $("s-stats").textContent=ok?words.toLocaleString()+" "+T("words","சொற்கள்")+" · "+text.length.toLocaleString()+" "+T("characters","எழுத்துகள்"):"";
  $("s-extra-count").textContent=S.extra.length;
  readiness();persist();
}

/* ---------- Actions ---------- */
async function copyText(){
  if(!text)return false;
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true}}catch(e){}
  const a=document.createElement("textarea");a.value=text;a.setAttribute("readonly","");a.style.cssText="position:fixed;opacity:0;top:0";document.body.appendChild(a);a.select();
  let ok=false;try{ok=document.execCommand("copy")}catch(e){}a.remove();return ok;
}
function flash(){const p=document.querySelector(".out-panel");p.classList.remove("flash");void p.offsetWidth;p.classList.add("flash")}

function wire(){
  const nm=$("s-name");nm.value=S.name;$("s-extra").value=S.extra;
  nm.addEventListener("input",()=>{S.name=nm.value;touched=true;update()});
  $("s-extra").addEventListener("input",e=>{S.extra=e.target.value.slice(0,1500);update()});
  $("s-types").addEventListener("click",e=>{const b=e.target.closest("button[data-k]");if(!b)return;S.type=b.dataset.k;S.locked=true;update()});
  $("s-auto").addEventListener("click",()=>{S.locked=false;update()});
  $("s-stack").addEventListener("click",e=>{const b=e.target.closest("button[data-v]");if(!b)return;S.stack=b.dataset.v;update()});
  $("s-colors").addEventListener("change",e=>{if(e.target.name==="s-color"){S.color=e.target.value;update()}});
  $("s-opts").addEventListener("change",e=>{const k=e.target.dataset.k;if(k){S.opts[k]=e.target.checked;update()}});
  $("sform").addEventListener("submit",e=>e.preventDefault());

  $("s-gen").addEventListener("click",()=>{
    touched=true;
    if(!validName(S.name)){update();nm.focus();nm.classList.remove("shake");void nm.offsetWidth;nm.classList.add("shake");toast(T("Please enter a project name first.","முதலில் திட்டப் பெயரை உள்ளிடுங்கள்."));return}
    const b=$("s-gen");b.disabled=true;b.classList.add("loading");
    setTimeout(()=>{
      update();flash();b.disabled=false;b.classList.remove("loading");
      $("s-out").scrollTop=0;
      if(innerWidth<=960)document.querySelector(".out-panel").scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});
      toast(T("Prompt ready ✨","Prompt தயார் ✨"));
    },reduced?0:550);
  });

  $("s-reset").addEventListener("click",()=>{
    S=clone(DEF);touched=false;nm.value=S.name;$("s-extra").value="";
    renderColors();renderOpts();update();toast(T("Reset to defaults","இயல்புநிலைக்கு மீட்டமைக்கப்பட்டது"));
  });

  $("s-copy").addEventListener("click",async()=>{
    const ok=await copyText(),lab=$("s-copy-txt");
    if(ok){lab.textContent="✔ "+T("Copied!","நகலெடுக்கப்பட்டது!");$("s-copy").classList.add("ok");toast(T("Copied! Now paste it into Claude.","நகலெடுக்கப்பட்டது! இப்போது Claude-இல் ஒட்டுங்கள்."));
      setTimeout(()=>{$("s-copy").classList.remove("ok");lab.textContent=T("Copy prompt","Prompt நகலெடு")},2000)}
    else{const r=document.createRange();r.selectNodeContents($("s-out"));const s=getSelection();s.removeAllRanges();s.addRange(r);toast(T("Press Ctrl+C to copy the selected text.","தேர்ந்தெடுத்த உரையை நகலெடுக்க Ctrl+C அழுத்துங்கள்."))}
  });

  $("s-dl").addEventListener("click",()=>{
    if(!text)return;
    const url=URL.createObjectURL(new Blob([text],{type:"text/plain;charset=utf-8"})),a=document.createElement("a");
    a.href=url;a.download=slugOf(S.name)+"-prompt.txt";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
    toast(T("Download started","பதிவிறக்கம் தொடங்கியது"));
  });

  document.addEventListener("langchange",()=>{
    const ph=$("s-extra");ph.placeholder=isTa()?ph.dataset.phTa:ph.dataset.phEn;
    renderColors();renderOpts();renderExamples();update();
    const lab=$("s-copy-txt");if(!$("s-copy").classList.contains("ok"))lab.textContent=T("Copy prompt","Prompt நகலெடு");
  });
}

wire();renderColors();renderOpts();renderExamples();
$("s-extra").placeholder=isTa()?$("s-extra").dataset.phTa:$("s-extra").dataset.phEn;
update();
})();

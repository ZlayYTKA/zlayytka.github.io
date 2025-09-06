(() => {
  const PROJECTS = window.PROJECTS || {"Проект":[]};
  const PROJ_KEYS = Object.keys(PROJECTS);
  const $ = (sel, el=document) => el.querySelector(sel);

  // THEME
  const THEME_KEY = "plan_theme";
  const themeBtn = document.createElement('button');
  themeBtn.className = 'iconbtn';
  themeBtn.title = 'Сменить тему';
  themeBtn.innerHTML = '🌓';
  function setTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
  }
  const savedTheme = localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light':'dark');
  setTheme(savedTheme);
  themeBtn.addEventListener('click', ()=> setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));
  $('#themeMount').appendChild(themeBtn);

  // DRAWER
  const drawer = $('#drawer');
  const backdrop = $('#drawerBackdrop');
  function openDrawer(){ drawer.classList.add('open'); backdrop.classList.add('show'); drawer.setAttribute('aria-hidden','false'); }
  function closeDrawer(){ drawer.classList.remove('open'); backdrop.classList.remove('show'); drawer.setAttribute('aria-hidden','true'); }
  $('#drawerBtn').addEventListener('click', openDrawer);
  $('#drawerClose').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // STATUS STORAGE (global across all projects)
  const STORAGE_KEY = "plan_v2_statuses";
  function flattenTasks(){
    const flat = [];
    for (const key of PROJ_KEYS){
      const arr = PROJECTS[key] || [];
      for (let i=0;i<arr.length;i++){
        flat.push({proj:key, index:i});
      }
    }
    return flat;
  }
  const FLAT = flattenTasks();
  function loadStatuses(){
    try { 
      const raw = localStorage.getItem(STORAGE_KEY) || "[]";
      const arr = JSON.parse(raw);
      if (arr.length !== FLAT.length) return new Array(FLAT.length).fill(0);
      return arr;
    } catch(e){ return new Array(FLAT.length).fill(0); }
  }
  function saveStatuses(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }

  // TOKEN ENCODING V2 (covers all projects)
  function base64urlFromBytes(bytes){
    let bin = '';
    for (let i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function bytesFromBase64url(s){
    s = s.replace(/-/g,'+').replace(/_/g,'/');
    while (s.length % 4) s += '=';
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  function encodeToken(statuses){
    const n = statuses.length;
    const byteCount = Math.ceil(n/8);
    const arr = new Uint8Array(2 + byteCount + 1);
    arr[0] = n & 0xFF; arr[1] = (n>>8) & 0xFF;
    for (let i=0;i<n;i++){
      if (statuses[i] === 1){
        const b = 2 + (i>>3);
        arr[b] |= (1 << (i % 8));
      }
    }
    let sum = 0; for (let i=0;i<arr.length-1;i++) sum = (sum + arr[i]) & 0xFF;
    arr[arr.length-1] = sum;
    return "V2-" + base64urlFromBytes(arr);
  }
  function decodeToken(token){
    if (!token || !token.startsWith("V2-")) throw new Error("Неверный формат токена");
    const body = token.slice(3);
    const arr = bytesFromBase64url(body);
    if (arr.length < 3) throw new Error("Токен повреждён");
    let sum = 0; for (let i=0;i<arr.length-1;i++) sum = (sum + arr[i]) & 0xFF;
    if (sum !== arr[arr.length-1]) throw new Error("Контрольная сумма не совпала");
    const n = arr[0] | (arr[1]<<8);
    const byteCount = Math.ceil(n/8);
    if (2 + byteCount + 1 !== arr.length) throw new Error("Неверная длина токена");
    const m = Math.min(n, FLAT.length);
    const out = new Array(FLAT.length).fill(0);
    for (let i=0;i<m;i++){
      const b = 2 + (i>>3);
      const bit = (arr[b] >> (i % 8)) & 1;
      out[i] = bit;
    }
    return out;
  }

  // Tabs
  const tabs = $('#tabs');
  let currentProj = PROJ_KEYS[0] || "";
  function renderTabs(){
    tabs.innerHTML = '';
    PROJ_KEYS.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'tab' + (k===currentProj?' active':'');
      btn.textContent = k;
      btn.addEventListener('click', ()=>{ currentProj = k; renderAll(); });
      tabs.appendChild(btn);
    });
  }

  // Per-project view helpers
  const elApp = $('#app');
  const elProjName = $('#projName');
  const elWeekFilter = $('#weekFilter');
  const elEpicFilter = $('#epicFilter');
  const elSearch = $('#q');
  const elReset = $('#reset');

  function projectOffsets(){
    const offsets = {};
    let acc = 0;
    for (const key of PROJ_KEYS){
      const len = (PROJECTS[key]||[]).length;
      offsets[key] = {offset: acc, length: len};
      acc += len;
    }
    return offsets;
  }
  const OFFSETS = projectOffsets();

  let STATUSES = loadStatuses();

  function computeStats(list, projKey){
    const {offset} = OFFSETS[projKey];
    const all = list.length;
    let done = 0;
    for (const t of list){
      const idx = offset + t.__index;
      if (STATUSES[idx]===1) done++;
    }
    const pct = all ? Math.round(done / all * 100) : 0;
    return {all, done, pct};
  }

  function groupByWeek(list){
    const map = new Map();
    list.forEach(t=>{
      const w = t.week;
      if (!map.has(w)) map.set(w, []);
      map.get(w).push(t);
    });
    return map;
  }

  function renderProject(){
    const TASKS = (PROJECTS[currentProj]||[]).map((t,i)=>({...t,__index:i}));
    elProjName.textContent = currentProj;
    const q = (elSearch.value || '').toLowerCase().trim();
    const selW = elWeekFilter.value;
    const selE = elEpicFilter.value;
    let list = TASKS.slice();
    if (selW !== 'all') list = list.filter(t => String(t.week) === selW);
    if (selE !== 'all') list = list.filter(t => t.epic === selE);
    if (q) list = list.filter(t => (t.title + t.description + t.epic).toLowerCase().includes(q));

    const stAll = computeStats(list, currentProj);
    $('#kAll').textContent = stAll.all;
    $('#kDone').textContent = stAll.done;
    $('#kPct').textContent = stAll.pct + '%';

    elApp.innerHTML = '';
    const grp = groupByWeek(list);
    for (const [week, arr] of grp.entries()) {
      const wrap = document.createElement('section');
      wrap.className = 'week';
      const stW = computeStats(arr, currentProj);
      const head = document.createElement('header');
      head.innerHTML = `<h2>Неделя ${week}</h2>
        <div style="display:flex;align-items:center;gap:12px;min-width:280px">
          <span class="badge">Готово: ${stW.done}/${stW.all}</span>
          <div class="progress" style="flex:1"><div class="bar" style="width:${stW.pct}%;"></div></div>
        </div>`;
      wrap.appendChild(head);

      const {offset} = OFFSETS[currentProj];
      arr.forEach(t => {
        const idx = offset + t.__index;
        const s = STATUSES[idx]===1 ? 'Выполнено' : 'Не выполнено';
        const item = document.createElement('div');
        item.className = 'task';
        item.innerHTML = `
          <div class="summary">
            <div><span class="badge">День: ${t.day}</span></div>
            <div><strong>${t.title}</strong></div>
            <div><span class="badge">${t.epic}</span></div>
            <div class="status">
              <button class="btn ${s==='Выполнено'?'ok':''}" data-idx="${idx}" data-val="1">Выполнено</button>
              <button class="btn ${s==='Не выполнено'?'no':''}" data-idx="${idx}" data-val="0">Не выполнено</button>
            </div>
          </div>
          <div class="descr">${t.description.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</div>`;
        wrap.appendChild(item);
      });
      elApp.appendChild(wrap);
    }
  }

  function populateFilters(){
    const TASKS = PROJECTS[currentProj] || [];
    const weeks = Array.from(new Set(TASKS.map(t=>t.week))).sort((a,b)=>a-b);
    const epics = Array.from(new Set(TASKS.map(t=>t.epic))).sort();
    const wf = $('#weekFilter'); const ef = $('#epicFilter');
    wf.innerHTML = '<option value="all">Все недели</option>';
    ef.innerHTML = '<option value="all">Все эпики</option>';
    weeks.forEach(w=>{ const o=document.createElement('option'); o.value=String(w); o.textContent='Неделя '+w; wf.appendChild(o); });
    epics.forEach(e=>{ const o=document.createElement('option'); o.value=e; o.textContent=e; ef.appendChild(o); });
  }

  function renderAll(){
    renderTabs();
    populateFilters();
    renderProject();
    closeDrawer();
  }

  // Listeners
  $('#app').addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-idx]');
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx,10);
    const val = parseInt(btn.dataset.val,10);
    STATUSES[idx] = val;
    localStorage.setItem("last_project", currentProj);
    localStorage.setItem("last_filters", JSON.stringify({w:$('#weekFilter').value,e:$('#epicFilter').value,q:$('#q').value}));
    saveStatuses(STATUSES);
    renderProject();
  });
  $('#reset').addEventListener('click', ()=>{
    if (!confirm('Сбросить статусы задач в текущем проекте?')) return;
    const {offset, length} = OFFSETS[currentProj];
    for (let i=0;i<length;i++) STATUSES[offset+i] = 0;
    saveStatuses(STATUSES);
    renderProject();
  });
  $('#q').addEventListener('input', renderProject);
  $('#weekFilter').addEventListener('change', renderProject);
  $('#epicFilter').addEventListener('change', renderProject);

  // Share panel: shared across all projects
  const genBtn = $('#gen');
  const codeOut = $('#codeOut');
  const applyBtn = $('#apply');
  const codeIn = $('#codeIn');
  const copyBtn = $('#copy');
  const linkOut = $('#linkOut');

  genBtn.addEventListener('click', ()=>{
    const token = encodeToken(STATUSES);
    codeOut.value = token;
    const url = location.origin + location.pathname + '#code=' + token;
    linkOut.value = url;
  });
  copyBtn.addEventListener('click', ()=>{
    const val = codeOut.value.trim();
    if (!val) return;
    navigator.clipboard.writeText(val);
    copyBtn.textContent = 'Скопировано ✔';
    setTimeout(()=> copyBtn.textContent = 'Копировать', 1200);
  });
  applyBtn.addEventListener('click', ()=>{
    const token = codeIn.value.trim();
    if (!token) return alert('Вставьте код');
    try{
      const s = decodeToken(token);
      STATUSES = s;
      saveStatuses(STATUSES);
      renderProject();
      alert('Код применён (все проекты)');
    }catch(err){
      alert('Ошибка: ' + err.message);
    }
  });

  // Auto-apply from URL hash
  function tryApplyFromHash(){
    const m = location.hash.match(/code=([A-Za-z0-9\-\_]+)/);
    if (m){
      try{
        const s = decodeToken(m[1]);
        STATUSES = s;
        saveStatuses(STATUSES);
        renderProject();
      }catch{}
    }
  }

  // Restore last project/filters
  const lastProj = localStorage.getItem("last_project");
  if (lastProj && PROJ_KEYS.includes(lastProj)) currentProj = lastProj;
  const lf = localStorage.getItem("last_filters");
  try{
    const o = JSON.parse(lf||"null");
    if (o){ $('#q').value=o.q||''; setTimeout(()=>{ $('#weekFilter').value=o.w||'all'; $('#epicFilter').value=o.e||'all'; },0); }
  }catch{}

  renderAll();
  tryApplyFromHash();
})();

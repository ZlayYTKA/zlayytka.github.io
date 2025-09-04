(() => {
    const TASKS = window.TASKS || [];
    const $ = (sel, el=document) => el.querySelector(sel);
    const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
  
    // THEME
    const THEME_KEY = "plan_theme";
    const themeBtn = document.createElement('button');
    themeBtn.className = 'btn iconbtn';
    themeBtn.title = 'Сменить тему';
    themeBtn.innerHTML = '🌓';
  
    function setTheme(t){
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem(THEME_KEY, t);
    }
    const savedTheme = localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light':'dark');
    setTheme(savedTheme);
    themeBtn.addEventListener('click', ()=> setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));
  
    // STATUS STORAGE
    const STORAGE_KEY = "plan_v1_statuses";
    function loadStatuses(){
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch(e){ return []; }
    }
    function saveStatuses(arr){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    }
  
    // TOKEN ENCODING (V1): [lenLo, lenHi, bits..., checksum] -> base64url
    function base64urlFromBytes(bytes){
      let bin = '';
      for (let i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
      let b64 = btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
      return b64;
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
      const n = TASKS.length;
      const byteCount = Math.ceil(n/8);
      const arr = new Uint8Array(2 + byteCount + 1);
      arr[0] = n & 0xFF;
      arr[1] = (n >> 8) & 0xFF;
      for (let i=0;i<n;i++){
        if (statuses[i] === 1){
          const b = 2 + (i>>3);
          arr[b] |= (1 << (i % 8));
        }
      }
      // checksum
      let sum = 0;
      for (let i=0;i<arr.length-1;i++) sum = (sum + arr[i]) & 0xFF;
      arr[arr.length-1] = sum;
      return "V1-" + base64urlFromBytes(arr);
    }
    function decodeToken(token){
      if (!token || !token.startsWith("V1-")) throw new Error("Неверный формат токена");
      const body = token.slice(3);
      const arr = bytesFromBase64url(body);
      if (arr.length < 3) throw new Error("Токен повреждён");
      // verify checksum
      let sum = 0;
      for (let i=0;i<arr.length-1;i++) sum = (sum + arr[i]) & 0xFF;
      if (sum !== arr[arr.length-1]) throw new Error("Контрольная сумма не совпала");
      const n = arr[0] | (arr[1]<<8);
      const byteCount = Math.ceil(n/8);
      if (2 + byteCount + 1 !== arr.length) throw new Error("Неверная длина токена");
      const statuses = new Array(TASKS.length).fill(0);
      const m = Math.min(n, TASKS.length);
      for (let i=0;i<m;i++){
        const b = 2 + (i>>3);
        const bit = (arr[b] >> (i % 8)) & 1;
        statuses[i] = bit;
      }
      return statuses;
    }
  
    // UI
    const elApp = $('#app');
    const elWeekFilter = $('#weekFilter');
    const elEpicFilter = $('#epicFilter');
    const elSearch = $('#q');
    const elReset = $('#reset');
    const elThemeMount = $('#themeMount');
    elThemeMount.appendChild(themeBtn);
  
    let statuses = loadStatuses();
    if (statuses.length !== TASKS.length) statuses = new Array(TASKS.length).fill(0);
  
    function computeStats(list){
      const all = list.length;
      const done = list.filter(t=>statuses[t.__index]===1).length;
      const pct = all ? Math.round(done / all * 100) : 0;
      return {all, done, pct};
    }
  
    function groupByWeek(list){
      const map = new Map();
      list.forEach((t,i)=>{
        const w = t.week;
        if (!map.has(w)) map.set(w, []);
        map.get(w).push({...t, __index: t.__index});
      });
      return map;
    }
  
    function render(){
      elApp.innerHTML = '';
      const q = (elSearch.value || '').toLowerCase().trim();
      const selW = elWeekFilter.value;
      const selE = elEpicFilter.value;
  
      let list = TASKS.map((t,i)=>({...t,__index:i}));
      if (selW !== 'all') list = list.filter(t => String(t.week) === selW);
      if (selE !== 'all') list = list.filter(t => t.epic === selE);
      if (q) list = list.filter(t => (t.title + t.description + t.epic).toLowerCase().includes(q));
  
      const {all, done, pct} = computeStats(list);
      $('#kAll').textContent = all;
      $('#kDone').textContent = done;
      $('#kPct').textContent = pct + '%';
  
      const grp = groupByWeek(list);
      for (const [week, arr] of grp.entries()) {
        const wrap = document.createElement('section');
        wrap.className = 'week';
        const st = computeStats(arr);
        const head = document.createElement('header');
        head.innerHTML = `<h2>Неделя ${week}</h2>
          <div style="display:flex;align-items:center;gap:12px;min-width:280px">
            <span class="badge">Готово: ${st.done}/${st.all}</span>
            <div class="progress" style="flex:1"><div class="bar" style="width:${st.pct}%;"></div></div>
          </div>`;
        wrap.appendChild(head);
  
        arr.forEach(t => {
          const item = document.createElement('div');
          item.className = 'task';
          const s = statuses[t.__index]===1 ? 'Выполнено' : 'Не выполнено';
          item.innerHTML = `
            <div class="summary">
              <div><span class="badge">День: ${t.day}</span></div>
              <div><strong>${t.title}</strong></div>
              <div><span class="chip">${t.epic}</span></div>
              <div class="status">
                <button class="btn ${s==='Выполнено'?'ok':''}" data-idx="${t.__index}" data-val="1">Выполнено</button>
                <button class="btn ${s==='Не выполнено'?'no':''}" data-idx="${t.__index}" data-val="0">Не выполнено</button>
              </div>
            </div>
            <div class="descr">${t.description.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</div>
          `;
          wrap.appendChild(item);
        });
        elApp.appendChild(wrap);
      }
    }
  
    function populateFilters(){
      const weeks = Array.from(new Set(TASKS.map(t=>t.week))).sort((a,b)=>a-b);
      weeks.forEach(w => {
        const opt = document.createElement('option');
        opt.value = String(w);
        opt.textContent = 'Неделя ' + w;
        elWeekFilter.appendChild(opt);
      });
      const epics = Array.from(new Set(TASKS.map(t=>t.epic))).sort();
      epics.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e;
        opt.textContent = e;
        elEpicFilter.appendChild(opt);
      });
    }
  
    // Listeners
    elApp.addEventListener('click', (e)=>{
      const btn = e.target.closest('button[data-idx]');
      if (!btn) return;
      const idx = parseInt(btn.dataset.idx,10);
      const val = parseInt(btn.dataset.val,10);
      statuses[idx] = val;
      saveStatuses(statuses);
      render();
    });
  
    elReset.addEventListener('click', ()=>{
      if (!confirm('Сбросить статусы всех задач?')) return;
      statuses = new Array(TASKS.length).fill(0);
      saveStatuses(statuses);
      render();
    });
  
    elSearch.addEventListener('input', render);
    elWeekFilter.addEventListener('change', render);
    elEpicFilter.addEventListener('change', render);
  
    // Share panel
    const genBtn = $('#gen');
    const codeOut = $('#codeOut');
    const applyBtn = $('#apply');
    const codeIn = $('#codeIn');
    const copyBtn = $('#copy');
    const linkOut = $('#linkOut');
  
    genBtn.addEventListener('click', ()=>{
      const token = encodeToken(statuses);
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
        statuses = s;
        saveStatuses(statuses);
        render();
        alert('Код применён');
      }catch(err){
        alert('Ошибка: ' + err.message);
      }
    });
  
    // Auto-apply from URL hash if present
    function tryApplyFromHash(){
      const m = location.hash.match(/code=([A-Za-z0-9\-\_]+)/);
      if (m){
        try{
          const s = decodeToken(m[1]);
          statuses = s;
          saveStatuses(statuses);
          render();
        }catch{}
      }
    }
  
    populateFilters();
    render();
    tryApplyFromHash();
  })();
  
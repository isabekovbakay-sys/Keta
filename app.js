(function(){
  const KEY='keta-fitness-v3';
  const defaults={completed:[],exerciseChecks:{},selectedWeek:1};
  const state=load();
  const today=new Date();
  const dayKeys=['sun','mon','tue','wed','thu','fri','sat'];
  const dayLabels=['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const monthLabels=['January','February','March','April','May','June','July','August','September','October','November','December'];

  function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...defaults}}}
  function save(){localStorage.setItem(KEY,JSON.stringify(state))}
  function pad(n){return String(n).padStart(2,'0')}
  function iso(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`}
  function todayKey(){return dayKeys[today.getDay()]}
  function isDone(ds){return state.completed.includes(ds)}
  function currentWeek(){return Math.min(4,Math.max(1,Number(state.selectedWeek)||1))}
  function workoutFor(dayKey,week=currentWeek()){return KETA_DATA.weeks[week-1].days.find(d=>d.key===dayKey)||KETA_DATA.weeks[0].days.find(d=>d.key===dayKey)}
  function dateForDay(dayKey,base=today){const monday=new Date(base);monday.setDate(base.getDate()-((base.getDay()+6)%7));const offset=['mon','tue','wed','thu','fri','sat','sun'].indexOf(dayKey);const d=new Date(monday);d.setDate(monday.getDate()+offset);return d}
  function weekDates(){return ['mon','tue','wed','thu','fri','sat','sun'].map(k=>dateForDay(k))}
  function activeWorkout(){return workoutFor(todayKey())}
  function streak(){let n=0;let d=new Date(today);while(isDone(iso(d))){n++;d.setDate(d.getDate()-1)}return n}
  function last7(){let n=0;for(let i=0;i<7;i++){const d=new Date(today);d.setDate(today.getDate()-i);if(isDone(iso(d)))n++}return n}
  function total(){return state.completed.length}
  function weeklyCompletion(){return Math.round((last7()/7)*100)}
  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function page(){return document.body.dataset.page||'today'}
  function formatLong(d){return `${monthLabels[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`}
  function formatShort(ds){const d=new Date(ds+'T12:00:00');return d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}
  function nav(){const links=[['index.html','Today','⌂','today'],['workouts.html','Workouts','◒','workouts'],['progress.html','Progress','↗','progress'],['profile.html','Profile','◌','profile']];return `<nav class="bottom-nav">${links.map(([href,label,icon,id])=>`<a class="nav-item ${page()===id?'active':''}" href="${href}"><span class="nav-icon">${icon}</span><span>${label}</span></a>`).join('')}</nav>`}
  function head(title,kicker='Keta / tracker'){return `<header class="page-head"><div><div class="kicker">${kicker}</div><h1>${title}</h1></div><div class="avatar">K</div></header>`}
  function shell(content){document.getElementById('app').innerHTML=`<div class="shell">${content}</div>${nav()}<div id="toast" class="toast"></div><div id="fx"></div>`}
  function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),1800)}
  function celebrate(){const fx=document.getElementById('fx');if(!fx)return;fx.innerHTML='<div class="screen-flash"></div>';for(let i=0;i<24;i++){const s=document.createElement('i');s.className='spark';s.style.setProperty('--x',`${(Math.random()*2-1)*190}px`);s.style.setProperty('--y',`${(Math.random()*2-1)*230}px`);fx.appendChild(s)}setTimeout(()=>fx.innerHTML='',900);if(navigator.vibrate)navigator.vibrate([18,45,18])}
  function toggleDay(ds, silent=false){if(isDone(ds)){state.completed=state.completed.filter(x=>x!==ds)}else{state.completed.push(ds)}save();if(!silent){if(isDone(ds)){celebrate();toast('Workout complete ✓')}else toast('Completion removed')}render()}
  function complete(ds){if(!isDone(ds)){state.completed.push(ds);save();celebrate();toast('Workout complete ✓');render()}}
  function bindReset(){document.querySelectorAll('[data-reset]').forEach(b=>b.onclick=()=>{if(confirm('Reset all progress?')){state.completed=[];state.exerciseChecks={};save();render();toast('Progress reset')}})}

  function renderToday(){
    const w=activeWorkout();const ds=iso(today);const done=isDone(ds);const pc=weeklyCompletion();
    shell(`${head('Today','Keta / your rhythm')}
      <main>
        <section class="hero-card">
          <div class="hero-top"><span class="date">${formatLong(today)}</span><span class="pill ${done?'done':'today'}">${done?'COMPLETED':'FOR TODAY'}</span></div>
          <div class="hero-content"><p class="eyebrow">GOOD TO SEE YOU, KETA</p><h2>${done?'You showed up.':'Make today count.'}</h2><p>${done?'The session is logged. Keep the next step simple.':'A focused session is enough. Quality over pressure.'}</p><div class="actions"><a class="primary-btn" href="workouts.html#${w.key}">${done?'Review workout':'Start today'} <span>→</span></a><button class="icon-btn" data-toggle-day="${ds}" aria-label="Toggle completion">✓</button></div></div>
        </section>
        <section class="stats-grid"><article class="stat"><span class="stat-label">STREAK</span><strong>${streak()}</strong><small>days in a row</small></article><article class="stat"><span class="stat-label">LAST 7 DAYS</span><strong>${pc}%</strong><small>${last7()} of 7 days</small></article><article class="stat"><span class="stat-label">TOTAL</span><strong>${total()}</strong><small>completed sessions</small></article></section>
        <section class="section-head"><div><div class="kicker">THIS WEEK</div><h3>Your rhythm</h3></div><a href="progress.html">Open progress →</a></section>
        <section class="week-strip">${weekDates().map(d=>{const k=dayKeys[d.getDay()];const work=workoutFor(k);return `<a class="day-card ${iso(d)===ds?'active':''} ${isDone(iso(d))?'done':''}" href="workouts.html#${k}"><span>${dayLabels[d.getDay()]}</span><b>${d.getDate()}</b><small>${esc(work.name)}</small></a>`}).join('')}</section>
        <section class="session-card"><div class="session-meta"><span class="tag ${tagClass(w.type)}">${esc(w.type)}</span><span>${esc(w.duration)}</span><span>${esc(w.equipment)}</span></div><div class="session-title">${esc(w.name)}</div><p class="session-copy">${esc(w.goal)} · ${w.exercises.length} movements</p><div class="exercise-list">${w.exercises.slice(0,4).map((e,i)=>`<div class="exercise-item"><span class="exercise-num">0${i+1}</span><div><b>${esc(e[0])}</b><small>${esc(e[1])}</small></div><button class="exercise-done" data-ex-check="${w.key}:${i}">${exerciseChecked(w.key,i)?'✓':'○'}</button></div>`).join('')}</div><a class="ghost-btn" href="workouts.html#${w.key}">View full session</a></section>
        <section class="momentum"><div class="ring" style="--progress:${pc}"><div class="ring-inner"><strong>${pc}%</strong><small>7-day rhythm</small></div></div><div><div class="kicker">MOMENTUM</div><h3>${pc>=70?'You are in your rhythm.':'Build it one session at a time.'}</h3><p>${streak()>=2?`You have a ${streak()}-day streak. Keep it sustainable.`:'One completed session can start the streak.'}</p></div></section>
      </main>`);
    bindToday();
  }
  function tagClass(type){if(type==='Strength')return'lime';if(type==='Pilates')return'violet';if(type==='Cardio')return'cyan';return'pink'}
  function exerciseChecked(day,i){return !!state.exerciseChecks[`${day}:${i}`]}
  function bindToday(){document.querySelectorAll('[data-toggle-day]').forEach(b=>b.onclick=()=>toggleDay(b.dataset.toggleDay));document.querySelectorAll('[data-ex-check]').forEach(b=>b.onclick=()=>{const key=b.dataset.exCheck;state.exerciseChecks[key]=!state.exerciseChecks[key];save();render()})}

  function renderWorkouts(){
    const week=currentWeek();const data=KETA_DATA.weeks[week-1];shell(`${head('Workouts','Keta / training library')}
      <main><section class="selector"><div><div class="kicker">4-WEEK BLOCK</div><h2>${esc(data.title)}</h2><p>${esc(data.focus)}</p></div><div class="week-select">${KETA_DATA.weeks.map(w=>`<button class="week-pill ${week===w.id?'active':''}" data-week="${w.id}">${w.id}</button>`).join('')}</div></section>
      <section class="list-stack">${data.days.map(d=>workoutCard(d)).join('')}</section></main>`);document.querySelectorAll('[data-week]').forEach(b=>b.onclick=()=>{state.selectedWeek=Number(b.dataset.week);save();render()});document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openModal(b.dataset.open,week));document.querySelectorAll('[data-mark]').forEach(b=>b.onclick=()=>complete(b.dataset.mark));
    const hash=location.hash.replace('#','');if(hash){setTimeout(()=>document.getElementById(hash)?.scrollIntoView({behavior:'smooth',block:'start'}),50)}
  }
  function workoutCard(d){const dt=dateForDay(d.key);const ds=iso(dt);const done=isDone(ds);const isToday=ds===iso(today);return `<article id="${d.key}" class="workout-card ${isToday?'today':''}"><div class="workout-top"><span class="day-badge">${dayLabels[dt.getDay()]} · ${dt.getDate()}</span>${done?'<span class="pill done">COMPLETED</span>':isToday?'<span class="pill today">TODAY</span>':''}</div><h3>${esc(d.name)}</h3><div class="meta"><span>${esc(d.duration)}</span><span>${esc(d.type)}</span><span>${esc(d.equipment)}</span></div><div class="mini-exercises">${d.exercises.slice(0,3).map((e,i)=>`<div><span>0${i+1}</span><b>${esc(e[0])}</b><small>${esc(e[1])}</small></div>`).join('')}</div><div class="card-actions"><button class="secondary-btn" data-open="${d.key}">Open session</button><button class="complete-btn ${done?'done':''}" data-mark="${ds}">${done?'Completed ✓':'Mark complete'}</button></div></article>`}
  function openModal(dayKey,week){const d=workoutFor(dayKey,week);const modal=document.createElement('div');modal.className='modal';modal.innerHTML=`<div class="modal-panel"><button class="modal-close" aria-label="Close">×</button><div class="kicker">SESSION DETAILS</div><h2>${esc(d.name)}</h2><p class="modal-sub">${esc(d.duration)} · ${esc(d.type)} · ${esc(d.equipment)}</p><div class="modal-list">${d.exercises.map((e,i)=>`<label class="check-row ${exerciseChecked(d.key,i)?'checked':''}"><input type="checkbox" ${exerciseChecked(d.key,i)?'checked':''} data-modal-check="${d.key}:${i}"><span class="check-box">${exerciseChecked(d.key,i)?'✓':''}</span><div><b>${esc(e[0])}</b><small>${esc(e[1])} · ${esc(e[2])}</small></div></label>`).join('')}</div><button class="primary-btn modal-done">Finish session →</button></div>`;document.body.appendChild(modal);requestAnimationFrame(()=>modal.classList.add('show'));const close=()=>{modal.classList.remove('show');setTimeout(()=>modal.remove(),220)};modal.querySelector('.modal-close').onclick=close;modal.onclick=e=>{if(e.target===modal)close()};modal.querySelectorAll('[data-modal-check]').forEach(input=>input.onchange=()=>{const key=input.dataset.modalCheck;state.exerciseChecks[key]=input.checked;input.closest('.check-row').classList.toggle('checked',input.checked);input.nextElementSibling.textContent=input.checked?'✓':'';save()});modal.querySelector('.modal-done').onclick=()=>{const ds=iso(dateForDay(dayKey));complete(ds);close()}}

  function renderProgress(){
    const pc=weeklyCompletion();const y=today.getFullYear();const m=today.getMonth();const first=new Date(y,m,1);const start=(first.getDay()+6)%7;const days=new Date(y,m+1,0).getDate();let cells='';for(let i=0;i<start;i++)cells+='<span></span>';for(let d=1;d<=days;d++){const ds=`${y}-${pad(m+1)}-${pad(d)}`;cells+=`<button class="calendar-day ${ds===iso(today)?'today':''} ${isDone(ds)?'done':''}" data-cal="${ds}">${d}${isDone(ds)?'<i class="dot"></i>':''}</button>`}
    const recent=state.completed.slice().sort((a,b)=>b.localeCompare(a)).slice(0,7);
    shell(`${head('Progress','Keta / proof, not pressure')}<main><section class="progress-card"><div class="progress-top"><div class="big-ring" style="--progress:${pc}"><div><strong>${pc}%</strong><span>7-day rhythm</span></div></div><div><div class="kicker">MOMENTUM</div><h2>${streak()?`${streak()} day${streak()===1?'':'s'} strong`:'Start your streak'}</h2><p>Consistency matters more than perfect weeks.</p></div></div><div class="metric-grid"><div class="metric"><span>COMPLETED</span><strong>${total()}</strong><small>sessions logged</small></div><div class="metric"><span>LAST 7 DAYS</span><strong>${last7()}/7</strong><small>days completed</small></div></div></section><section class="progress-card calendar"><div class="calendar-head"><div><div class="kicker">HISTORY</div><h3>${monthLabels[m]} ${y}</h3></div><div class="month-note">Tap a day to toggle</div></div><div class="calendar-grid">${['M','T','W','T','F','S','S'].map(x=>`<span class="calendar-label">${x}</span>`).join('')}${cells}</div></section><section class="history"><div class="section-head"><div><div class="kicker">RECENT</div><h3>Completed sessions</h3></div></div><div class="history-list">${recent.length?recent.map(ds=>{const d=new Date(ds+'T12:00:00');const w=workoutFor(dayKeys[d.getDay()]);return `<div class="history-item"><div class="history-icon">✓</div><div><b>${formatShort(ds)} · ${esc(w.name)}</b><small>${esc(w.type)} · logged</small></div></div>`}).join(''):'<div class="empty">Your completed sessions will appear here.</div>'}</div></section><section class="insight-card"><b>Keep the standard realistic.</b><p>Use effort that feels challenging but controlled. Rest is part of the plan, not a missed day.</p></section><button class="danger-btn" data-reset>Reset all progress</button></main>`);
    document.querySelectorAll('[data-cal]').forEach(b=>b.onclick=()=>toggleDay(b.dataset.cal));bindReset();
  }

  function renderProfile(){const pc=weeklyCompletion();shell(`${head('Profile','Keta / personal space')}<main><section class="profile-card"><div class="profile-head"><div class="profile-avatar">K</div><div><div class="kicker">PERSONAL TRACKER</div><h2>Keta</h2><p>Your training rhythm, all in one place.</p></div></div><div class="profile-stats"><div class="profile-stat"><span>STREAK</span><strong>${streak()}</strong></div><div class="profile-stat"><span>7-DAY</span><strong>${pc}%</strong></div><div class="profile-stat"><span>TOTAL</span><strong>${total()}</strong></div></div></section><section class="settings-card"><div class="setting-row"><div><b>English interface</b><small>All tracker content is in English.</small></div><span class="pill today">EN</span></div><div class="setting-row"><div><b>Local progress</b><small>Saved automatically in this browser.</small></div><span class="pill done">ON</span></div><div class="setting-row"><div><b>Phone-first layout</b><small>Designed for quick taps and short sessions.</small></div><span class="pill today">READY</span></div></section><section class="insight-card"><b>What this tracker is for</b><p>Keep a visible record of movement, build consistency, and make training feel simple enough to repeat.</p></section><section class="insight-card"><b>What it is not</b><p>No calorie targets, no pressure to chase scale changes, and no need to train every day.</p></section><button class="danger-btn" data-reset>Clear all saved progress</button></main>`);bindReset()}

  function render(){if(page()==='today')renderToday();else if(page()==='workouts')renderWorkouts();else if(page()==='progress')renderProgress();else if(page()==='profile')renderProfile()}
  window.addEventListener('DOMContentLoaded',render);
})();

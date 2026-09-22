// ==========================================================================
// OSKAR KLUB — shared interactivity
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeaderScroll();
  initMenuTabs();
  initGallery();
  initCalendar();
  initReservationForm();
  initContactForm();
});

/* ------------------------------ navigation ------------------------------ */
function initNav(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if(!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.classList.remove('open');
  }));
}

function initHeaderScroll(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  const onScroll = () => header.classList.toggle('solid', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});
}

/* ------------------------------ menu tabs ------------------------------- */
function initMenuTabs(){
  const tabs = document.querySelectorAll('.menu-tab');
  if(!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.panel).classList.add('active');
    });
  });
}

/* ------------------------------ gallery ---------------------------------- */
function initGallery(){
  const grid = document.querySelector('.gallery-grid');
  if(!grid) return;
  const filters = document.querySelectorAll('.gfilter');
  const items = document.querySelectorAll('.gitem');
  filters.forEach(f => f.addEventListener('click', () => {
    filters.forEach(x => x.classList.remove('active'));
    f.classList.add('active');
    const cat = f.dataset.filter;
    items.forEach(it => {
      const show = cat === 'all' || it.dataset.cat === cat;
      it.style.display = show ? '' : 'none';
    });
  }));

  const lightbox = document.querySelector('.lightbox');
  const lbInner = document.querySelector('.lightbox-inner');
  const lbCap = document.querySelector('.lightbox-cap');
  if(!lightbox) return;
  items.forEach(it => it.addEventListener('click', () => {
    const svg = it.querySelector('svg');
    lbInner.innerHTML = svg ? svg.outerHTML : '';
    lbCap.textContent = it.dataset.caption || '';
    lightbox.classList.add('open');
  }));
  lightbox.addEventListener('click', (e) => {
    if(e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('open');
    }
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') lightbox.classList.remove('open');
  });
}

/* ------------------------------ calendar ---------------------------------- */
function initCalendar(){
  const grid = document.getElementById('calGrid');
  if(!grid) return;

  // Sample events data — replace with real events or wire up to a backend/CMS.
  const events = window.OSKAR_EVENTS || [];
  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  const monthLabel = document.getElementById('calMonthLabel');
  const agenda = document.getElementById('agendaList');
  const monthNames = ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];
  const dow = ['Po','Út','St','Čt','Pá','So','Ne'];

  function eventsOn(y,m,d){
    return events.filter(ev => {
      const dt = new Date(ev.date);
      return dt.getFullYear()===y && dt.getMonth()===m && dt.getDate()===d;
    });
  }

  function render(){
    grid.innerHTML = '';
    dow.forEach(d => {
      const cell = document.createElement('div');
      cell.className = 'cal-dow';
      cell.textContent = d;
      grid.appendChild(cell);
    });
    monthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;

    const firstDay = new Date(viewYear, viewMonth, 1);
    let startOffset = firstDay.getDay() - 1; // Monday-first
    if(startOffset < 0) startOffset = 6;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    for(let i=0;i<startOffset;i++){
      const pad = document.createElement('div');
      pad.className = 'cal-cell pad';
      grid.appendChild(pad);
    }

    for(let d=1; d<=daysInMonth; d++){
      const cell = document.createElement('div');
      const dayEvents = eventsOn(viewYear, viewMonth, d);
      cell.className = 'cal-cell' + (dayEvents.length ? ' has-event' : '');
      const isToday = d===today.getDate() && viewMonth===today.getMonth() && viewYear===today.getFullYear();
      if(isToday) cell.classList.add('today');
      cell.innerHTML = `<span class="num">${d}</span>` + (dayEvents.length ? '<span class="cal-dot"></span>' : '');
      if(dayEvents.length){
        cell.addEventListener('click', () => showAgenda(dayEvents, `${d}. ${monthNames[viewMonth]} ${viewYear}`));
      }
      grid.appendChild(cell);
    }

    // default agenda: upcoming events this month, or a friendly empty state
    const upcoming = events
      .map(ev => ({...ev, dt:new Date(ev.date)}))
      .filter(ev => ev.dt.getFullYear()===viewYear && ev.dt.getMonth()===viewMonth)
      .sort((a,b)=>a.dt-b.dt);
    if(upcoming.length){
      showAgenda(upcoming, null, true);
    } else if(agenda){
      agenda.innerHTML = '<p class="agenda-empty">Pro tento měsíc zatím nejsou vypsané žádné akce. Zkuste další měsíc, nebo se přihlaste k odběru novinek.</p>';
    }
  }

  function showAgenda(list, dayLabel, isMonthView){
    if(!agenda) return;
    agenda.innerHTML = '';
    list.forEach(ev => {
      const dt = new Date(ev.date);
      const item = document.createElement('div');
      item.className = 'agenda-item';
      item.innerHTML = `
        <span class="date">${dt.getDate()}. ${monthNames[dt.getMonth()]} — ${ev.time || ''}</span>
        <h4>${ev.title}</h4>
        <p>${ev.desc || ''}</p>
      `;
      agenda.appendChild(item);
    });
  }

  document.getElementById('calPrev').addEventListener('click', () => {
    viewMonth--; if(viewMonth<0){viewMonth=11;viewYear--;}
    render();
  });
  document.getElementById('calNext').addEventListener('click', () => {
    viewMonth++; if(viewMonth>11){viewMonth=0;viewYear++;}
    render();
  });

  render();
}

/* ------------------------------ reservation form --------------------------- */
function initReservationForm(){
  const form = document.getElementById('reservationForm');
  if(!form) return;
  const success = document.querySelector('.form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const rules = {
      name: v => v.trim().length > 1,
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      phone: v => v.trim().replace(/\s/g,'').length >= 9,
      date: v => !!v,
      time: v => !!v,
      guests: v => Number(v) > 0
    };

    Object.keys(rules).forEach(key => {
      const input = form.elements[key];
      if(!input) return;
      const field = input.closest('.field');
      const ok = rules[key](input.value);
      field.classList.toggle('invalid', !ok);
      const err = field.querySelector('.err');
      if(err) err.textContent = ok ? '' : errorMessage(key);
      if(!ok) valid = false;
    });

    if(valid){
      form.reset();
      form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
      success.classList.add('show');
      success.textContent = `Děkujeme za rezervaci. Potvrzení vám zašleme e-mailem během několika hodin.`;
      success.scrollIntoView({behavior:'smooth', block:'center'});
    } else {
      success.classList.remove('show');
    }
  });

  function errorMessage(key){
    switch(key){
      case 'name': return 'Zadejte prosím jméno.';
      case 'email': return 'Zadejte platný e-mail.';
      case 'phone': return 'Zadejte platné telefonní číslo.';
      case 'date': return 'Vyberte datum.';
      case 'time': return 'Vyberte čas.';
      case 'guests': return 'Zadejte počet hostů.';
      default: return 'Zkontrolujte prosím toto pole.';
    }
  }
}

/* ------------------------------ contact form -------------------------------- */
function initContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  const success = document.querySelector('.form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const rules = {
      name: v => v.trim().length > 1,
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: v => v.trim().length > 4
    };
    Object.keys(rules).forEach(key => {
      const input = form.elements[key];
      if(!input) return;
      const field = input.closest('.field');
      const ok = rules[key](input.value);
      field.classList.toggle('invalid', !ok);
      const err = field.querySelector('.err');
      if(err) err.textContent = ok ? '' : 'Zkontrolujte prosím toto pole.';
      if(!ok) valid = false;
    });
    if(valid){
      form.reset();
      form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
      success.classList.add('show');
      success.textContent = 'Zpráva byla odeslána. Ozveme se vám co nejdříve.';
    } else {
      success.classList.remove('show');
    }
  });
}

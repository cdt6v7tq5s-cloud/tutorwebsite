// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// Mobile menu
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Contact form — Formspree AJAX
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      btn.textContent = 'Sent — I will be in touch within 24 hours.';
      btn.style.background = '#2d6a4f';
      contactForm.reset();
    } else {
      btn.textContent = 'Something went wrong — please email directly.';
      btn.style.background = '#b91c1c';
      btn.disabled = false;
    }
  } catch {
    btn.textContent = 'Could not send — please email directly.';
    btn.style.background = '#b91c1c';
    btn.disabled = false;
  }
});


// ==========================================
// STUDY PLAN GENERATOR
// ==========================================

const topics = {
  GCSE: {
    AQA: [
      { name: 'Natural Hazards', p: 'high', skills: ['case-studies','extended-writing'],
        subs: ['Tectonic hazards — earthquake and volcanic case studies with located detail','Tropical storms — formation, structure, and named storm case study','UK extreme weather events and responses','Climate change — evidence, causes, and management strategies'] },
      { name: 'The Living World', p: 'high', skills: ['case-studies','exam-technique'],
        subs: ['Ecosystems — nutrient cycling, food chains, small-scale UK example','Tropical rainforests — characteristics, deforestation causes, and sustainable management','Hot deserts — opportunities, challenges, and desertification'] },
      { name: 'Physical Landscapes in the UK', p: 'high', skills: ['diagram-skills','extended-writing'],
        subs: ['Coastal processes — erosion, transportation, deposition landforms','River processes — drainage basins, flood hydrographs, landform formation','Glacial landscapes — erosion and depositional landforms','Management strategies for each landscape'] },
      { name: 'Urban Issues and Challenges', p: 'high', skills: ['case-studies','data-skills'],
        subs: ['Global urbanisation trends and LIC/NEE city case study','UK city — urban change, deprivation, and regeneration','Urban sustainability — transport, waste, and housing'] },
      { name: 'The Changing Economic World', p: 'medium', skills: ['case-studies','data-skills'],
        subs: ['Measuring development — HDI, GNI, literacy rate comparisons','Causes of uneven development and strategies to reduce the gap','NEE case study — economic development and its impacts','Changes in the UK economy — post-industrial landscape'] },
      { name: 'Resource Management', p: 'medium', skills: ['extended-writing','exam-technique'],
        subs: ['Global resource consumption patterns and inequality','Food, water, or energy insecurity — causes and management','UK energy mix and move towards renewables'] },
      { name: 'Geographical Skills', p: 'medium', skills: ['data-skills','diagram-skills'],
        subs: ['Graphical skills — completing and interpreting graphs and maps','Statistical skills — percentages, means, medians','Ordnance Survey and atlas map skills'] },
      { name: 'Paper 3 Issue Evaluation', p: 'exam', skills: ['exam-technique','extended-writing'],
        subs: ['Pre-release resource booklet — annotating and analysing sources','Structuring 9-mark and 12-mark responses with evidence','Reaching and justifying a decision with counter-arguments'] }
    ],
    Edexcel: [
      { name: 'Hazardous Earth', p: 'high', skills: ['case-studies','extended-writing'],
        subs: ['Global atmospheric circulation and climate patterns','Tropical storm formation, structure, and named case study','Tectonic hazards — plate margins, earthquake and volcanic case studies','Managing hazard risk — prediction, prevention, and aid'] },
      { name: 'Development Dynamics', p: 'high', skills: ['case-studies','extended-writing'],
        subs: ['Measuring development — GNI, HDI, and the limitations of each measure','Theories of development — Rostow, dependency','NEE case study — India: economic growth and its social consequences','Top-down vs bottom-up development strategies'] },
      { name: 'Challenges of an Urbanising World', p: 'high', skills: ['case-studies','data-skills'],
        subs: ['LIC/NEE city case study — growth, opportunities, and challenges','Urban sprawl and squatter settlements','UK city case study — regeneration strategies and their success'] },
      { name: 'Rivers, Floods and Management', p: 'high', skills: ['diagram-skills','extended-writing'],
        subs: ['River processes — erosion, transportation, deposition','Landform formation — meanders, ox-bow lakes, deltas','Flood risk — physical and human factors','Flood management — hard and soft engineering case studies'] },
      { name: 'UK in the 21st Century', p: 'medium', skills: ['data-skills','exam-technique'],
        subs: ["UK's changing economy — deindustrialisation and the rise of services",'UK population change — ageing population and migration','UK connectivity — transport and digital infrastructure'] },
      { name: 'Oceans on the Edge', p: 'medium', skills: ['case-studies','extended-writing'],
        subs: ['Ocean ecosystems — coral reefs and mangroves','Threats to ocean health — acidification, pollution, overfishing','Ocean governance — international agreements and their effectiveness'] },
      { name: 'Geographical Skills', p: 'medium', skills: ['data-skills','diagram-skills'],
        subs: ['Graphical and cartographic skills','Statistical analysis — quartiles, Spearman rank','Fieldwork methodology — data collection and analysis'] },
      { name: 'Paper 3 Decision Making Exercise', p: 'exam', skills: ['exam-technique','extended-writing'],
        subs: ['Interpreting the resource booklet under exam conditions','Structuring a justified decision with supporting evidence','Evaluating options — weighing costs, benefits, and trade-offs'] }
    ]
  },
  'A-Level': {
    AQA: [
      { name: 'Water and Carbon Cycles', p: 'high', skills: ['extended-writing','diagram-skills'],
        subs: ['Water cycle stores and flows — drainage basin as a system','Carbon cycle — natural stores, fluxes, and residence times','Human impacts on both cycles — deforestation, fossil fuels, urbanisation','Climate change feedbacks and tipping points'] },
      { name: 'Coastal Systems and Landscapes', p: 'high', skills: ['case-studies','extended-writing','diagram-skills'],
        subs: ['Littoral zone as a system — sediment budget and cells','Erosion, transportation, and deposition landform formation in detail','Coastal flooding risk — physical and human factors','Hard vs soft engineering — named case studies with evaluation'] },
      { name: 'Hazards', p: 'high', skills: ['case-studies','extended-writing'],
        subs: ['Plate tectonics — theory, evidence, and margin characteristics','Seismic and volcanic hazard profiles — contrasting case studies','Tropical storm and drought hazards — formation and impacts','Disaster risk equation — vulnerability, capacity, and resilience'] },
      { name: 'Global Systems and Governance', p: 'high', skills: ['extended-writing','exam-technique'],
        subs: ['Globalisation — causes, flows, and uneven outcomes','Global commons — Antarctica and the high seas as case studies','International trade patterns and the role of TNCs','Global governance — effectiveness of the UN, WTO, and trade blocs'] },
      { name: 'Changing Places', p: 'high', skills: ['case-studies','data-skills','extended-writing'],
        subs: ['Place meaning and identity — insider vs outsider perspectives','How places change — economic, demographic, and cultural shifts','Quantitative and qualitative methods for studying place','Contrasting place case studies — local and distant'] },
      { name: 'Ecosystems under Stress', p: 'medium', skills: ['case-studies','extended-writing'],
        subs: ['Ecosystems as open systems — energy flows and nutrient cycling','Biome characteristics — tropical rainforest and one other','Anthropogenic threats — fragmentation, invasive species, climate change','Conservation strategies — protected areas, international agreements'] },
      { name: 'Contemporary Urban Environments', p: 'medium', skills: ['case-studies','data-skills'],
        subs: ['Urbanisation drivers — rural-urban migration and natural increase','Urban social inequality — causes and spatial patterns','Regeneration strategies — gentrification vs community-led approaches','Urban ecological footprint and sustainable futures'] },
      { name: 'Resource Security', p: 'medium', skills: ['extended-writing','exam-technique'],
        subs: ['Global resource consumption — patterns and drivers of demand','Water, food, and energy insecurity — causes and consequences','Resource stewardship — sustainable management approaches','Geopolitics of resource control'] },
      { name: 'NEA Independent Investigation', p: 'coursework', skills: ['data-skills','extended-writing'],
        subs: ['Research question — specificity, geographical theory, and feasibility','Methodology — primary data collection with risk assessment','Data presentation — appropriate graphical and cartographic techniques','Analysis and conclusion — linking findings to theory and wider context'] },
      { name: 'Paper 3 Synoptic Skills', p: 'exam', skills: ['exam-technique','extended-writing'],
        subs: ['Synoptic thinking — drawing links across physical and human topics','Unseen resource analysis — applying geographical concepts to new contexts','Decision making — structured evaluation of options with justified conclusion','20-mark essay under timed conditions — planning and structure'] }
    ],
    Edexcel: [
      { name: 'Tectonic Processes and Hazards', p: 'high', skills: ['case-studies','extended-writing'],
        subs: ['Plate margin types — characteristics and associated hazards','Earthquake hazard — ground shaking, liquefaction, tsunamis','Volcanic hazard — lava flows, pyroclastic density currents, lahars','Contrasting case studies — two events in different development contexts','Disaster risk and management — Park model and Hazard Management Cycle'] },
      { name: 'Landscape Systems (Coasts or Glaciated)', p: 'high', skills: ['diagram-skills','extended-writing','case-studies'],
        subs: ['Landscapes as open systems — stores, flows, and equilibrium','Landform formation — erosion and deposition processes in detail','Systems change over time — human and climate-driven disturbance','Management strategies — hard engineering, soft engineering, and managed retreat'] },
      { name: 'Globalisation', p: 'high', skills: ['case-studies','extended-writing'],
        subs: ['Drivers of globalisation — technology, finance, TNCs, trade agreements','Flows of capital, labour, and ideas — winners and losers','TNC case study — global reach, local impacts, and corporate power','Anti-globalisation movements and the rise of nationalism'] },
      { name: 'Shaping Places (Regeneration)', p: 'high', skills: ['case-studies','data-skills','extended-writing'],
        subs: ['Place identity — economic, demographic, and cultural characteristics','Why places need to change — deindustrialisation and decline','Regeneration strategies — property-led, rebranding, community-led','Evaluating regeneration success — who benefits and who loses?'] },
      { name: 'Water Cycle and Water Insecurity', p: 'high', skills: ['extended-writing','case-studies'],
        subs: ['Global water cycle — stores, flows, and residence times','Physical and human drivers of water insecurity','Water management strategies — large-scale transfers, dams, and desalination','Evaluating sustainability of water management approaches'] },
      { name: 'Carbon Cycle and Energy Security', p: 'medium', skills: ['extended-writing','exam-technique'],
        subs: ['Carbon stores and flows — natural and anthropogenic fluxes','Global energy mix — fossil fuels, renewables, and geopolitics','Energy insecurity — causes, consequences, and management','Low-carbon transition — feasibility and barriers'] },
      { name: 'Superpowers', p: 'medium', skills: ['extended-writing','case-studies'],
        subs: ['Defining superpower status — economic, military, cultural indicators','Emerging powers — China, India, and the BRICS','Geopolitical competition — spheres of influence and proxy conflicts','Global governance and the challenge of multipolarity'] },
      { name: 'Health, Human Rights and Intervention', p: 'medium', skills: ['case-studies','extended-writing'],
        subs: ['Global health patterns — causes of health inequalities','Human rights frameworks — Universal Declaration and enforcement','Intervention — military, humanitarian, and economic','Case studies — specific interventions evaluated for success and legitimacy'] },
      { name: 'NEA Independent Investigation', p: 'coursework', skills: ['data-skills','extended-writing'],
        subs: ['Research question — geographical theory, scale, and testability','Primary data collection — rigorous methodology and risk management','Data presentation — varied, appropriate techniques','Critical analysis — statistical testing and linking to wider geographical context'] },
      { name: 'Paper 3 Synoptic Skills', p: 'exam', skills: ['exam-technique','extended-writing'],
        subs: ['Synoptic links — connecting physical and human geography themes','Fieldwork data questions — interpreting and evaluating collected data','Unseen stimulus — applying knowledge to unfamiliar geographical contexts','Extended writing — planning, structuring, and evaluating under exam conditions'] }
    ]
  }
};

const skillLabels = {
  'extended-writing': 'Extended writing',
  'case-studies':     'Case study depth',
  'data-skills':      'Data & graph skills',
  'diagram-skills':   'Diagram technique',
  'exam-technique':   'Exam technique',
  'content':          'Content recall',
};

const gcseGrades   = ['1','2','3','4','5','6','7','8','9'];
const alevelGrades = ['U','E','D','C','B','A','A*'];

let state = {
  level: null, board: null, current: null, target: null,
  coverage: null, weakAreas: [], hours: null, weeks: 12
};

function showStep(id, dotNum, label) {
  document.querySelectorAll('.planner__step').forEach(s => s.classList.add('planner__step--hidden'));
  document.getElementById(id).classList.remove('planner__step--hidden');
  document.querySelectorAll('.planner__dot').forEach((d, i) => {
    d.classList.toggle('planner__dot--active', i < dotNum);
  });
  document.getElementById('plannerLabel').textContent = label;
}

// Step 1 — Level
document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.level = btn.dataset.value;
    state.board = null; state.current = null; state.target = null;
    buildGradeOptions();
    showStep('step2', 2, 'Step 2 of 6');
  });
});

// Step 2 — Board
document.querySelectorAll('.board-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    state.board = btn.dataset.value;
    showStep('step3', 3, 'Step 3 of 6');
  });
});

// Step 3 — Grades
function buildGradeOptions() {
  const grades = state.level === 'GCSE' ? gcseGrades : alevelGrades;
  ['currentGrades','targetGrades'].forEach(id => {
    const el = document.getElementById(id);
    el.innerHTML = '';
    grades.forEach(g => {
      const b = document.createElement('button');
      b.className = 'grade-btn';
      b.dataset.value = g;
      b.textContent = g;
      b.addEventListener('click', () => handleGrade(id === 'currentGrades' ? 'current' : 'target', g));
      el.appendChild(b);
    });
  });
}

function handleGrade(type, value) {
  state[type] = value;
  document.querySelectorAll(`#${type === 'current' ? 'currentGrades' : 'targetGrades'} .grade-btn`)
    .forEach(b => b.classList.toggle('grade-btn--selected', b.dataset.value === value));
  if (state.current) {
    const grades = state.level === 'GCSE' ? gcseGrades : alevelGrades;
    const ci = grades.indexOf(state.current);
    document.querySelectorAll('#targetGrades .grade-btn').forEach(b => {
      b.classList.toggle('grade-btn--invalid', grades.indexOf(b.dataset.value) < ci);
    });
  }
  document.getElementById('step3Next').disabled = !(state.current && state.target);
}

document.getElementById('step3Next').addEventListener('click', () => showStep('step4', 4, 'Step 4 of 6'));

// Step 4 — Coverage
document.querySelectorAll('.coverage-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.coverage = btn.dataset.value;
    document.querySelectorAll('.coverage-btn').forEach(b => b.classList.remove('coverage-btn--selected'));
    btn.classList.add('coverage-btn--selected');
    showStep('step5', 5, 'Step 5 of 6');
  });
});

// Step 5 — Weaknesses (multi-select, optional)
document.querySelectorAll('.weakness-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('weakness-btn--selected');
    const val = btn.dataset.value;
    if (state.weakAreas.includes(val)) {
      state.weakAreas = state.weakAreas.filter(w => w !== val);
    } else {
      state.weakAreas.push(val);
    }
  });
});

document.getElementById('step5Next').addEventListener('click', () => showStep('step6', 6, 'Step 6 of 6'));

// Step 6 — Hours + weeks
document.querySelectorAll('.hours-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.hours = parseInt(btn.dataset.value);
    document.querySelectorAll('.hours-btn').forEach(b => b.classList.remove('hours-btn--selected'));
    btn.classList.add('hours-btn--selected');
    checkStep6();
  });
});

const weeksRange = document.getElementById('weeksRange');
const weeksVal   = document.getElementById('weeksVal');
weeksRange.addEventListener('input', () => {
  state.weeks = parseInt(weeksRange.value);
  weeksVal.textContent = state.weeks;
});

function checkStep6() {
  document.getElementById('generateBtn').disabled = !state.hours;
}

// Back buttons
document.querySelectorAll('.planner__back').forEach(btn => {
  btn.addEventListener('click', () => {
    showStep(btn.dataset.target, parseInt(btn.dataset.dot), btn.dataset.lbl);
  });
});

// Generate
document.getElementById('generateBtn').addEventListener('click', () => {
  buildResult();
  showStep('planResult', 6, 'Your plan');
  document.getElementById('plannerLabel').textContent = 'Your personalised plan';
});


// ==========================================
// RESULT BUILDER
// ==========================================

function buildResult() {
  const grades = state.level === 'GCSE' ? gcseGrades : alevelGrades;
  const ci     = grades.indexOf(state.current);
  const ti     = grades.indexOf(state.target);
  const gap    = ti - ci;

  const raw = (topics[state.level][state.board] || []).slice();

  // ── Priority scoring ──
  // Start from base priority, then adjust using all inputs
  const adjusted = raw.map(t => {
    if (t.p === 'exam' || t.p === 'coursework') return { ...t, boost: false };

    let p = t.p;

    // Grade gap: if no gap, everything drops to 'refine'
    if (gap <= 0) { p = 'refine'; return { ...t, p, boost: false }; }
    if (gap === 1 && p === 'medium') p = 'medium';

    // Weakness boost: if this topic's skills overlap with what they struggle with
    const weakMatch = state.weakAreas.some(w => {
      if (w === 'content') return true; // 'content' boosts all topics
      return (t.skills || []).includes(w);
    });
    if (weakMatch && p === 'medium') p = 'high';

    // Coverage: if early in course, content topics are more urgent
    const earlyInCourse = state.coverage === 'started' || state.coverage === 'halfway';
    if (earlyInCourse && t.p === 'high') p = 'high'; // keep high as high

    return { ...t, p, boost: weakMatch && t.p === 'medium' };
  });

  const order = { high: 0, medium: 1, refine: 2, exam: 3, coursework: 4 };
  adjusted.sort((a, b) => order[a.p] - order[b.p]);

  // ── Sessions per week (based on hours + gap) ──
  let perWeek;
  if (state.hours === 1)      perWeek = 1;
  else if (state.hours === 3) perWeek = gap >= 2 ? 2 : 1;
  else                        perWeek = gap >= 1 ? 2 : 1;

  const total = state.weeks * perWeek;
  const timeShort = gap >= 3 && state.hours === 1 && state.weeks < 16;

  // ── Coverage framing ──
  const coverageMode = {
    started:  { verb: 'Learn & build', note: 'Many topics still to be taught — plan covers learning from scratch as well as exam preparation.' },
    halfway:  { verb: 'Learn & revise', note: 'Mix of new content to cover and existing topics to revise and consolidate.' },
    most:     { verb: 'Revise & refine', note: 'Full course largely covered — focus is on consolidation, past papers, and technique.' },
    complete: { verb: 'Consolidate & perfect', note: 'All topics covered — every session can be targeted revision and exam practice.' },
  };
  const mode = coverageMode[state.coverage] || coverageMode.most;

  // ── Meta ──
  document.getElementById('resultMeta').innerHTML =
    `<span class="result__tag">${state.level}</span>
     <span class="result__tag">${state.board}</span>
     <span class="result__tag">${state.current} → ${state.target}</span>
     <span class="result__tag">${state.weeks} weeks</span>`;

  // ── Title ──
  const title = gap <= 0 ? 'Refining for top marks'
    : gap === 1 ? `Closing the gap to ${state.target}`
    : gap <= 3  ? `Targeting ${state.target} from ${state.current}`
    : `Building towards ${state.target}`;
  document.getElementById('resultTitle').textContent = title;

  // ── Summary — factors in coverage mode ──
  let summary;
  if (gap <= 0)
    summary = `You are at or above your target. Focus is now on consistent performance — producing top-band answers reliably under timed conditions, and eliminating the small errors that still cost marks.`;
  else if (gap === 1)
    summary = `A one-grade improvement is very achievable. ${mode.note} The topics below are ordered by where the marks are most likely being dropped.`;
  else
    summary = `${mode.note} The plan below is ordered by impact — the high-priority topics are where your grade is most directly being affected.`;

  document.getElementById('resultSummary').textContent = summary;

  // ── Build topics section ──
  const topicsEl = document.getElementById('resultTopics');
  topicsEl.innerHTML = '';

  // Time warning
  if (timeShort) {
    const warn = document.createElement('div');
    warn.className = 'result__warning';
    warn.textContent = `With ${state.weeks} weeks and 1–2 hours per week, time is limited relative to your grade target. The plan below focuses on the highest-impact topics first — being selective is more effective than trying to cover everything.`;
    topicsEl.appendChild(warn);
  }

  // Skills strip — driven by selected weaknesses + top topic skills
  const skillFreq = {};
  // Count skills from high-priority topics
  adjusted.filter(t => t.p === 'high' || t.p === 'medium').slice(0, 5).forEach(t => {
    (t.skills || []).forEach(s => { skillFreq[s] = (skillFreq[s] || 0) + 1; });
  });
  // Boost selected weaknesses to top
  state.weakAreas.forEach(w => {
    if (skillLabels[w]) skillFreq[w] = (skillFreq[w] || 0) + 3;
  });
  const topSkills = Object.entries(skillFreq).sort((a,b) => b[1]-a[1]).slice(0,3).map(e => e[0]);

  const skillDescs = {
    'extended-writing': gap >= 2
      ? `Build structured ${state.level === 'GCSE' ? '6–9' : '12–20'}-mark answers with a clear argument, evidence, and a conclusion`
      : `Consistently reach the top band — use evaluative language, balance arguments, and land a clear judgement`,
    'case-studies': gap >= 2
      ? `Learn key case studies with specific statistics, place names, and dates — vague answers lose marks fast`
      : `Apply case study detail more precisely to the exact question asked, not just what you've memorised`,
    'data-skills':
      `Interpret graphs, maps, and tables accurately — describe trends, calculate changes, and use geographical vocabulary`,
    'diagram-skills':
      `Diagrams that are annotated with processes and labels earn marks; bare sketches rarely do`,
    'exam-technique': gap >= 2
      ? `Understand what each command word demands — describe, explain, assess, evaluate all require different responses`
      : `Fine-tune top-band technique — every answer should have balance, evidence, and a clear evaluative conclusion`,
    'content': gap >= 2
      ? `Systematic content revision — use active recall (flashcards, practice questions) rather than passive re-reading`
      : `Target the specific content gaps your mock results reveal, rather than covering everything again`,
  };

  if (topSkills.length) {
    const strip = document.createElement('div');
    strip.className = 'result__skills-strip';
    strip.innerHTML = `<p class="result__skills-label">Focus areas${state.weakAreas.length ? ' — based on your answers' : ''}</p>`;
    const grid = document.createElement('div');
    grid.className = 'result__skills-grid';
    topSkills.forEach(sk => {
      const card = document.createElement('div');
      card.className = 'skill-focus';
      card.innerHTML = `<strong>${skillLabels[sk]}</strong><span>${skillDescs[sk] || ''}</span>`;
      grid.appendChild(card);
    });
    strip.appendChild(grid);
    topicsEl.appendChild(strip);
  }

  // Topic list
  const listTitle = document.createElement('p');
  listTitle.className = 'result__topics-label';
  listTitle.textContent = `Revision topics — ${mode.verb.toLowerCase()}, ordered by priority`;
  topicsEl.appendChild(listTitle);

  const badgeText = { high: 'Priority', medium: 'Important', refine: 'Consolidate', exam: 'Exam skill', coursework: 'Coursework' };

  adjusted.forEach((t, i) => {
    const wrap = document.createElement('div');
    wrap.className = `result__topic-block result__topic-block--${t.p}`;
    wrap.style.animationDelay = `${i * 0.06}s`;

    // Extra tag if boosted by weakness match
    const boostTag = t.boost
      ? `<span class="topic-badge topic-badge--boost">Your weak area</span>` : '';

    wrap.innerHTML = `
      <div class="result__topic-head">
        <span class="topic-badge topic-badge--${t.p}">${badgeText[t.p]}</span>
        ${boostTag}
        <strong class="topic-name">${t.name}</strong>
      </div>
      <ul class="topic-subs">
        ${t.subs.map(s => `<li>${s}</li>`).join('')}
      </ul>`;
    topicsEl.appendChild(wrap);
  });

  // ── Schedule + stats ──
  const schedEl = document.getElementById('resultStats');
  const coreTopics = adjusted.filter(t => t.p !== 'coursework');
  let weekCursor = 1;
  let schedHtml = `<div class="result__schedule"><p class="result__schedule-label">Suggested schedule</p>`;

  coreTopics.forEach(t => {
    if (weekCursor > state.weeks) return;
    const weeksNeeded = t.p === 'high' ? 2 : 1;
    const wEnd = Math.min(weekCursor + weeksNeeded - 1, state.weeks);
    const label = wEnd > weekCursor ? `Wk ${weekCursor}–${wEnd}` : `Wk ${weekCursor}`;
    schedHtml += `<div class="sched-row sched-row--${t.p}">
      <span class="sched-wk">${label}</span>
      <span class="sched-topic">${t.name}</span>
    </div>`;
    weekCursor = wEnd + 1;
  });

  schedHtml += `</div>
    <div class="result__stat-boxes">
      <div class="stat-box">
        <span class="stat-box__num">${perWeek}</span>
        <span class="stat-box__label">Sessions / week</span>
      </div>
      <div class="stat-box">
        <span class="stat-box__num">${total}</span>
        <span class="stat-box__label">Total sessions</span>
      </div>
    </div>`;

  schedEl.innerHTML = schedHtml;
}

// Restart
document.getElementById('restartBtn').addEventListener('click', () => {
  state = { level: null, board: null, current: null, target: null, coverage: null, weakAreas: [], hours: null, weeks: 12 };
  document.getElementById('weeksRange').value = 12;
  document.getElementById('weeksVal').textContent = '12';
  document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('grade-btn--selected','grade-btn--invalid'));
  document.querySelectorAll('.coverage-btn').forEach(b => b.classList.remove('coverage-btn--selected'));
  document.querySelectorAll('.weakness-btn').forEach(b => b.classList.remove('weakness-btn--selected'));
  document.querySelectorAll('.hours-btn').forEach(b => b.classList.remove('hours-btn--selected'));
  document.getElementById('step3Next').disabled = true;
  document.getElementById('generateBtn').disabled = true;
  showStep('step1', 1, 'Step 1 of 6');
});

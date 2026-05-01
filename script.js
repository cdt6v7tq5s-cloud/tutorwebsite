// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

// Mobile menu
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open'); navToggle.classList.remove('open'); document.body.style.overflow = '';
}));

// Scroll animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Contact form — Formspree AJAX
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...'; btn.disabled = true;
  try {
    const res = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { 'Accept': 'application/json' } });
    if (res.ok) { btn.textContent = 'Sent — I will be in touch within 24 hours.'; btn.style.background = '#2d6a4f'; contactForm.reset(); }
    else { btn.textContent = 'Something went wrong — please email directly.'; btn.style.background = '#b91c1c'; btn.disabled = false; }
  } catch { btn.textContent = 'Could not send — please email directly.'; btn.style.background = '#b91c1c'; btn.disabled = false; }
});


// ==========================================
// STUDY PLAN GENERATOR
// ==========================================

const topicData = {
  GCSE: {
    AQA: [
      { name: 'Natural Hazards', skills: ['case-studies','extended-writing'],
        subs: ['Tectonic hazards — earthquake and volcanic case studies with located facts and figures','Tropical storms — formation, structure, and named storm case study','UK extreme weather and climate change responses','Climate change — evidence, causes, and management'] },
      { name: 'The Living World', skills: ['case-studies','exam-technique'],
        subs: ['Ecosystems — nutrient cycling and food chains, small-scale UK example','Tropical rainforests — characteristics, deforestation causes, sustainable management','Hot deserts — opportunities, challenges, and desertification'] },
      { name: 'Physical Landscapes in the UK', skills: ['diagram-skills','extended-writing'],
        subs: ['Coastal processes — erosion, transport, deposition and landform formation','River processes — drainage basins, flood hydrographs, and landforms','Glacial landscapes — erosion and depositional features','Management strategies — hard/soft engineering for each landscape'] },
      { name: 'Urban Issues and Challenges', skills: ['case-studies','data-skills'],
        subs: ['Global urbanisation trends and LIC/NEE city case study in depth','UK city — urban change, deprivation patterns, and regeneration schemes','Sustainable urban living — transport, waste, green spaces'] },
      { name: 'The Changing Economic World', skills: ['case-studies','data-skills'],
        subs: ['Measuring development — HDI, GNI, literacy rate comparisons and limitations','Causes of uneven development and strategies to close the gap','NEE case study — economic growth and its social and environmental impacts','UK economy — post-industrial change and regional differences'] },
      { name: 'Resource Management', skills: ['extended-writing','exam-technique'],
        subs: ['Global resource consumption patterns and inequality between countries','Food, water, or energy insecurity — causes, consequences, and management strategies','UK energy mix and transition towards renewables'] },
      { name: 'Geographical Skills', skills: ['data-skills','diagram-skills'],
        subs: ['Graphical skills — completing and interpreting a range of graphs and maps','Statistical skills — percentages, means, medians, and identifying patterns','Ordnance Survey and atlas map interpretation'] },
      { name: 'Paper 3 Issue Evaluation', skills: ['exam-technique','extended-writing'], isExamSkill: true,
        subs: ['Pre-release resource booklet — annotating and pulling out evidence','Structuring 9-mark and 12-mark responses using sources','Reaching and justifying a decision with balanced counter-argument'] }
    ],
    Edexcel: [
      { name: 'Hazardous Earth', skills: ['case-studies','extended-writing'],
        subs: ['Global atmospheric circulation and its link to climate','Tropical storm formation, structure, and named case study with data','Tectonic hazards — plate margins and contrasting earthquake/volcanic case studies','Managing hazard risk — prediction, prevention, and international aid'] },
      { name: 'Development Dynamics', skills: ['case-studies','extended-writing'],
        subs: ['Measuring development — GNI, HDI, and limitations of each measure','Theories of development — Rostow, dependency theory','NEE case study — India: causes of growth and social/environmental consequences','Top-down vs bottom-up development strategies compared'] },
      { name: 'Challenges of an Urbanising World', skills: ['case-studies','data-skills'],
        subs: ['LIC/NEE city case study — rapid growth, opportunities, and challenges in depth','Urban sprawl, squatter settlements, and informal economy','UK city case study — regeneration strategies, success and criticism'] },
      { name: 'Rivers, Floods and Management', skills: ['diagram-skills','extended-writing'],
        subs: ['River processes — erosion, transportation, deposition, and energy','Landform formation — meanders, ox-bow lakes, levées, deltas','Flood risk — physical and human factors compared','Flood management — hard and soft engineering with named examples'] },
      { name: 'UK in the 21st Century', skills: ['data-skills','exam-technique'],
        subs: ["UK's changing economy — deindustrialisation and growth of the service sector",'UK population change — ageing population, migration patterns, and impacts','UK connectivity — transport infrastructure and digital divide'] },
      { name: 'Oceans on the Edge', skills: ['case-studies','extended-writing'],
        subs: ['Ocean ecosystems — coral reef and mangrove structure and value','Threats to ocean health — acidification, plastic pollution, overfishing','Ocean governance — international agreements and their effectiveness'] },
      { name: 'Geographical Skills', skills: ['data-skills','diagram-skills'],
        subs: ['Graphical and cartographic skills — OS maps, choropleth, proportional symbols','Statistical analysis — quartiles, Spearman rank correlation','Fieldwork methodology — primary data collection and analysis'] },
      { name: 'Paper 3 Decision Making Exercise', skills: ['exam-technique','extended-writing'], isExamSkill: true,
        subs: ['Interpreting the resource booklet under exam conditions','Structuring a justified decision with supporting evidence from sources','Evaluating options — weighing costs, benefits, and trade-offs'] }
    ]
  },
  'A-Level': {
    AQA: [
      { name: 'Water and Carbon Cycles', skills: ['extended-writing','diagram-skills'],
        subs: ['Water cycle — stores, flows, and the drainage basin as a system','Carbon cycle — natural stores, fluxes, and residence times','Human impacts on both cycles — deforestation, fossil fuels, urbanisation','Feedbacks, tipping points, and implications for climate change'] },
      { name: 'Coastal Systems and Landscapes', skills: ['case-studies','extended-writing','diagram-skills'],
        subs: ['Littoral zone as a system — sediment cells and budget','Erosion, transport, and deposition — landform formation in detail','Coastal flooding risk — physical and human contributing factors','Hard vs soft engineering and managed retreat — named UK case studies'] },
      { name: 'Hazards', skills: ['case-studies','extended-writing'],
        subs: ['Plate tectonics — theory, evidence, and margin characteristics','Seismic and volcanic hazard profiles — contrasting case studies by development','Tropical storms and drought — formation, distribution, and management','Disaster risk equation — vulnerability, capacity, resilience'] },
      { name: 'Global Systems and Governance', skills: ['extended-writing','exam-technique'],
        subs: ['Globalisation — causes, flows of capital/labour/information, and uneven outcomes','Global commons — Antarctica and high seas governance as case studies','Trade patterns and the power of TNCs','Evaluating the effectiveness of global governance institutions'] },
      { name: 'Changing Places', skills: ['case-studies','data-skills','extended-writing'],
        subs: ['Place meaning and identity — insider vs outsider perspectives','How places change — economic, demographic, and cultural shifts over time','Quantitative and qualitative research methods for studying place','Contrasting place case studies — one local, one distant'] },
      { name: 'Ecosystems under Stress', skills: ['case-studies','extended-writing'],
        subs: ['Ecosystems as systems — energy flows and nutrient cycling','Biome characteristics — tropical rainforest and one further option','Anthropogenic threats — fragmentation, invasive species, climate change','Conservation strategies — protected areas, rewilding, international agreements'] },
      { name: 'Contemporary Urban Environments', skills: ['case-studies','data-skills'],
        subs: ['Urbanisation — drivers, patterns, and contrasting rates of growth','Urban social and economic inequality — causes and spatial expression','Regeneration strategies — gentrification, place marketing, community-led','Urban ecological footprint and routes to sustainable cities'] },
      { name: 'Resource Security', skills: ['extended-writing','exam-technique'],
        subs: ['Global resource consumption — patterns and drivers of rising demand','Water, food, and energy insecurity — causes and far-reaching consequences','Resource stewardship — sustainable and technological management strategies','Geopolitics of resource control and conflict'] },
      { name: 'NEA Independent Investigation', skills: ['data-skills','extended-writing'], isCoursework: true,
        subs: ['Research question — specificity, link to geographical theory, and testability','Methodology — primary data collection design with risk assessment','Data presentation — varied, appropriate graphical and cartographic techniques','Analysis and conclusion — statistical testing and linking to wider context'] },
      { name: 'Paper 3 Synoptic Skills', skills: ['exam-technique','extended-writing'], isExamSkill: true,
        subs: ['Synoptic thinking — drawing links across physical and human topics','Unseen resource analysis — applying concepts to unfamiliar contexts','Decision making — structured evaluation of options with justified conclusion','20-mark extended writing under timed conditions'] }
    ],
    Edexcel: [
      { name: 'Tectonic Processes and Hazards', skills: ['case-studies','extended-writing'],
        subs: ['Plate margin types — characteristics and landforms at each','Earthquake hazard — shaking, liquefaction, tsunamis, and vulnerability','Volcanic hazard — eruption types, pyroclastic flows, and lahars','Contrasting case studies — two events in different development contexts','Park model, Hazard Management Cycle, and risk reduction strategies'] },
      { name: 'Landscape Systems', skills: ['diagram-skills','extended-writing','case-studies'],
        subs: ['Landscapes as open systems — stores, flows, inputs, outputs, and equilibrium','Landform formation — erosion and deposition processes in detail','Systems change — human activity and climate as drivers of disturbance','Management strategies — hard engineering, soft engineering, managed retreat'] },
      { name: 'Globalisation', skills: ['case-studies','extended-writing'],
        subs: ['Drivers of globalisation — technology, FDI, TNCs, trade liberalisation','Flows of capital, labour, technology, and culture — winners and losers','TNC case study — global reach, local economic and environmental impacts','Critiques of globalisation — inequality, cultural erosion, nationalism'] },
      { name: 'Shaping Places', skills: ['case-studies','data-skills','extended-writing'],
        subs: ['Place identity — economic, demographic, and cultural characteristics','Why places need to change — deindustrialisation, deprivation, population shift','Regeneration strategies — property-led, rebranding, community-led — with examples','Evaluating regeneration — who benefits, who is displaced, long-term success'] },
      { name: 'Water Cycle and Water Insecurity', skills: ['extended-writing','case-studies'],
        subs: ['Global water cycle — natural stores, flows, and residence times','Physical and human drivers of water insecurity','Management strategies — large-scale transfers, dams, desalination, conservation','Evaluating sustainability of different water management approaches'] },
      { name: 'Carbon Cycle and Energy Security', skills: ['extended-writing','exam-technique'],
        subs: ['Carbon stores and flows — natural and anthropogenic fluxes','Global energy mix — fossil fuels, renewables, nuclear, and geopolitics','Energy insecurity — causes, consequences, and national responses','Low-carbon transition — feasibility, barriers, and global equity'] },
      { name: 'Superpowers', skills: ['extended-writing','case-studies'],
        subs: ['Defining superpower status — economic, military, cultural, and technological indicators','Emerging powers — China, India, and the BRICS group','Geopolitical competition — spheres of influence and proxy conflicts','Global governance challenges in a multipolar world'] },
      { name: 'Health, Human Rights and Intervention', skills: ['case-studies','extended-writing'],
        subs: ['Global health patterns — causes and consequences of health inequalities','Human rights frameworks — the Universal Declaration and enforcement mechanisms','Intervention types — military, humanitarian, and economic, with case studies','Evaluating intervention — success, legitimacy, and long-term outcomes'] },
      { name: 'NEA Independent Investigation', skills: ['data-skills','extended-writing'], isCoursework: true,
        subs: ['Research question — geographical theory, spatial scale, and testability','Primary data collection — rigorous methodology and risk management','Data presentation — varied and appropriate techniques','Critical analysis — statistical testing and linking to wider geographical literature'] },
      { name: 'Paper 3 Synoptic Skills', skills: ['exam-technique','extended-writing'], isExamSkill: true,
        subs: ['Synoptic links — connecting physical and human topics across the spec','Fieldwork data questions — interpreting and evaluating primary data','Unseen stimulus — applying knowledge to unfamiliar geographical contexts','Extended writing under pressure — planning, structuring, evaluating'] }
    ]
  }
};

const skillLabels = {
  'extended-writing': 'Extended writing',
  'case-studies':     'Case study knowledge',
  'data-skills':      'Data & graph skills',
  'diagram-skills':   'Diagram technique',
  'exam-technique':   'Exam technique',
  'content':          'Content recall',
};

const gcseGrades   = ['1','2','3','4','5','6','7','8','9'];
const alevelGrades = ['U','E','D','C','B','A','A*'];

let state = { level: null, board: null, current: null, target: null, confidence: {}, weakAreas: [], hours: null, weeks: 12 };

function showStep(id, dotNum, label) {
  document.querySelectorAll('.planner__step').forEach(s => s.classList.add('planner__step--hidden'));
  document.getElementById(id).classList.remove('planner__step--hidden');
  document.querySelectorAll('.planner__dot').forEach((d, i) => d.classList.toggle('planner__dot--active', i < dotNum));
  document.getElementById('plannerLabel').textContent = label;
}

// Step 1 — Level
document.querySelectorAll('.level-btn').forEach(btn => btn.addEventListener('click', () => {
  state.level = btn.dataset.value;
  state.board = null; state.current = null; state.target = null; state.confidence = {};
  buildGradeOptions();
  showStep('step2', 2, 'Step 2 of 6');
}));

// Step 2 — Board
document.querySelectorAll('.board-opt').forEach(btn => btn.addEventListener('click', () => {
  state.board = btn.dataset.value;
  showStep('step3', 3, 'Step 3 of 6');
}));

// Step 3 — Grades
function buildGradeOptions() {
  const grades = state.level === 'GCSE' ? gcseGrades : alevelGrades;
  ['currentGrades','targetGrades'].forEach(id => {
    const el = document.getElementById(id);
    el.innerHTML = '';
    grades.forEach(g => {
      const b = document.createElement('button');
      b.className = 'grade-btn'; b.dataset.value = g; b.textContent = g;
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
    document.querySelectorAll('#targetGrades .grade-btn').forEach(b =>
      b.classList.toggle('grade-btn--invalid', grades.indexOf(b.dataset.value) < ci));
  }
  document.getElementById('step3Next').disabled = !(state.current && state.target);
}

document.getElementById('step3Next').addEventListener('click', () => {
  buildConfidenceStep();
  showStep('step4', 4, 'Step 4 of 6');
});

// Step 4 — Per-topic confidence rating
function buildConfidenceStep() {
  const list = document.getElementById('confList');
  list.innerHTML = '';
  state.confidence = {};
  const topics = (topicData[state.level] || {})[state.board] || [];

  topics.forEach(t => {
    const row = document.createElement('div');
    row.className = 'conf-row';
    row.id = `conf-row-${slugify(t.name)}`;

    const levels = [
      { val: 'not-covered', label: 'Not covered', cls: 'conf-btn--active-not' },
      { val: 'low',         label: 'Low',         cls: 'conf-btn--active-low' },
      { val: 'medium',      label: 'Medium',       cls: 'conf-btn--active-med' },
      { val: 'high',        label: 'High',         cls: 'conf-btn--active-hi'  },
    ];

    row.innerHTML = `<span class="conf-topic">${t.name}</span><div class="conf-btns" data-topic="${t.name}"></div>`;
    const btnsEl = row.querySelector('.conf-btns');

    levels.forEach(l => {
      const b = document.createElement('button');
      b.className = 'conf-btn'; b.dataset.val = l.val; b.dataset.activeCls = l.cls;
      b.textContent = l.label;
      b.addEventListener('click', () => setConfidence(t.name, l.val, btnsEl, row));
      btnsEl.appendChild(b);
    });

    list.appendChild(row);
  });

  updateConfProgress();
}

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]/g, '-'); }

function setConfidence(topicName, val, btnsEl, row) {
  state.confidence[topicName] = val;
  btnsEl.querySelectorAll('.conf-btn').forEach(b => {
    b.classList.remove('conf-btn--active-not','conf-btn--active-low','conf-btn--active-med','conf-btn--active-hi');
    if (b.dataset.val === val) b.classList.add(b.dataset.activeCls);
  });
  row.className = `conf-row conf-row--${val}`;
  updateConfProgress();
}

function setAllConfidence(val) {
  const topics = (topicData[state.level] || {})[state.board] || [];
  topics.forEach(t => {
    const row = document.getElementById(`conf-row-${slugify(t.name)}`);
    if (!row) return;
    const btnsEl = row.querySelector('.conf-btns');
    setConfidence(t.name, val, btnsEl, row);
  });
}

function updateConfProgress() {
  const topics = (topicData[state.level] || {})[state.board] || [];
  const total  = topics.length;
  const rated  = Object.keys(state.confidence).length;
  const pct    = total ? (rated / total) * 100 : 0;
  document.getElementById('confFill').style.width = pct + '%';
  document.getElementById('confLabel').textContent = `${rated} of ${total} topics rated`;
  document.getElementById('step4Next').disabled = rated < total;
}

// Quick-set buttons
document.querySelectorAll('.quickset-btn').forEach(btn => btn.addEventListener('click', () => setAllConfidence(btn.dataset.val)));

document.getElementById('step4Next').addEventListener('click', () => showStep('step5', 5, 'Step 5 of 6'));

// Step 5 — Weaknesses (multi-select, optional)
document.querySelectorAll('.weakness-btn').forEach(btn => btn.addEventListener('click', () => {
  btn.classList.toggle('weakness-btn--selected');
  const v = btn.dataset.value;
  state.weakAreas = btn.classList.contains('weakness-btn--selected')
    ? [...state.weakAreas, v]
    : state.weakAreas.filter(w => w !== v);
}));
document.getElementById('step5Next').addEventListener('click', () => showStep('step6', 6, 'Step 6 of 6'));

// Step 6 — Hours + weeks
document.querySelectorAll('.hours-btn').forEach(btn => btn.addEventListener('click', () => {
  state.hours = parseInt(btn.dataset.value);
  document.querySelectorAll('.hours-btn').forEach(b => b.classList.remove('hours-btn--selected'));
  btn.classList.add('hours-btn--selected');
  document.getElementById('generateBtn').disabled = false;
}));

const weeksRange = document.getElementById('weeksRange');
const weeksVal   = document.getElementById('weeksVal');
weeksRange.addEventListener('input', () => { state.weeks = parseInt(weeksRange.value); weeksVal.textContent = state.weeks; });

document.querySelectorAll('.planner__back').forEach(btn => btn.addEventListener('click', () =>
  showStep(btn.dataset.target, parseInt(btn.dataset.dot), btn.dataset.lbl)));

document.getElementById('generateBtn').addEventListener('click', () => {
  buildResult();
  showStep('planResult', 6, 'Your plan');
  document.getElementById('plannerLabel').textContent = 'Your personalised plan';
});


// ==========================================
// RESULT BUILDER — confidence-driven
// ==========================================

function buildResult() {
  const grades = state.level === 'GCSE' ? gcseGrades : alevelGrades;
  const gap    = grades.indexOf(state.target) - grades.indexOf(state.current);
  const raw    = (topicData[state.level] || {})[state.board] || [];

  // Map confidence → priority
  const confPriority = { 'not-covered': 'learn', low: 'high', medium: 'medium', high: 'refine' };

  const adjusted = raw.map(t => {
    // Fixed priorities for exam/coursework topics
    if (t.isExamSkill)   return { ...t, p: 'exam',       boost: false };
    if (t.isCoursework)  return { ...t, p: 'coursework', boost: false };

    // Confidence is the primary driver
    const conf = state.confidence[t.name] || 'medium';
    let p = confPriority[conf] || 'medium';

    // Weakness boost: if this topic uses a skill the student struggles with, and it's not already top priority
    const weakMatch = state.weakAreas.some(w => w === 'content' || (t.skills || []).includes(w));
    const boosted   = weakMatch && (p === 'medium' || p === 'refine');
    if (weakMatch && p === 'medium') p = 'high';
    if (weakMatch && p === 'refine') p = 'medium';

    return { ...t, p, conf, boosted };
  });

  // Sort: learn → high → medium → refine → exam → coursework
  const order = { learn: 0, high: 1, medium: 2, refine: 3, exam: 4, coursework: 5 };
  adjusted.sort((a, b) => order[a.p] - order[b.p]);

  // Sessions based on hours available + overall gap
  const perWeek = state.hours === 1 ? 1 : state.hours === 3 ? (gap >= 2 ? 2 : 1) : 2;
  const total   = state.weeks * perWeek;
  const timeShort = gap >= 3 && state.hours === 1 && state.weeks < 14;

  // Count priorities for summary
  const learnCount  = adjusted.filter(t => t.p === 'learn').length;
  const highCount   = adjusted.filter(t => t.p === 'high').length;
  const refineCount = adjusted.filter(t => t.p === 'refine').length;

  // Meta
  document.getElementById('resultMeta').innerHTML =
    `<span class="result__tag">${state.level}</span>
     <span class="result__tag">${state.board}</span>
     <span class="result__tag">${state.current} → ${state.target}</span>
     <span class="result__tag">${state.weeks} weeks</span>`;

  // Title
  document.getElementById('resultTitle').textContent =
    learnCount > 3 ? 'Topics to learn and revise — your full plan' :
    gap <= 0       ? 'Consolidating for top marks' :
    highCount >= 4 ? `Focused revision plan to reach ${state.target}` :
                    `Targeted plan — ${state.target} from ${state.current}`;

  // Summary — personalised to what the confidence data shows
  let summary = '';
  if (learnCount > 0 && highCount > 0)
    summary = `Your ratings show ${learnCount} topic${learnCount > 1 ? 's' : ''} not yet covered and ${highCount} where confidence is low — these are addressed first. `;
  else if (learnCount > 0)
    summary = `You have ${learnCount} topic${learnCount > 1 ? 's' : ''} still to cover — these are flagged as Learn first and sit at the top of your plan. `;
  else if (highCount > 0)
    summary = `Based on your ratings, ${highCount} topic${highCount > 1 ? 's' : ''} need focused revision work. `;

  if (refineCount >= 3)
    summary += `You are already confident on ${refineCount} topics — these sit at the bottom for a light consolidation pass rather than full revision.`;
  else if (gap <= 0)
    summary += `The grade gap is small — the focus is on consistency and eliminating the small errors that cost marks at the top band.`;

  document.getElementById('resultSummary').textContent = summary.trim() || `Your plan is built directly from your confidence ratings — topics are ordered so your time is spent exactly where it is needed most.`;

  // Build topic list
  const topicsEl = document.getElementById('resultTopics');
  topicsEl.innerHTML = '';

  // Warning
  if (timeShort) {
    const warn = document.createElement('div');
    warn.className = 'result__warning';
    warn.textContent = `With ${state.weeks} weeks and 1–2 hours per week, be selective. Focus only on the Priority and Learn topics — attempting to cover everything risks spreading revision too thin.`;
    topicsEl.appendChild(warn);
  }

  // Skills focus strip — driven by weak areas + high-priority topic skills
  const skillFreq = {};
  adjusted.filter(t => t.p === 'learn' || t.p === 'high').slice(0, 5).forEach(t => {
    (t.skills || []).forEach(s => { skillFreq[s] = (skillFreq[s] || 0) + 1; });
  });
  state.weakAreas.forEach(w => { if (skillLabels[w]) skillFreq[w] = (skillFreq[w] || 0) + 4; });
  const topSkills = Object.entries(skillFreq).sort((a,b) => b[1]-a[1]).slice(0,3).map(e => e[0]);

  const skillDescs = {
    'extended-writing': gap >= 2
      ? `Build structured answers with a clear argument, evidence, and conclusion — practise under timed conditions from week one`
      : `Consistently reach the top band — evaluative language, balanced argument, and a decisive conclusion`,
    'case-studies': gap >= 2
      ? `Drill case study facts: named location, key statistics, and dates — vague answers lose marks quickly`
      : `Apply case study detail precisely to the question asked — don't just recall, deploy`,
    'data-skills': `Interpret graphs, maps, and tables accurately — describe trends, calculate changes, use geographical vocabulary`,
    'diagram-skills': `Annotate diagrams with processes and labels — bare sketches earn few marks`,
    'exam-technique': gap >= 2
      ? `Understand command words — describe, explain, assess, and evaluate demand different types of response`
      : `Fine-tune top-band technique: balance, evidence, synoptic links, evaluative conclusion`,
    'content': gap >= 2
      ? `Use active recall — practice questions and flashcards — rather than passive re-reading`
      : `Identify specific content gaps from your mock results and target those rather than covering everything again`,
  };

  if (topSkills.length) {
    const strip = document.createElement('div');
    strip.className = 'result__skills-strip';
    const label = state.weakAreas.length ? 'Key focus areas — based on your answers' : 'Key focus areas for your priority topics';
    strip.innerHTML = `<p class="result__skills-label">${label}</p>`;
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
  listTitle.textContent = 'Your topics — ordered by where to focus first';
  topicsEl.appendChild(listTitle);

  const badgeText = { learn: 'Learn first', high: 'Priority', medium: 'Important', refine: 'Consolidate', exam: 'Exam skill', coursework: 'Coursework' };

  adjusted.forEach((t, i) => {
    const wrap = document.createElement('div');
    wrap.className = `result__topic-block result__topic-block--${t.p}`;
    wrap.style.animationDelay = `${i * 0.06}s`;

    const boostTag = t.boosted ? `<span class="topic-badge topic-badge--boost">Your weak area</span>` : '';
    const confNote = t.conf && !t.isExamSkill && !t.isCoursework
      ? `<span class="topic-conf-note">You rated this: ${t.conf.replace('-', ' ')}</span>` : '';

    wrap.innerHTML = `
      <div class="result__topic-head">
        <span class="topic-badge topic-badge--${t.p}">${badgeText[t.p]}</span>
        ${boostTag}
        <strong class="topic-name">${t.name}</strong>
        ${confNote}
      </div>
      <ul class="topic-subs">${t.subs.map(s => `<li>${s}</li>`).join('')}</ul>`;
    topicsEl.appendChild(wrap);
  });

  // Schedule + stats
  const schedEl = document.getElementById('resultStats');
  const coreTopics = adjusted.filter(t => t.p !== 'coursework');
  let weekCursor = 1;
  let schedHtml = `<div class="result__schedule"><p class="result__schedule-label">Suggested schedule</p>`;

  coreTopics.forEach(t => {
    if (weekCursor > state.weeks) return;
    const weeksNeeded = t.p === 'learn' || t.p === 'high' ? 2 : 1;
    const wEnd  = Math.min(weekCursor + weeksNeeded - 1, state.weeks);
    const label = wEnd > weekCursor ? `Wk ${weekCursor}–${wEnd}` : `Wk ${weekCursor}`;
    schedHtml += `<div class="sched-row sched-row--${t.p}">
      <span class="sched-wk">${label}</span>
      <span class="sched-topic">${t.name}</span>
    </div>`;
    weekCursor = wEnd + 1;
  });

  schedHtml += `</div>
    <div class="result__stat-boxes">
      <div class="stat-box"><span class="stat-box__num">${perWeek}</span><span class="stat-box__label">Sessions / week</span></div>
      <div class="stat-box"><span class="stat-box__num">${total}</span><span class="stat-box__label">Total sessions</span></div>
    </div>`;
  schedEl.innerHTML = schedHtml;
}

// Restart
document.getElementById('restartBtn').addEventListener('click', () => {
  state = { level: null, board: null, current: null, target: null, confidence: {}, weakAreas: [], hours: null, weeks: 12 };
  document.getElementById('weeksRange').value = 12; document.getElementById('weeksVal').textContent = '12';
  document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('grade-btn--selected','grade-btn--invalid'));
  document.querySelectorAll('.weakness-btn').forEach(b => b.classList.remove('weakness-btn--selected'));
  document.querySelectorAll('.hours-btn').forEach(b => b.classList.remove('hours-btn--selected'));
  document.getElementById('step3Next').disabled = true;
  document.getElementById('generateBtn').disabled = true;
  showStep('step1', 1, 'Step 1 of 6');
});

// Nav scroll state
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

// Scroll-in animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
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


// =====================================
// STUDY PLAN GENERATOR
// =====================================

// Each topic has:
//   name    — display name
//   p       — base priority: 'high' | 'medium'
//   subs    — specific focus points shown in the result
//   skills  — which skill types this topic tests

const topics = {
  GCSE: {
    AQA: [
      {
        name: 'Natural Hazards',
        p: 'high',
        subs: ['Tectonic hazards — earthquake and volcanic case studies with located detail', 'Tropical storms — formation, structure, and named storm case study', 'UK extreme weather events and responses', 'Climate change — evidence, causes, and management strategies'],
        skills: ['case-studies', 'extended-writing']
      },
      {
        name: 'The Living World',
        p: 'high',
        subs: ['Ecosystems — nutrient cycling, food chains, small-scale UK example', 'Tropical rainforests — characteristics, deforestation causes, and sustainable management', 'Hot deserts — opportunities, challenges, and desertification'],
        skills: ['case-studies', 'exam-technique']
      },
      {
        name: 'Physical Landscapes in the UK',
        p: 'high',
        subs: ['Coastal processes — erosion, transportation, deposition landforms', 'River processes — drainage basins, flood hydrographs, landform formation', 'Glacial landscapes — erosion and depositional landforms', 'Management strategies for each landscape'],
        skills: ['diagram-skills', 'extended-writing']
      },
      {
        name: 'Urban Issues and Challenges',
        p: 'high',
        subs: ['Global urbanisation trends and LIC/NEE city case study', 'UK city — urban change, deprivation, and regeneration', 'Urban sustainability — transport, waste, and housing'],
        skills: ['case-studies', 'data-skills']
      },
      {
        name: 'The Changing Economic World',
        p: 'medium',
        subs: ['Measuring development — HDI, GNI, literacy rate comparisons', 'Causes of uneven development and strategies to reduce the gap', 'NEE case study — economic development and its impacts', 'Changes in the UK economy — post-industrial landscape'],
        skills: ['case-studies', 'data-skills']
      },
      {
        name: 'Resource Management',
        p: 'medium',
        subs: ['Global resource consumption patterns and inequality', 'Food, water, or energy insecurity — causes and management', 'UK energy mix and move towards renewables'],
        skills: ['extended-writing', 'exam-technique']
      },
      {
        name: 'Geographical Skills',
        p: 'medium',
        subs: ['Graphical skills — completing and interpreting graphs and maps', 'Statistical skills — percentages, means, medians', 'Ordnance Survey and atlas map skills'],
        skills: ['data-skills', 'diagram-skills']
      },
      {
        name: 'Paper 3 Issue Evaluation',
        p: 'exam',
        subs: ['Pre-release resource booklet — annotating and analysing sources', 'Structuring 9-mark and 12-mark responses with evidence', 'Reaching and justifying a decision with counter-arguments'],
        skills: ['exam-technique', 'extended-writing']
      }
    ],
    Edexcel: [
      {
        name: 'Hazardous Earth',
        p: 'high',
        subs: ['Global atmospheric circulation and climate patterns', 'Tropical storm formation, structure, and named case study', 'Tectonic hazards — plate margins, earthquake and volcanic case studies', 'Managing hazard risk — prediction, prevention, and aid'],
        skills: ['case-studies', 'extended-writing']
      },
      {
        name: 'Development Dynamics',
        p: 'high',
        subs: ['Measuring development — GNI, HDI, and the limitations of each measure', 'Theories of development — Rostow, dependency', 'NEE case study — India: economic growth and its social consequences', 'Top-down vs bottom-up development strategies'],
        skills: ['case-studies', 'extended-writing']
      },
      {
        name: 'Challenges of an Urbanising World',
        p: 'high',
        subs: ['LIC/NEE city case study — growth, opportunities, and challenges', 'Urban sprawl and squatter settlements', 'UK city case study — regeneration strategies and their success'],
        skills: ['case-studies', 'data-skills']
      },
      {
        name: 'Rivers, Floods and Management',
        p: 'high',
        subs: ['River processes — erosion, transportation, deposition', 'Landform formation — meanders, ox-bow lakes, deltas', 'Flood risk — physical and human factors', 'Flood management — hard and soft engineering case studies'],
        skills: ['diagram-skills', 'extended-writing']
      },
      {
        name: 'UK in the 21st Century',
        p: 'medium',
        subs: ["UK's changing economy — deindustrialisation and the rise of services", 'UK population change — ageing population and migration', 'UK connectivity — transport and digital infrastructure'],
        skills: ['data-skills', 'exam-technique']
      },
      {
        name: 'Oceans on the Edge',
        p: 'medium',
        subs: ['Ocean ecosystems — coral reefs and mangroves', 'Threats to ocean health — acidification, pollution, overfishing', 'Ocean governance — international agreements and their effectiveness'],
        skills: ['case-studies', 'extended-writing']
      },
      {
        name: 'Geographical Skills',
        p: 'medium',
        subs: ['Graphical and cartographic skills', 'Statistical analysis — quartiles, Spearman rank', 'Fieldwork methodology — data collection and analysis'],
        skills: ['data-skills', 'diagram-skills']
      },
      {
        name: 'Paper 3 Decision Making Exercise',
        p: 'exam',
        subs: ['Interpreting the resource booklet under exam conditions', 'Structuring a justified decision with supporting evidence', 'Evaluating options — weighing costs, benefits, and trade-offs'],
        skills: ['exam-technique', 'extended-writing']
      }
    ]
  },
  'A-Level': {
    AQA: [
      {
        name: 'Water and Carbon Cycles',
        p: 'high',
        subs: ['Water cycle stores and flows — drainage basin as a system', 'Carbon cycle — natural stores, fluxes, and residence times', 'Human impacts on both cycles — deforestation, fossil fuels, urbanisation', 'Climate change feedbacks and tipping points'],
        skills: ['extended-writing', 'diagram-skills']
      },
      {
        name: 'Coastal Systems and Landscapes',
        p: 'high',
        subs: ['Littoral zone as a system — sediment budget and cells', 'Erosion, transportation, and deposition landform formation in detail', 'Coastal flooding risk — physical and human factors', 'Hard vs soft engineering — named case studies with evaluation'],
        skills: ['case-studies', 'extended-writing', 'diagram-skills']
      },
      {
        name: 'Hazards',
        p: 'high',
        subs: ['Plate tectonics — theory, evidence, and margin characteristics', 'Seismic and volcanic hazard profiles — contrasting case studies', 'Tropical storm and drought hazards — formation and impacts', 'Disaster risk equation — vulnerability, capacity, and resilience'],
        skills: ['case-studies', 'extended-writing']
      },
      {
        name: 'Global Systems and Governance',
        p: 'high',
        subs: ['Globalisation — causes, flows, and uneven outcomes', 'Global commons — Antarctica and the high seas as case studies', 'International trade patterns and the role of TNCs', 'Global governance — effectiveness of the UN, WTO, and trade blocs'],
        skills: ['extended-writing', 'exam-technique']
      },
      {
        name: 'Changing Places',
        p: 'high',
        subs: ['Place meaning and identity — insider vs outsider perspectives', 'How places change — economic, demographic, and cultural shifts', 'Quantitative and qualitative methods for studying place', 'Contrasting place case studies — local and distant'],
        skills: ['case-studies', 'data-skills', 'extended-writing']
      },
      {
        name: 'Ecosystems under Stress',
        p: 'medium',
        subs: ['Ecosystems as open systems — energy flows and nutrient cycling', 'Biome characteristics — tropical rainforest and one other', 'Anthropogenic threats — fragmentation, invasive species, climate change', 'Conservation strategies — protected areas, international agreements'],
        skills: ['case-studies', 'extended-writing']
      },
      {
        name: 'Contemporary Urban Environments',
        p: 'medium',
        subs: ['Urbanisation drivers — rural-urban migration and natural increase', 'Urban social inequality — causes and spatial patterns', 'Regeneration strategies — gentrification vs community-led approaches', 'Urban ecological footprint and sustainable futures'],
        skills: ['case-studies', 'data-skills']
      },
      {
        name: 'Resource Security',
        p: 'medium',
        subs: ['Global resource consumption — patterns and drivers of demand', 'Water, food, and energy insecurity — causes and consequences', 'Resource stewardship — sustainable management approaches', 'Geopolitics of resource control'],
        skills: ['extended-writing', 'exam-technique']
      },
      {
        name: 'NEA Independent Investigation',
        p: 'coursework',
        subs: ['Research question — specificity, geographical theory, and feasibility', 'Methodology — primary data collection with risk assessment', 'Data presentation — appropriate graphical and cartographic techniques', 'Analysis and conclusion — linking findings to theory and wider context'],
        skills: ['data-skills', 'extended-writing']
      },
      {
        name: 'Paper 3 Synoptic Skills',
        p: 'exam',
        subs: ['Synoptic thinking — drawing links across physical and human topics', 'Unseen resource analysis — applying geographical concepts to new contexts', 'Decision making — structured evaluation of options with justified conclusion', '20-mark essay under timed conditions — planning and structure'],
        skills: ['exam-technique', 'extended-writing']
      }
    ],
    Edexcel: [
      {
        name: 'Tectonic Processes and Hazards',
        p: 'high',
        subs: ['Plate margin types — characteristics and associated hazards', 'Earthquake hazard — ground shaking, liquefaction, tsunamis', 'Volcanic hazard — lava flows, pyroclastic density currents, lahars', 'Contrasting case studies — two tectonic events in different development contexts', 'Disaster risk and management — Park model and Hazard Management Cycle'],
        skills: ['case-studies', 'extended-writing']
      },
      {
        name: 'Landscape Systems (Coasts or Glaciated)',
        p: 'high',
        subs: ['Landscapes as open systems — stores, flows, and equilibrium', 'Landform formation — erosion and deposition processes in detail', 'Systems change over time — human and climate-driven disturbance', 'Management strategies — hard engineering, soft engineering, and managed retreat'],
        skills: ['diagram-skills', 'extended-writing', 'case-studies']
      },
      {
        name: 'Globalisation',
        p: 'high',
        subs: ['Drivers of globalisation — technology, finance, TNCs, trade agreements', 'Flows of capital, labour, and ideas — winners and losers', 'TNC case study — global reach, local impacts, and corporate power', 'Anti-globalisation movements and the rise of nationalism'],
        skills: ['case-studies', 'extended-writing']
      },
      {
        name: 'Shaping Places (Regeneration)',
        p: 'high',
        subs: ['Place identity — economic, demographic, and cultural characteristics', 'Why places need to change — deindustrialisation and decline', 'Regeneration strategies — property-led, rebranding, community-led', 'Evaluating regeneration success — who benefits and who loses?'],
        skills: ['case-studies', 'data-skills', 'extended-writing']
      },
      {
        name: 'Water Cycle and Water Insecurity',
        p: 'high',
        subs: ['Global water cycle — stores, flows, and residence times', 'Physical and human drivers of water insecurity', 'Water management strategies — large-scale transfers, dams, and desalination', 'Evaluating sustainability of water management approaches'],
        skills: ['extended-writing', 'case-studies']
      },
      {
        name: 'Carbon Cycle and Energy Security',
        p: 'medium',
        subs: ['Carbon stores and flows — natural and anthropogenic fluxes', 'Global energy mix — fossil fuels, renewables, and geopolitics', 'Energy insecurity — causes, consequences, and management', 'Low-carbon transition — feasibility and barriers'],
        skills: ['extended-writing', 'exam-technique']
      },
      {
        name: 'Superpowers',
        p: 'medium',
        subs: ['Defining superpower status — economic, military, cultural indicators', 'Emerging powers — China, India, and the BRICS', 'Geopolitical competition — spheres of influence and proxy conflicts', 'Global governance and the challenge of multipolarity'],
        skills: ['extended-writing', 'case-studies']
      },
      {
        name: 'Health, Human Rights and Intervention',
        p: 'medium',
        subs: ['Global health patterns — causes of health inequalities', 'Human rights frameworks — Universal Declaration and enforcement', 'Intervention — military, humanitarian, and economic', 'Case studies — specific interventions evaluated for success and legitimacy'],
        skills: ['case-studies', 'extended-writing']
      },
      {
        name: 'NEA Independent Investigation',
        p: 'coursework',
        subs: ['Research question — geographical theory, scale, and testability', 'Primary data collection — rigorous methodology and risk management', 'Data presentation — varied, appropriate techniques', 'Critical analysis — statistical testing and linking to wider geographical context'],
        skills: ['data-skills', 'extended-writing']
      },
      {
        name: 'Paper 3 Synoptic Skills',
        p: 'exam',
        subs: ['Synoptic links — connecting physical and human geography themes', 'Fieldwork data questions — interpreting and evaluating collected data', 'Unseen stimulus — applying knowledge to unfamiliar geographical contexts', 'Extended writing — planning, structuring, and evaluating under exam conditions'],
        skills: ['exam-technique', 'extended-writing']
      }
    ]
  }
};

const skillLabels = {
  'extended-writing': 'Extended writing',
  'case-studies':     'Case study depth',
  'data-skills':      'Data & graph skills',
  'diagram-skills':   'Diagram technique',
  'exam-technique':   'Exam technique',
};

const gcseGrades   = ['1','2','3','4','5','6','7','8','9'];
const alevelGrades = ['U','E','D','C','B','A','A*'];

let state = { level: null, board: null, current: null, target: null, weeks: 12 };

function showStep(id, dotNum, label) {
  document.querySelectorAll('.planner__step').forEach(s => s.classList.add('planner__step--hidden'));
  document.getElementById(id).classList.remove('planner__step--hidden');
  document.querySelectorAll('.planner__dot').forEach((d, i) => {
    d.classList.toggle('planner__dot--active', i < dotNum);
  });
  document.getElementById('plannerLabel').textContent = label;
}

document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.level = btn.dataset.value;
    state.board = null; state.current = null; state.target = null;
    buildGradeOptions();
    showStep('step2', 2, 'Step 2 of 4');
  });
});

document.querySelectorAll('.board-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    state.board = btn.dataset.value;
    showStep('step3', 3, 'Step 3 of 4');
  });
});

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
  const id = type === 'current' ? 'currentGrades' : 'targetGrades';
  document.querySelectorAll(`#${id} .grade-btn`).forEach(b => {
    b.classList.toggle('grade-btn--selected', b.dataset.value === value);
  });
  if (state.current) {
    const grades = state.level === 'GCSE' ? gcseGrades : alevelGrades;
    const ci = grades.indexOf(state.current);
    document.querySelectorAll('#targetGrades .grade-btn').forEach(b => {
      b.classList.toggle('grade-btn--invalid', grades.indexOf(b.dataset.value) < ci);
    });
  }
  document.getElementById('step3Next').disabled = !(state.current && state.target);
}

document.getElementById('step3Next').addEventListener('click', () => showStep('step4', 4, 'Step 4 of 4'));

const weeksRange = document.getElementById('weeksRange');
const weeksVal   = document.getElementById('weeksVal');
weeksRange.addEventListener('input', () => {
  state.weeks = parseInt(weeksRange.value);
  weeksVal.textContent = state.weeks;
});

document.querySelectorAll('.planner__back').forEach(btn => {
  btn.addEventListener('click', () => {
    showStep(btn.dataset.target, parseInt(btn.dataset.dot), btn.dataset.lbl);
  });
});

document.getElementById('generateBtn').addEventListener('click', () => {
  buildResult();
  showStep('planResult', 4, 'Your plan');
  document.getElementById('plannerLabel').textContent = 'Your personalised plan';
});

function buildResult() {
  const grades = state.level === 'GCSE' ? gcseGrades : alevelGrades;
  const ci     = grades.indexOf(state.current);
  const ti     = grades.indexOf(state.target);
  const gap    = ti - ci;

  const boardTopics = (topics[state.level][state.board] || []).slice();

  // Adjust priorities by gap
  const adjusted = boardTopics.map(t => {
    if (t.p === 'exam' || t.p === 'coursework') return { ...t };
    const p = gap <= 0 ? 'refine' : gap === 1 && t.p === 'medium' ? 'medium' : t.p;
    return { ...t, p };
  });

  const order = { high: 0, medium: 1, refine: 2, exam: 3, coursework: 4 };
  adjusted.sort((a, b) => order[a.p] - order[b.p]);

  const perWeek = gap >= 2 ? 2 : 1;
  const total   = state.weeks * perWeek;

  // ── Meta tags ──
  document.getElementById('resultMeta').innerHTML =
    `<span class="result__tag">${state.level}</span>
     <span class="result__tag">${state.board}</span>
     <span class="result__tag">${state.current} → ${state.target}</span>
     <span class="result__tag">${state.weeks} weeks</span>`;

  // ── Title ──
  const titles = [
    'Refining for top marks',
    `Closing the gap to ${state.target}`,
    `Targeting ${state.target} from ${state.current}`,
    `Building towards ${state.target}`,
  ];
  document.getElementById('resultTitle').textContent = gap <= 0 ? titles[0] : gap === 1 ? titles[1] : gap <= 3 ? titles[2] : titles[3];

  // ── Summary ──
  const summaries = {
    0: `You are at or above your target grade. The focus now is consistency — producing top-band answers reliably under timed conditions, and eliminating the small errors that cost marks.`,
    1: `A one-grade improvement is very achievable with focused work. The plan below targets the specific areas where marks are most commonly dropped at your current grade.`,
    2: `Closing a two-grade gap requires structured effort across both content and technique. The topics below are ordered by impact — work through the high-priority items first.`,
    big: `This is an ambitious target, but absolutely achievable with a committed plan. Starting from the high-priority topics builds the foundation — every session is focused on what moves the grade most.`
  };
  document.getElementById('resultSummary').textContent = summaries[gap <= 2 ? gap : 'big'];

  // ── Skills focus strip ──
  const skillFreq = {};
  adjusted.filter(t => t.p === 'high' || t.p === 'medium').slice(0, 5).forEach(t => {
    (t.skills || []).forEach(s => { skillFreq[s] = (skillFreq[s] || 0) + 1; });
  });
  const topSkills = Object.entries(skillFreq).sort((a,b) => b[1]-a[1]).slice(0,3).map(e => e[0]);

  const skillDescriptions = {
    'extended-writing': gap >= 2 ? 'Build structured 8–12 mark answers with clear argument and evidence' : 'Refine top-band language and evaluative depth',
    'case-studies':     gap >= 2 ? 'Learn key case studies with specific data, place names, and dates' : 'Apply case study detail more precisely to the question asked',
    'data-skills':      'Interpret graphs, maps, and statistics accurately and with geographical vocabulary',
    'diagram-skills':   'Produce annotated diagrams that add marks rather than just fill space',
    'exam-technique':   gap >= 2 ? 'Understand what each command word demands and structure answers accordingly' : 'Consistently hit the top band — evaluative language, balance, conclusion',
  };

  // ── Topics ──
  const topicsEl = document.getElementById('resultTopics');
  topicsEl.innerHTML = '';

  // Skills strip
  if (topSkills.length) {
    const strip = document.createElement('div');
    strip.className = 'result__skills-strip';
    strip.innerHTML = '<p class="result__skills-label">Key focus areas for your grade gap</p>';
    const grid = document.createElement('div');
    grid.className = 'result__skills-grid';
    topSkills.forEach(sk => {
      const card = document.createElement('div');
      card.className = 'skill-focus';
      card.innerHTML = `<strong>${skillLabels[sk]}</strong><span>${skillDescriptions[sk]}</span>`;
      grid.appendChild(card);
    });
    strip.appendChild(grid);
    topicsEl.appendChild(strip);
  }

  // Topic list with sub-topics
  const listTitle = document.createElement('p');
  listTitle.className = 'result__topics-label';
  listTitle.textContent = 'Revision topics — ordered by priority';
  topicsEl.appendChild(listTitle);

  adjusted.forEach((t, i) => {
    const wrap = document.createElement('div');
    wrap.className = `result__topic-block result__topic-block--${t.p}`;
    wrap.style.animationDelay = `${i * 0.07}s`;

    const badgeText = { high: 'Priority', medium: 'Important', refine: 'Refine', exam: 'Exam skill', coursework: 'Coursework' };

    wrap.innerHTML = `
      <div class="result__topic-head">
        <span class="topic-badge topic-badge--${t.p}">${badgeText[t.p]}</span>
        <strong class="topic-name">${t.name}</strong>
      </div>
      <ul class="topic-subs">
        ${t.subs.map(s => `<li>${s}</li>`).join('')}
      </ul>`;
    topicsEl.appendChild(wrap);
  });

  // ── Schedule ──
  const schedEl = document.getElementById('resultStats');
  const coreTopics = adjusted.filter(t => t.p !== 'coursework');
  const weeksPerTopic = Math.max(1, Math.floor(state.weeks / coreTopics.length));
  let weekCursor = 1;

  let schedHtml = `
    <div class="result__schedule">
      <p class="result__schedule-label">Suggested weekly schedule</p>`;

  coreTopics.forEach(t => {
    const wEnd = Math.min(weekCursor + weeksPerTopic - 1, state.weeks);
    const label = wEnd > weekCursor ? `Wk ${weekCursor}–${wEnd}` : `Wk ${weekCursor}`;
    schedHtml += `<div class="sched-row sched-row--${t.p}">
      <span class="sched-wk">${label}</span>
      <span class="sched-topic">${t.name}</span>
    </div>`;
    weekCursor = wEnd + 1;
    if (weekCursor > state.weeks) return;
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

document.getElementById('restartBtn').addEventListener('click', () => {
  state = { level: null, board: null, current: null, target: null, weeks: 12 };
  document.getElementById('weeksRange').value = 12;
  document.getElementById('weeksVal').textContent = '12';
  document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('grade-btn--selected','grade-btn--invalid'));
  document.getElementById('step3Next').disabled = true;
  showStep('step1', 1, 'Step 1 of 4');
});

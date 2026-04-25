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

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Enquiry sent — I will be in touch within 24 hours.';
  btn.disabled = true;
  btn.style.background = '#2d6a4f';
  btn.style.boxShadow = 'none';
  btn.style.transform = 'none';
});

// =====================================
// STUDY PLAN GENERATOR
// =====================================

const topics = {
  GCSE: {
    AQA: [
      { name: 'Natural Hazards', p: 'high' },
      { name: 'The Living World', p: 'high' },
      { name: 'Physical Landscapes in the UK', p: 'high' },
      { name: 'Urban Issues and Challenges', p: 'high' },
      { name: 'The Changing Economic World', p: 'medium' },
      { name: 'Resource Management', p: 'medium' },
      { name: 'Geographical Skills', p: 'medium' },
      { name: 'Paper 3 Issue Evaluation', p: 'exam' },
    ],
    Edexcel: [
      { name: 'Hazardous Earth', p: 'high' },
      { name: 'Development Dynamics', p: 'high' },
      { name: 'Challenges of an Urbanising World', p: 'high' },
      { name: 'UK in the 21st Century', p: 'medium' },
      { name: 'Rivers, Floods and Management', p: 'high' },
      { name: 'Oceans on the Edge', p: 'medium' },
      { name: 'Geographical Skills', p: 'medium' },
      { name: 'Paper 3 Decision Making Exercise', p: 'exam' },
    ],
    OCR: [
      { name: 'Landscapes — Coasts and Rivers', p: 'high' },
      { name: 'Weather and Climate', p: 'high' },
      { name: 'Living World — Ecosystems', p: 'medium' },
      { name: 'Population and Urbanisation', p: 'high' },
      { name: 'Development and Resource Wealth', p: 'medium' },
      { name: 'Geographical Skills', p: 'medium' },
      { name: 'Fieldwork Investigation', p: 'exam' },
    ],
    WJEC: [
      { name: 'Changing Physical Landscapes', p: 'high' },
      { name: 'Changing Human Landscapes', p: 'high' },
      { name: 'Environmental and Development Issues', p: 'high' },
      { name: 'Fieldwork and Geographical Skills', p: 'exam' },
    ],
    Eduqas: [
      { name: 'Changing Physical Landscapes', p: 'high' },
      { name: 'Changing Human Landscapes', p: 'high' },
      { name: 'Environmental and Development Issues', p: 'medium' },
      { name: 'Geographical Skills and Fieldwork', p: 'exam' },
    ],
    Cambridge: [
      { name: 'Population and Settlement', p: 'high' },
      { name: 'The Natural Environment', p: 'high' },
      { name: 'Economic Development', p: 'high' },
      { name: 'Geographical Skills and Fieldwork', p: 'exam' },
    ],
  },
  'A-Level': {
    AQA: [
      { name: 'Water and Carbon Cycles', p: 'high' },
      { name: 'Coastal Systems and Landscapes', p: 'high' },
      { name: 'Hazards', p: 'high' },
      { name: 'Ecosystems under Stress', p: 'medium' },
      { name: 'Global Systems and Governance', p: 'high' },
      { name: 'Changing Places', p: 'high' },
      { name: 'Contemporary Urban Environments', p: 'medium' },
      { name: 'Resource Security', p: 'medium' },
      { name: 'NEA Independent Investigation', p: 'coursework' },
      { name: 'Paper 3 Synoptic Skills', p: 'exam' },
    ],
    Edexcel: [
      { name: 'Tectonic Processes and Hazards', p: 'high' },
      { name: 'Landscape Systems', p: 'high' },
      { name: 'Globalisation', p: 'high' },
      { name: 'Shaping Places', p: 'high' },
      { name: 'Water Cycle and Water Insecurity', p: 'high' },
      { name: 'Carbon Cycle and Energy Security', p: 'medium' },
      { name: 'Superpowers', p: 'medium' },
      { name: 'Health, Human Rights and Intervention', p: 'medium' },
      { name: 'NEA Independent Investigation', p: 'coursework' },
      { name: 'Synoptic Fieldwork Question', p: 'exam' },
    ],
    OCR: [
      { name: 'Landscape Systems', p: 'high' },
      { name: "Earth's Life Support Systems", p: 'high' },
      { name: 'Geographical Debates', p: 'high' },
      { name: 'Global Connections', p: 'high' },
      { name: 'Investigative Geography (NEA)', p: 'coursework' },
      { name: 'Synoptic Geography', p: 'exam' },
    ],
    WJEC: [
      { name: 'Changing Landscapes', p: 'high' },
      { name: 'Changing Places', p: 'high' },
      { name: 'Global Systems', p: 'high' },
      { name: 'Global Governance', p: 'medium' },
      { name: 'Tectonic Hazards', p: 'medium' },
      { name: 'Fieldwork Investigation', p: 'coursework' },
    ],
    Eduqas: [
      { name: 'Changing Landscapes', p: 'high' },
      { name: 'Changing Places', p: 'high' },
      { name: 'Global Systems and Governance', p: 'high' },
      { name: 'Tectonic Hazards', p: 'medium' },
      { name: 'Independent Investigation (NEA)', p: 'coursework' },
    ],
    Cambridge: [
      { name: 'Hydrology and Fluvial Geomorphology', p: 'high' },
      { name: 'Atmosphere and Weather', p: 'high' },
      { name: 'Rocks and Weathering', p: 'medium' },
      { name: 'Population', p: 'high' },
      { name: 'Migration', p: 'medium' },
      { name: 'Settlement Dynamics', p: 'high' },
      { name: 'Economic Transition', p: 'medium' },
      { name: 'Environmental Management', p: 'medium' },
      { name: 'Research Methods and Skills', p: 'exam' },
    ],
  },
};

const gcseGrades    = ['1','2','3','4','5','6','7','8','9'];
const aLevelGrades  = ['U','E','D','C','B','A','A*'];

let state = { level: null, board: null, current: null, target: null, weeks: 12 };

function showStep(id, dotNum, label) {
  document.querySelectorAll('.planner__step').forEach(s => s.classList.add('planner__step--hidden'));
  const el = document.getElementById(id);
  el.classList.remove('planner__step--hidden');

  // Progress dots
  document.querySelectorAll('.planner__dot').forEach((d, i) => {
    d.classList.toggle('planner__dot--active', i < dotNum);
  });
  document.getElementById('plannerLabel').textContent = label;
}

// Step 1 — Level
document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    state.level = btn.dataset.value;
    state.board = null;
    state.current = null;
    state.target = null;
    buildGradeOptions();
    showStep('step2', 2, 'Step 2 of 4');
  });
});

// Step 2 — Board
document.querySelectorAll('.board-opt').forEach(btn => {
  btn.addEventListener('click', () => {
    state.board = btn.dataset.value;
    showStep('step3', 3, 'Step 3 of 4');
  });
});

// Step 3 — Grades
function buildGradeOptions() {
  const grades = state.level === 'GCSE' ? gcseGrades : aLevelGrades;
  ['currentGrades', 'targetGrades'].forEach(id => {
    const container = document.getElementById(id);
    container.innerHTML = '';
    grades.forEach(g => {
      const b = document.createElement('button');
      b.className = 'grade-btn';
      b.dataset.value = g;
      b.textContent = g;
      b.addEventListener('click', () => handleGradeSelect(id === 'currentGrades' ? 'current' : 'target', g));
      container.appendChild(b);
    });
  });
}

function handleGradeSelect(type, value) {
  state[type] = value;
  const id = type === 'current' ? 'currentGrades' : 'targetGrades';
  document.querySelectorAll(`#${id} .grade-btn`).forEach(b => {
    b.classList.toggle('grade-btn--selected', b.dataset.value === value);
  });

  // Dim invalid target grades (must be >= current)
  if (state.current) {
    const grades = state.level === 'GCSE' ? gcseGrades : aLevelGrades;
    const ci = grades.indexOf(state.current);
    document.querySelectorAll('#targetGrades .grade-btn').forEach(b => {
      const ti = grades.indexOf(b.dataset.value);
      b.classList.toggle('grade-btn--invalid', ti < ci);
    });
  }

  document.getElementById('step3Next').disabled = !(state.current && state.target);
}

document.getElementById('step3Next').addEventListener('click', () => {
  showStep('step4', 4, 'Step 4 of 4');
});

// Step 4 — Weeks
const weeksRange = document.getElementById('weeksRange');
const weeksVal   = document.getElementById('weeksVal');

weeksRange.addEventListener('input', () => {
  state.weeks = parseInt(weeksRange.value);
  weeksVal.textContent = state.weeks;
});

// Back buttons
document.querySelectorAll('.planner__back').forEach(btn => {
  btn.addEventListener('click', () => {
    const dot = parseInt(btn.dataset.dot);
    showStep(btn.dataset.target, dot, btn.dataset.lbl);
  });
});

// Generate plan
document.getElementById('generateBtn').addEventListener('click', () => {
  buildResult();
  showStep('planResult', 4, 'Your Plan');
  document.getElementById('plannerLabel').textContent = 'Your personalised plan';
});

function buildResult() {
  const grades  = state.level === 'GCSE' ? gcseGrades : aLevelGrades;
  const ci      = grades.indexOf(state.current);
  const ti      = grades.indexOf(state.target);
  const gap     = ti - ci;
  const boardTopics = (topics[state.level][state.board] || topics[state.level]['AQA']).slice();

  // Adjust priorities based on gap
  const adjusted = boardTopics.map(t => {
    let p = t.p;
    if (p === 'exam' || p === 'coursework') return { ...t };
    if (gap <= 0)      p = 'refine';
    else if (gap === 1) p = t.p === 'high' ? 'high' : 'medium';
    else                p = t.p;
    return { ...t, p };
  });

  // Sort: high → medium → refine → coursework/exam
  const order = { high: 0, medium: 1, refine: 2, exam: 3, coursework: 4 };
  adjusted.sort((a, b) => order[a.p] - order[b.p]);

  // Sessions
  const perWeek = gap >= 2 ? 2 : 1;
  const total   = state.weeks * perWeek;

  // Meta tags
  const meta = document.getElementById('resultMeta');
  meta.innerHTML = `
    <span class="result__tag">${state.level}</span>
    <span class="result__tag">${state.board}</span>
    <span class="result__tag">${state.weeks} weeks</span>
  `;

  // Title
  let title;
  if (gap <= 0)      title = 'Refining for top marks';
  else if (gap === 1) title = `Closing the gap to ${state.target}`;
  else               title = `Targeting ${state.target} from ${state.current}`;
  document.getElementById('resultTitle').textContent = title;

  // Summary
  let summary;
  if (gap <= 0)
    summary = `You are at or above your target. The focus now is exam technique, mark scheme precision, and consistent performance under timed conditions.`;
  else if (gap === 1)
    summary = `A one-grade improvement is very achievable. The topics below highlight where to focus — sharpening technique on these will have the most direct impact on your mark.`;
  else if (gap <= 3)
    summary = `There is real ground to cover, but with a structured plan across ${state.weeks} weeks this is absolutely achievable. The high-priority topics below are where marks are currently being lost most.`;
  else
    summary = `This is an ambitious target and will require focused, consistent work. Starting with the high-priority topics below gives you the fastest route to grade improvement.`;
  document.getElementById('resultSummary').textContent = summary;

  // Topics
  const topicsEl = document.getElementById('resultTopics');
  topicsEl.innerHTML = '';
  adjusted.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = `result__topic result__topic--${t.p}`;
    div.style.animationDelay = `${i * 0.06}s`;
    const badgeLabel = t.p === 'high' ? 'Priority' : t.p === 'medium' ? 'Important' : t.p === 'refine' ? 'Refine' : t.p === 'coursework' ? 'Coursework' : 'Exam Skill';
    div.innerHTML = `<span class="topic-label">${t.name}</span><span class="topic-badge topic-badge--${t.p}">${badgeLabel}</span>`;
    topicsEl.appendChild(div);
  });

  // Stats
  document.getElementById('resultStats').innerHTML = `
    <div class="stat-box">
      <span class="stat-box__num">${perWeek}</span>
      <span class="stat-box__label">Sessions per week</span>
    </div>
    <div class="stat-box">
      <span class="stat-box__num">${total}</span>
      <span class="stat-box__label">Total sessions</span>
    </div>
  `;
}

// Restart
document.getElementById('restartBtn').addEventListener('click', () => {
  state = { level: null, board: null, current: null, target: null, weeks: 12 };
  document.getElementById('weeksRange').value = 12;
  document.getElementById('weeksVal').textContent = '12';
  document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('grade-btn--selected', 'grade-btn--invalid'));
  document.getElementById('step3Next').disabled = true;
  showStep('step1', 1, 'Step 1 of 4');
});

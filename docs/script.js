'use strict';

/* ==========================================================================
   Verified Experimental Data (from results/*.csv, results/*.json, notebooks)
   ========================================================================== */

const DIMENSION_DATA = {
  10: {
    samples: 20000,
    corners: '2^10 = 1,024 vertices',
    polyD3: 286,
    polyD5: 3003,
    polyNote: 'd=5 = 3,003 (15% of N)',
    arch: '256-128-64',
    params: '44,033 params (ReLU)',
    target: 94.0,
    rf: 51.55,
    gbm: 51.10,
    xt: 84.20,
    polyCv: 50.4,
    baseMlp: 94.13,
    optVal: 96.20,
    optTest: 90.93,
    hiddenDist: '5,416 class 0 / 4,584 class 1',
    trajX: 68,
    trajY: { val: 28.4, test: 40.0, target: 33.2, poly: 129.1 },
  },
  12: {
    samples: 24000,
    corners: '2^12 = 4,096 vertices',
    polyD3: 455,
    polyD5: 6188,
    polyNote: 'd=5 = 6,188 (26% of N)',
    arch: '256-128-64',
    params: '44,545 params (ReLU)',
    target: 93.0,
    rf: 51.42,
    gbm: 50.44,
    xt: 55.31,
    polyCv: 49.5,
    baseMlp: 92.56,
    optVal: 95.42,
    optTest: 92.75,
    hiddenDist: '4,991 class 0 / 5,009 class 1',
    trajX: 152.4,
    trajY: { val: 30.1, test: 36.0, target: 35.4, poly: 131.1 },
  },
  14: {
    samples: 28000,
    corners: '2^14 = 16,384 vertices',
    polyD3: 680,
    polyD5: 11628,
    polyNote: 'd=5 = 11,628 (42% of N)',
    arch: '512-256-128',
    params: '172,033 params (ReLU)',
    target: 92.0,
    rf: 50.89,
    gbm: 50.30,
    xt: 53.18,
    polyCv: 49.0,
    baseMlp: 92.46,
    optVal: 95.61,
    optTest: 92.96,
    hiddenDist: '4,970 class 0 / 5,030 class 1',
    trajX: 236.8,
    trajY: { val: 29.7, test: 35.5, target: 37.6, poly: 132.2 },
  },
  16: {
    samples: 32000,
    corners: '2^16 = 65,536 vertices',
    polyD3: 969,
    polyD5: 20349,
    polyNote: 'd=5 = 20,349 (1.06× train)',
    arch: '1024-512-256-128',
    params: '706,561 params (ReLU)',
    target: 91.0,
    rf: 49.86,
    gbm: 50.84,
    xt: 50.80,
    polyCv: 50.4,
    baseMlp: 87.08,
    optVal: 92.64,
    optTest: 92.70,
    hiddenDist: '5,046 class 0 / 4,954 class 1',
    trajX: 321.2,
    trajY: { val: 36.2, test: 36.1, target: 39.8, poly: 129.1 },
  },
  18: {
    samples: 36000,
    corners: '2^18 = 262,144 vertices',
    polyD3: 1330,
    polyD5: 33649,
    polyNote: 'd=5 = 33,649 (1.56× train)',
    arch: '1024-512-256-128',
    params: '708,609 params (ReLU)',
    target: 80.0,
    rf: 49.71,
    gbm: 50.53,
    xt: 49.29,
    polyCv: 49.4,
    baseMlp: 71.24,
    optVal: 91.25,
    optTest: 89.04,
    hiddenDist: '4,995 class 0 / 5,005 class 1',
    trajX: 405.6,
    trajY: { val: 39.3, test: 44.1, target: 64.0, poly: 131.3 },
  },
  20: {
    samples: 40000,
    corners: '2^20 = 1,048,576 vertices',
    polyD3: 1771,
    polyD5: 53130,
    polyNote: 'd=5 = 53,130 (2.21× train)',
    arch: '2048-1024-512-256',
    params: '2,797,569 params (ReLU)',
    target: 75.0,
    rf: 50.26,
    gbm: 50.20,
    xt: 50.19,
    polyCv: 49.9,
    baseMlp: 73.20,
    optVal: 93.28,
    optTest: 89.43,
    hiddenDist: '5,004 class 0 / 4,996 class 1',
    trajX: 490,
    trajY: { val: 34.8, test: 43.3, target: 75.0, poly: 130.2 },
  },
};

const REGIME_DATA = {
  trees: {
    title: 'Axis-Aligned Ensembles (RF / GBM / ExtraTrees)',
    math: 'split: xⱼ ≤ t  ⇒  P(y=1 | xⱼ ≤ t) ≈ 0.50',
    warn: true,
    desc: 'Decision trees cut perpendicular to a single coordinate axis at each node. On an XOR/parity hypercube, every single-coordinate half-space contains equal numbers of Class 0 and Class 1 vertices—forcing Random Forest (50.3%) and ExtraTrees (50.2%) to coin-flip accuracy at n=20.',
  },
  poly: {
    title: 'Fixed Polynomial Basis φ_d(x)',
    math: 'N_params = C(n+d, d) ≈ O(nᵈ)  (d=5, n=20 → 53,130 feats)',
    warn: true,
    desc: 'Fixed polynomial expansion requires combinatorial terms to span high-order feature interactions. In PolynomialLogisticRegression.ipynb (degrees 1–5, SAG solver), every configuration stalled between 49.4% and 52.0% test accuracy.',
  },
  mlp: {
    title: 'Adaptive Deep ReLU MLP (Ours)',
    math: 'h⁽ᵏ⁾ = max(0, W⁽ᵏ⁾ h⁽ᵏ⁻¹⁾ + b⁽ᵏ⁾)',
    warn: false,
    desc: 'Each Kryptonite-n feature vector clusters around noisy hypercube corners {0,1}ⁿ + N(0, 0.1²) (overall std 0.510). Paired ReLU half-spaces fold opposing diagonal vertices into a linearly separable manifold—achieving 89.4% test accuracy (93.3% val) at n=20.',
  },
};

const BPE_PRESETS = {
  boundary: { a: '0.12345', b: '0.12346' },
  suffix: { a: '0.12345', b: '0.9945' },
  dataset: { a: '1.1879', b: '1.2143' },
};

// Exact empirically measured n=18 validation reject-option curve (7,200 validation samples)
const REJECT_CURVE = [
  { tau: 0.50, cov: 1.0000, acc: 0.8788, kept: 7200, abstained: 0 },
  { tau: 0.52, cov: 0.9969, acc: 0.8806, kept: 7178, abstained: 22 },
  { tau: 0.54, cov: 0.9936, acc: 0.8813, kept: 7154, abstained: 46 },
  { tau: 0.56, cov: 0.9882, acc: 0.8828, kept: 7115, abstained: 85 },
  { tau: 0.58, cov: 0.9853, acc: 0.8830, kept: 7094, abstained: 106 },
  { tau: 0.60, cov: 0.9817, acc: 0.8844, kept: 7068, abstained: 132 },
  { tau: 0.62, cov: 0.9768, acc: 0.8867, kept: 7033, abstained: 167 },
  { tau: 0.64, cov: 0.9728, acc: 0.8883, kept: 7004, abstained: 196 },
  { tau: 0.66, cov: 0.9697, acc: 0.8894, kept: 6982, abstained: 218 },
  { tau: 0.68, cov: 0.9649, acc: 0.8910, kept: 6947, abstained: 253 },
  { tau: 0.70, cov: 0.9606, acc: 0.8926, kept: 6916, abstained: 284 },
  { tau: 0.72, cov: 0.9571, acc: 0.8933, kept: 6891, abstained: 309 },
  { tau: 0.74, cov: 0.9533, acc: 0.8947, kept: 6864, abstained: 336 },
  { tau: 0.76, cov: 0.9487, acc: 0.8956, kept: 6831, abstained: 369 },
  { tau: 0.78, cov: 0.9426, acc: 0.8985, kept: 6787, abstained: 413 },
  { tau: 0.80, cov: 0.9393, acc: 0.8997, kept: 6763, abstained: 437 },
  { tau: 0.82, cov: 0.9342, acc: 0.9014, kept: 6726, abstained: 474 },
  { tau: 0.84, cov: 0.9279, acc: 0.9032, kept: 6681, abstained: 519 },
  { tau: 0.86, cov: 0.9213, acc: 0.9047, kept: 6633, abstained: 567 },
  { tau: 0.88, cov: 0.9125, acc: 0.9068, kept: 6570, abstained: 630 },
  { tau: 0.90, cov: 0.9031, acc: 0.9085, kept: 6502, abstained: 698 },
  { tau: 0.92, cov: 0.8906, acc: 0.9116, kept: 6412, abstained: 788 },
  { tau: 0.94, cov: 0.8749, acc: 0.9157, kept: 6299, abstained: 901 },
  { tau: 0.96, cov: 0.8542, acc: 0.9205, kept: 6150, abstained: 1050 },
  { tau: 0.98, cov: 0.8199, acc: 0.9275, kept: 5903, abstained: 1297 },
];

const ECO_DATA = {
  stopped: {
    co2: '0.000850 kg CO₂',
    co2Sub: '0.85 g total · 0.003579 kWh energy',
    flops: '28,351.8 GFLOPs',
    flopsSub: '277 epochs · 283.5s runtime',
    score: '1,114.34',
    savings: '94.5% saved',
    barLabel: '5.5% OF BUDGET USED',
    barPct: '5.54%',
  },
  full: {
    co2: '0.015343 kg CO₂ (est.)',
    co2Sub: '15.34 g extrapolated · 0.064603 kWh',
    flops: '511,765.9 GFLOPs',
    flopsSub: '5,000 fixed epochs (~85 min est.)',
    score: '61.76 (est.)',
    savings: '0% (18.05× cost)',
    barLabel: '100% OF BUDGET USED',
    barPct: '100%',
  },
};

/* ==========================================================================
   Helper: Generic Keyboard Arrow Navigation for WAI-ARIA Tablists
   ========================================================================== */

function wireTablist(tablistEl, onSelect) {
  if (!tablistEl) return;
  const tabs = Array.from(tablistEl.querySelectorAll('[role="tab"]'));

  tabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => onSelect(tab));
    tab.addEventListener('keydown', (event) => {
      let nextIdx = null;
      if (event.key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIdx = 0;
      else if (event.key === 'End') nextIdx = tabs.length - 1;

      if (nextIdx !== null) {
        event.preventDefault();
        tabs[nextIdx].focus();
        onSelect(tabs[nextIdx]);
      }
    });
  });
}

/* ==========================================================================
   Case 01 & Case 02 Sync: Dimension Explorer + Trajectory SVG
   ========================================================================== */

function setDimension(n) {
  const d = DIMENSION_DATA[n];
  if (!d) return;

  // Sync Case 01 tabs & tabpanel label
  document.querySelectorAll('[data-dim]').forEach((btn) => {
    const selected = Number(btn.dataset.dim) === n;
    btn.setAttribute('aria-selected', String(selected));
    btn.tabIndex = selected ? 0 : -1;
    if (selected) {
      const group = btn.closest('.switchGroup');
      if (group && group.scrollWidth > group.clientWidth) {
        const left = btn.offsetLeft - group.clientWidth / 2 + btn.offsetWidth / 2;
        group.scrollTo({ left: Math.max(0, left), behavior: 'auto' });
      }
    }
  });
  const dimPanel = document.getElementById('dim-tabpanel');
  if (dimPanel) {
    dimPanel.setAttribute('aria-labelledby', `dim-tab-${n}`);
  }

  // Update telemetry cards
  document.getElementById('dim-samples').textContent = d.samples.toLocaleString('en-US');
  document.getElementById('dim-corners').textContent = d.corners;
  document.getElementById('dim-poly-feats').textContent =
    `${d.polyD3.toLocaleString('en-US')} / ${d.polyD5.toLocaleString('en-US')}`;
  document.getElementById('dim-poly-note').textContent = d.polyNote;
  document.getElementById('dim-arch').textContent = d.arch;
  document.getElementById('dim-params').textContent = d.params;
  document.getElementById('dim-val-test').textContent =
    `${d.optVal.toFixed(1)}% / ${d.optTest.toFixed(1)}%`;

  const margin = d.optTest - d.target;
  const sign = margin >= 0 ? '+' : '';
  document.getElementById('dim-target-margin').textContent =
    `Target ${d.target.toFixed(1)}% (${sign}${margin.toFixed(1)} pts test)`;
  document.getElementById('dim-target-label').textContent =
    `TARGET THRESHOLD: ${d.target.toFixed(1)}%`;

  // Update benchmark gauges and target markers
  const gauges = [
    { bar: 'bar-rf', tline: 'tline-rf', val: 'val-rf', pct: d.rf, note: d.rf < 55 ? 'Chance' : 'Below' },
    { bar: 'bar-gbm', tline: 'tline-gbm', val: 'val-gbm', pct: d.gbm, note: d.gbm < 55 ? 'Chance' : 'Below' },
    { bar: 'bar-xt', tline: 'tline-xt', val: 'val-xt', pct: d.xt, note: d.xt >= 80 ? 'Partial' : 'Chance' },
    { bar: 'bar-poly', tline: 'tline-poly', val: 'val-poly', pct: d.polyCv, note: 'Collapses' },
    { bar: 'bar-base-mlp', tline: 'tline-base-mlp', val: 'val-base-mlp', pct: d.baseMlp, note: d.baseMlp >= d.target ? 'Beats' : 'Under-cap' },
    { bar: 'bar-opt-mlp', tline: 'tline-opt-mlp', val: 'val-opt-mlp', pct: d.optTest, note: margin >= 0 ? `Beats (${sign}${margin.toFixed(1)})` : `Val ${d.optVal.toFixed(1)}%` },
  ];

  gauges.forEach((g) => {
    document.getElementById(g.bar).style.setProperty('--fill', `${g.pct.toFixed(2)}%`);
    document.getElementById(g.tline).style.setProperty('--target-pos', `${d.target}%`);
    document.getElementById(g.val).textContent = `${g.pct.toFixed(1)}% · ${g.note}`;
  });

  document.getElementById('dim-hidden-dist').textContent =
    `hiddenlabels/y_predicted_${n}.npy · 10,000 preds (${d.hiddenDist})`;

  const statusBadge = document.getElementById('dim-status-badge');
  if (margin >= 0) {
    statusBadge.textContent = `✓ Test & Val Beat Target (+${margin.toFixed(1)} pts)`;
  } else {
    statusBadge.textContent = `✓ Val +${(d.optVal - d.target).toFixed(1)} pts · CV Beats Target`;
  }

  // Sync Case 02 trajectory chart guide & readout
  document.getElementById('traj-guide').setAttribute('x1', d.trajX);
  document.getElementById('traj-guide').setAttribute('x2', d.trajX);
  document.getElementById('dot-val').setAttribute('cx', d.trajX);
  document.getElementById('dot-val').setAttribute('cy', d.trajY.val);
  document.getElementById('dot-test').setAttribute('cx', d.trajX);
  document.getElementById('dot-test').setAttribute('cy', d.trajY.test);
  document.getElementById('dot-target').setAttribute('cx', d.trajX);
  document.getElementById('dot-target').setAttribute('cy', d.trajY.target);
  document.getElementById('dot-poly').setAttribute('cx', d.trajX);
  document.getElementById('dot-poly').setAttribute('cy', d.trajY.poly);

  document.querySelectorAll('[data-traj-n]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(Number(btn.dataset.trajN) === n));
  });

  const readout = document.getElementById('traj-readout');
  readout.replaceChildren(
    makeSpanStrong('Selected: ', `n=${n}`),
    makeTrajectorySpan('MLP Val ', `${d.optVal.toFixed(1)}%`, ' · Test ', `${d.optTest.toFixed(1)}%`, 'highlightVal'),
    makeTrajectorySpan('Target ', `${d.target.toFixed(1)}%`, ' · Poly2 ', `${d.polyCv.toFixed(1)}%`, 'warnVal'),
  );
}

function makeSpanStrong(prefix, value) {
  const span = document.createElement('span');
  span.append(prefix);
  const strong = document.createElement('strong');
  strong.textContent = value;
  span.append(strong);
  return span;
}

function makeTrajectorySpan(p1, v1, p2, v2, cls2) {
  const span = document.createElement('span');
  const s1 = document.createElement('strong');
  s1.textContent = v1;
  const s2 = document.createElement('strong');
  s2.className = cls2;
  s2.textContent = v2;
  span.append(p1, s1, p2, s2);
  return span;
}

/* ==========================================================================
   Case 02: Manifold Geometry Regime Switcher
   ========================================================================== */

function setRegime(key) {
  const r = REGIME_DATA[key];
  if (!r) return;

  document.querySelectorAll('[data-regime]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.regime === key));
  });

  ['trees', 'poly', 'mlp'].forEach((layer) => {
    const el = document.getElementById(`regime-layer-${layer}`);
    if (el) {
      const hide = layer !== key;
      el.toggleAttribute('hidden', hide);
      el.setAttribute('display', hide ? 'none' : 'inline');
    }
  });

  document.getElementById('regime-title').textContent = r.title;
  const mathEl = document.getElementById('regime-math');
  mathEl.textContent = r.math;
  mathEl.className = r.warn ? 'regimeMath regimeMathWarn' : 'regimeMath';
  document.getElementById('regime-desc').textContent = r.desc;
}

/* ==========================================================================
   Case 03: Exact Client-Side GPT-2 Numeric BPE Tokenizer
   ========================================================================== */

const bpeRankMap = (() => {
  const map = new Map();
  if (window.GPT2_NUM_BPE && Array.isArray(window.GPT2_NUM_BPE.m)) {
    window.GPT2_NUM_BPE.m.forEach((pair, idx) => map.set(pair, idx));
  }
  return map;
})();

function bpeMergeWord(tokenStr) {
  let word = Array.from(tokenStr);
  if (word.length <= 1) return word;

  while (word.length > 1) {
    let bestPair = null;
    let bestRank = Infinity;

    for (let i = 0; i < word.length - 1; i += 1) {
      const pairKey = `${word[i]} ${word[i + 1]}`;
      const rank = bpeRankMap.get(pairKey);
      if (rank !== undefined && rank < bestRank) {
        bestRank = rank;
        bestPair = [word[i], word[i + 1]];
      }
    }

    if (!bestPair) break;

    const [first, second] = bestPair;
    const nextWord = [];
    let i = 0;
    while (i < word.length) {
      if (i < word.length - 1 && word[i] === first && word[i + 1] === second) {
        nextWord.push(first + second);
        i += 2;
      } else {
        nextWord.push(word[i]);
        i += 1;
      }
    }
    word = nextWord;
  }

  return word;
}

function encodeNumericBPE(rawText) {
  const cleaned = String(rawText).trim().replace(/[^0-9.\-]/g, '') || '0';
  const chunks = cleaned.match(/ ?\d+| ?[^\s\d]+|\s+/g) || [];
  const vocab = window.GPT2_NUM_BPE ? window.GPT2_NUM_BPE.v : {};
  const tokens = [];

  chunks.forEach((chunk) => {
    const mapped = chunk.replace(/ /g, 'Ġ');
    bpeMergeWord(mapped).forEach((piece) => {
      if (Object.hasOwn(vocab, piece)) {
        tokens.push({ piece: piece.replace(/Ġ/g, ' '), id: vocab[piece] });
      }
    });
  });

  return { cleaned, tokens };
}

function extractBodyTokenIds(tokens) {
  const dotIdx = tokens.findIndex((t) => t.piece === '.');
  return new Set(
    tokens
      .filter((t, idx) => {
        if (t.piece === '.' || t.piece === '-') return false;
        // Skip the neutral leading integer "0" in "0.xxx" so comparison focuses on significant digits
        if (dotIdx !== -1 && idx === dotIdx - 1 && t.piece === '0') return false;
        return /\d/.test(t.piece);
      })
      .map((t) => t.id),
  );
}

function renderTokenStream(container, tokens, otherIds) {
  const dotIdx = tokens.findIndex((t) => t.piece === '.');
  const nodes = tokens.map((tok, index) => {
    const chip = document.createElement('span');
    const isNeutral =
      tok.piece === '.' ||
      tok.piece === '-' ||
      (dotIdx !== -1 && index === dotIdx - 1 && tok.piece === '0');
    const isShared = !isNeutral && otherIds.has(tok.id);
    chip.className = isNeutral
      ? 'tokChip'
      : isShared
        ? 'tokChip tokChipShared'
        : 'tokChip tokChipDiverge';

    const pieceSpan = document.createElement('span');
    pieceSpan.textContent = `"${tok.piece}"`;

    const idSpan = document.createElement('span');
    idSpan.className = 'tokId';
    idSpan.textContent = `#${tok.id}`;

    chip.append(pieceSpan, idSpan);
    return chip;
  });

  container.replaceChildren(...nodes);
}

function updateBPEComparison() {
  const inputA = document.getElementById('bpe-input-a');
  const inputB = document.getElementById('bpe-input-b');
  if (!inputA || !inputB) return;

  const encA = encodeNumericBPE(inputA.value);
  const encB = encodeNumericBPE(inputB.value);

  const bodyIdsA = extractBodyTokenIds(encA.tokens);
  const bodyIdsB = extractBodyTokenIds(encB.tokens);

  renderTokenStream(document.getElementById('bpe-tokens-a'), encA.tokens, bodyIdsB);
  renderTokenStream(document.getElementById('bpe-tokens-b'), encB.tokens, bodyIdsA);

  const valA = Number.parseFloat(encA.cleaned);
  const valB = Number.parseFloat(encB.cleaned);
  const dist = Number.isFinite(valA) && Number.isFinite(valB) ? Math.abs(valA - valB) : 0;
  document.getElementById('bpe-dist').textContent = dist.toFixed(5);

  const unionBody = new Set([...bodyIdsA, ...bodyIdsB]);
  const sharedBody = [...bodyIdsA].filter((id) => bodyIdsB.has(id));
  document.getElementById('bpe-overlap').textContent =
    `${sharedBody.length} / ${unionBody.size} shared`;

  const idsA = encA.tokens.map((t) => t.id).join(', ');
  const idsB = encB.tokens.map((t) => t.id).join(', ');
  const piecesA = encA.tokens.map((t) => t.piece).join('|');
  const piecesB = encB.tokens.map((t) => t.piece).join('|');

  const explainer = document.getElementById('bpe-explainer');
  explainer.replaceChildren();
  const c1 = document.createElement('code');
  c1.textContent = `"${encA.cleaned}"`;
  const c2 = document.createElement('code');
  c2.textContent = `[${idsA}]`;
  const c3 = document.createElement('code');
  c3.textContent = `(${piecesA})`;
  const c4 = document.createElement('code');
  c4.textContent = `"${encB.cleaned}"`;
  const c5 = document.createElement('code');
  c5.textContent = `[${idsB}]`;
  const c6 = document.createElement('code');
  c6.textContent = `(${piecesB})`;

  if (dist <= 0.01 && sharedBody.length === 0) {
    explainer.append(
      'Proximity shattered: ', c1, ' → ', c2, ' ', c3, ' vs ', c4, ' → ', c5, ' ', c6,
      '. Nearly identical scalars map to disjoint subword token IDs.',
    );
  } else if (dist > 0.2 && sharedBody.length > 0) {
    explainer.append(
      'False geometric collision: ', c1, ' ', c2, ' and ', c4, ' ', c5,
      ` are ${dist.toFixed(4)} apart yet share token ID(s) [${sharedBody.join(', ')}].`,
    );
  } else {
    explainer.append(
      'GPT-2 encodes ', c1, ' → ', c2, ' ', c3, ' and ', c4, ' → ', c5, ' ', c6, '.',
    );
  }
}

/* ==========================================================================
   Case 04: Uncertainty Calibration Slider & Sustainability Toggle
   ========================================================================== */

function updateRejectSlider() {
  const slider = document.getElementById('reject-slider');
  if (!slider) return;

  const tau = Number.parseFloat(slider.value);
  const min = Number.parseFloat(slider.min);
  const max = Number.parseFloat(slider.max);
  const pct = ((tau - min) / (max - min)) * 100;

  slider.style.setProperty('--slider-progress', `${pct.toFixed(1)}%`);
  slider.setAttribute('aria-valuetext', `Confidence threshold ${tau.toFixed(2)}`);

  // Find closest measured datapoint in REJECT_CURVE
  const point = REJECT_CURVE.reduce((best, cur) =>
    Math.abs(cur.tau - tau) < Math.abs(best.tau - tau) ? cur : best,
  );

  document.getElementById('reject-tau-val').textContent = `τ_conf = ${point.tau.toFixed(2)}`;
  document.getElementById('reject-acc').textContent = `${(point.acc * 100).toFixed(2)}%`;
  document.getElementById('reject-cov').textContent =
    `${(point.cov * 100).toFixed(1)}% (${point.kept.toLocaleString('en-US')} / 7,200)`;
  document.getElementById('reject-abstain').textContent =
    `${point.abstained.toLocaleString('en-US')} deferred`;

  const svgX = 28 + ((point.tau - 0.50) / 0.50) * 190;
  const cutoffLine = document.getElementById('calib-cutoff-line');
  if (cutoffLine) {
    cutoffLine.setAttribute('x1', svgX.toFixed(1));
    cutoffLine.setAttribute('x2', svgX.toFixed(1));
  }
}

function setEcoMode(mode) {
  const d = ECO_DATA[mode];
  if (!d) return;

  document.querySelectorAll('[data-eco-mode]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.ecoMode === mode));
  });

  document.getElementById('eco-co2').textContent = d.co2;
  document.getElementById('eco-co2-sub').textContent = d.co2Sub;
  document.getElementById('eco-flops').textContent = d.flops;
  document.getElementById('eco-flops-sub').textContent = d.flopsSub;
  document.getElementById('eco-score').textContent = d.score;
  document.getElementById('eco-savings').textContent = d.savings;
  document.getElementById('eco-bar-label').textContent = d.barLabel;
  document.getElementById('eco-bar-fill').style.setProperty('--fill', d.barPct);
}

/* ==========================================================================
   Bootstrap Interactive Bindings
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Case 01: Dimension Tablist
  wireTablist(document.querySelector('[data-dim-tablist]'), (tab) => {
    setDimension(Number(tab.dataset.dim));
  });

  // Case 02: Regime Switcher + Trajectory Dim Buttons
  document.querySelectorAll('[data-regime]').forEach((btn) => {
    btn.addEventListener('click', () => setRegime(btn.dataset.regime));
  });

  document.querySelectorAll('[data-traj-n], [data-traj-point]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.trajN || btn.dataset.trajPoint;
      setDimension(Number(val));
    });
  });

  // Case 03: BPE Forensic Controls
  document.querySelectorAll('[data-bpe-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = BPE_PRESETS[btn.dataset.bpePreset];
      if (!preset) return;
      document.querySelectorAll('[data-bpe-preset]').forEach((p) => {
        p.setAttribute('aria-pressed', String(p === btn));
      });
      document.getElementById('bpe-input-a').value = preset.a;
      document.getElementById('bpe-input-b').value = preset.b;
      updateBPEComparison();
    });
  });

  document.querySelectorAll('[data-nudge]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.nudge === 'a' ? 'bpe-input-a' : 'bpe-input-b';
      const input = document.getElementById(targetId);
      const cur = Number.parseFloat(input.value) || 0;
      const delta = Number.parseFloat(btn.dataset.delta);
      input.value = (cur + delta).toFixed(5);
      updateBPEComparison();
    });
  });

  ['bpe-input-a', 'bpe-input-b'].forEach((id) => {
    const input = document.getElementById(id);
    if (input) input.addEventListener('input', updateBPEComparison);
  });

  // Case 04: Audit Tablist + Reject Slider + Sustainability Toggle
  const auditTablist = document.querySelector('[data-audit-tablist]');
  wireTablist(auditTablist, (tab) => {
    const key = tab.dataset.auditTab;
    auditTablist.querySelectorAll('[role="tab"]').forEach((t) => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
    });
    document.getElementById('panel-calib').hidden = key !== 'calib';
    document.getElementById('panel-eco').hidden = key !== 'eco';
  });

  const rejectSlider = document.getElementById('reject-slider');
  if (rejectSlider) {
    rejectSlider.addEventListener('input', updateRejectSlider);
    updateRejectSlider();
  }

  document.querySelectorAll('[data-eco-mode]').forEach((btn) => {
    btn.addEventListener('click', () => setEcoMode(btn.dataset.ecoMode));
  });

  // Initialize default states
  setDimension(20);
  setRegime('mlp');
  updateBPEComparison();
  setEcoMode('stopped');
});

(() => {
  'use strict';

  const codeSamples = {
    js: {
      filename: 'lcm.js',
      notes: [
        'Recursive Euclidean GCD keeps the call stack shallow due to logarithmic depth.',
        'Arrow functions and Array.prototype.reduce express the fold idiomatically.',
        'Zero short-circuit prevents undefined behavior.'
      ],
      source: `function LCM(A) {
  if (A.some(x => x === 0)) return 0;

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

  return A.reduce((acc, val) => lcm(acc, val));
}`
    },
    ts: {
      filename: 'lcm.ts',
      notes: [
        'Explicit number[] typing guards against mixed-type arrays.',
        'ReadonlyArray prevents accidental mutation of the input sequence.',
        'The recursive GCD is tail-call friendly in modern runtimes.'
      ],
      source: `function LCM(A: ReadonlyArray<number>): number {
  if (A.some((x: number) => x === 0)) return 0;

  const gcd = (a: number, b: number): number =>
    b === 0 ? a : gcd(b, a % b);

  const lcm = (a: number, b: number): number =>
    Math.abs(a * b) / gcd(a, b);

  return A.reduce((acc, val) => lcm(acc, val));
}`
    },
    py: {
      filename: 'lcm.py',
      notes: [
        'math.gcd is the optimized CPython implementation.',
        'functools.reduce expresses the left-fold without manual loops.',
        'Early zero check uses Python\'s efficient any() short-circuit.'
      ],
      source: `from math import gcd
from functools import reduce

def lcm(a: int, b: int) -> int:
    return abs(a * b) // gcd(a, b)

def LCM(A: list[int]) -> int:
    if any(x == 0 for x in A):
        return 0
    return reduce(lcm, A)`
    },
    java: {
      filename: 'LcmEngine.java',
      notes: [
        'BigInteger handles arbitrarily large integer multiples safely.',
        'abs() and divide() avoid overflow and sign errors.',
        'Streams provide a declarative fold with reduce().'
      ],
      source: `import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;

public class LcmEngine {
  public static BigInteger gcd(BigInteger a, BigInteger b) {
    return b.equals(BigInteger.ZERO) ? a : gcd(b, a.mod(b));
  }

  public static BigInteger lcm(BigInteger a, BigInteger b) {
    return a.multiply(b).abs().divide(gcd(a, b));
  }

  public static BigInteger LCM(List<Integer> numbers) {
    if (numbers.stream().anyMatch(n -> n == 0)) {
      return BigInteger.ZERO;
    }
    return numbers.stream()
      .map(BigInteger::valueOf)
      .reduce(BigInteger.ONE, LcmEngine::lcm);
  }
}`
    }
  };

  function syntaxHighlight(code, runtime) {
    const rules = [
      { regex: /\/\/.*/g, className: 'comment' },
      { regex: /\b(function|return|if|const|let|var|import|from|public|static|def|class|for|in|any|number|ReadonlyArray|number\[\]|list\[int\]|void|int|throws)\b/g, className: 'keyword' },
      { regex: /\b(gcd|lcm|LCM|reduce|map|anyMatch|abs|multiply|divide|mod|valueOf|some|Math|BigInteger|ZERO|ONE)\b/g, className: 'function' },
      { regex: /\b\d+\b/g, className: 'number' },
      { regex: /[-+*/=%]|=>|\?\?|:/g, className: 'operator' }
    ];

    let html = escapeHtml(code);
    if (runtime === 'py') {
      html = html.replace(/#.*/g, m => `<span class="comment">${m}</span>`);
    }

    rules.forEach(rule => {
      html = html.replace(rule.regex, match => `<span class="${rule.className}">${match}</span>`);
    });

    return html;
  }

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function parseInput(raw) {
    const tokens = raw.split(',').map(t => t.trim()).filter(Boolean);
    if (tokens.length === 0) return [];
    return tokens.map(t => {
      const n = Number(t);
      if (!Number.isFinite(n) || !Number.isInteger(n)) {
        throw new Error(`"${t}" is not a valid integer.`);
      }
      return n;
    });
  }

  function computeLCM(values) {
    if (values.some(x => x === 0)) return 0;

    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);

    return values.reduce((acc, val) => lcm(acc, val), 1);
  }

  function formatNumber(n) {
    return n.toLocaleString('en-US');
  }

  function renderCode(runtime) {
    const sample = codeSamples[runtime];
    document.getElementById('code-filename').textContent = sample.filename;
    document.getElementById('code-body').innerHTML = syntaxHighlight(sample.source, runtime);

    const notesList = document.getElementById('impl-notes');
    notesList.innerHTML = sample.notes
      .map(note => `<li>${escapeHtml(note)}</li>`)
      .join('');

    document.getElementById('runtime-badge').textContent = runtime.toUpperCase();
  }

  function setStatus(text, isError = false) {
    const el = document.getElementById('input-status');
    el.textContent = text;
    el.style.color = isError ? 'var(--accent-rose)' : 'var(--text-secondary)';
  }

  function animateResult(value) {
    const el = document.getElementById('result-value');
    const duration = 600;
    const start = performance.now();
    const from = 0;

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(from + (value - from) * eased);
      el.textContent = formatNumber(current);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function handleCompute() {
    const raw = document.getElementById('lcm-input').value;
    const stepsEl = document.getElementById('result-steps');

    try {
      const values = parseInput(raw);
      if (values.length === 0) {
        setStatus('Enter at least one integer', true);
        stepsEl.textContent = '';
        return;
      }
      const result = computeLCM(values);
      setStatus(`${values.length} integer${values.length > 1 ? 's' : ''} parsed`);
      animateResult(result);
      stepsEl.textContent = `lcm(${values.join(', ')}) = ${formatNumber(result)}`;
    } catch (err) {
      setStatus(err.message, true);
      stepsEl.textContent = '';
    }
  }

  function handleRandom() {
    const pool = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 25, 30, 40, 45, 50, 90];
    const count = Math.floor(Math.random() * 4) + 3;
    const values = [];
    for (let i = 0; i < count; i++) {
      const v = pool[Math.floor(Math.random() * pool.length)];
      values.push(Math.random() > 0.8 ? -v : v);
    }
    document.getElementById('lcm-input').value = values.join(', ');
    handleCompute();
  }

  function handleClear() {
    document.getElementById('lcm-input').value = '';
    document.getElementById('result-value').textContent = '0';
    document.getElementById('result-steps').textContent = '';
    setStatus('Awaiting input');
  }

  function initConstellation() {
    const canvas = document.getElementById('constellation');
    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];
    const count = 90;
    const maxDistance = 130;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.6 + 0.6;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
        ctx.fill();
      }
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const alpha = 1 - dist / maxDistance;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha * 0.18})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(loop);
    }

    resize();
    initParticles();
    window.addEventListener('resize', () => { resize(); initParticles(); });
    loop();
  }

  function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderCode(tab.dataset.runtime);
      });
    });
  }

  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.theory-card, .price-card, .calculator-card, .code-showcase')
      .forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
      });

    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initConstellation();
    initTabs();
    initScrollReveal();
    renderCode('js');

    document.getElementById('btn-compute').addEventListener('click', handleCompute);
    document.getElementById('btn-random').addEventListener('click', handleRandom);
    document.getElementById('btn-clear').addEventListener('click', handleClear);

    document.getElementById('lcm-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCompute();
    });
  });
})();

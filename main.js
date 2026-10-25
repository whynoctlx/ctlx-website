const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Compound curve: five weekly doses, 1 d absorption and 4.5 d elimination half-lives
const level = (t) => {
  let c = 0;
  for (let dose = 0; dose <= 28 && dose < t; dose += 7) {
    c += Math.exp((-Math.LN2 / 4.5) * (t - dose)) - Math.exp(-Math.LN2 * (t - dose));
  }
  return c;
};
const samples = Array.from({ length: 169 }, (_, i) => level(i / 4));
const peak = Math.max(...samples);
const curve = document.getElementById('curve');
const plot = curve.ownerSVGElement;

// drawn in the svg's own pixels so the stroke keeps its weight at any tile size
function drawCurve() {
  const { clientWidth: width, clientHeight: height } = plot;
  plot.setAttribute('viewBox', `0 0 ${width} ${height}`);
  const points = samples.map((c, i) => `${((i * width) / 168).toFixed(1)} ${(height - 2 - (c / peak) * (height - 6)).toFixed(1)}`);
  curve.setAttribute('d', 'M' + points.join('L'));
}
new ResizeObserver(drawCurve).observe(plot);

// in-page links glide to their section instead of jumping
let glide = 0;
for (const link of document.querySelectorAll('a[href^="#"]')) {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.hash);
    if (!target) return;
    e.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    const from = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const to = link.hash === '#top' ? 0 : Math.min(max, Math.max(0, from + target.getBoundingClientRect().top - offset));
    if (reduceMotion) return scrollTo(0, to);
    const duration = Math.min(1400, 500 + Math.abs(to - from) * 0.4);
    const start = performance.now();
    const run = ++glide;
    const step = (now) => {
      if (run !== glide) return;
      const t = Math.min(1, (now - start) / duration);
      // ease-in-out quint: slow off the mark, fast through the middle, soft landing
      const eased = t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;
      scrollTo(0, from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}
// any user input during the glide hands control back
for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) addEventListener(type, () => glide++, { passive: true });

// Zarobenqo mark: draw-in, sheen, tilt toward the cursor
const mark = document.getElementById('mark');
const area = mark.closest('.card');
const MOTION = ['--g-x', '--g-y', '--h-x', '--h-y', '--tilt-x', '--tilt-y', '--mx', '--my'];

function sweep() {
  mark.classList.remove('sweep');
  void mark.offsetWidth;
  mark.classList.add('sweep');
}

if (!reduceMotion) {
  mark.classList.add('intro');
  setTimeout(sweep, 2100);

  area.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') sweep();
  });

  // one write per frame; the box comes from offset geometry so the tilt can't skew it
  let pointer = null;
  const track = () => {
    const { clientX, clientY } = pointer;
    pointer = null;
    const parent = mark.offsetParent.getBoundingClientRect();
    const left = parent.left + mark.offsetParent.clientLeft + mark.offsetLeft;
    const top = parent.top + mark.offsetParent.clientTop + mark.offsetTop;
    const x = Math.max(-1, Math.min(1, ((clientX - left) / mark.offsetWidth - 0.5) * 1.4));
    const y = Math.max(-1, Math.min(1, ((clientY - top) / mark.offsetHeight - 0.5) * 1.4));
    mark.classList.add('is-tracking');
    mark.style.setProperty('--g-x', `${(x * 1.6).toFixed(2)}px`);
    mark.style.setProperty('--g-y', `${(y * 1.6).toFixed(2)}px`);
    mark.style.setProperty('--h-x', `${(-x * 0.8).toFixed(2)}px`);
    mark.style.setProperty('--h-y', `${(-y * 0.8).toFixed(2)}px`);
    mark.style.setProperty('--tilt-x', `${(-y * 9).toFixed(2)}deg`);
    mark.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`);
    mark.style.setProperty('--mx', `${(50 + x * 40).toFixed(1)}%`);
    mark.style.setProperty('--my', `${(50 + y * 40).toFixed(1)}%`);
  };

  area.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (!pointer) requestAnimationFrame(() => pointer && track());
    pointer = e;
  });

  area.addEventListener('pointerleave', () => {
    pointer = null;
    mark.classList.remove('is-tracking');
    for (const name of MOTION) mark.style.removeProperty(name);
  });
}

// Discord and Yapin.gg have no public profile URL, so the pill copies the handle
for (const button of document.querySelectorAll('[data-copy]')) {
  const label = button.querySelector('span');
  const handle = label.textContent;
  button.addEventListener('click', async () => {
    // hold the handle's width so the shorter feedback text doesn't resize the pill
    label.style.minWidth = `${label.offsetWidth}px`;
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      label.textContent = 'copied';
    } catch {
      label.textContent = 'failed';
    }
    clearTimeout(button.reset);
    button.reset = setTimeout(() => {
      label.textContent = handle;
      label.style.minWidth = '';
    }, 1600);
  });
}

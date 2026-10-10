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
drawCurve();
new ResizeObserver(drawCurve).observe(plot);

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

  area.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const box = mark.getBoundingClientRect();
    const k = box.width / 44;
    const x = Math.max(-1, Math.min(1, ((e.clientX - box.left) / box.width - 0.5) * 1.4));
    const y = Math.max(-1, Math.min(1, ((e.clientY - box.top) / box.height - 0.5) * 1.4));
    mark.classList.add('is-tracking');
    mark.style.setProperty('--g-x', `${(x * 1.6 * k).toFixed(2)}px`);
    mark.style.setProperty('--g-y', `${(y * 1.6 * k).toFixed(2)}px`);
    mark.style.setProperty('--h-x', `${(-x * 0.8 * k).toFixed(2)}px`);
    mark.style.setProperty('--h-y', `${(-y * 0.8 * k).toFixed(2)}px`);
    mark.style.setProperty('--tilt-x', `${(-y * 9).toFixed(2)}deg`);
    mark.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`);
    mark.style.setProperty('--mx', `${(50 + x * 40).toFixed(1)}%`);
    mark.style.setProperty('--my', `${(50 + y * 40).toFixed(1)}%`);
  });

  area.addEventListener('pointerleave', () => {
    mark.classList.remove('is-tracking');
    for (const name of MOTION) mark.style.removeProperty(name);
  });
}

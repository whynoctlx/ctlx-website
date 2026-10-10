const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// pointer light on the card
const card = document.querySelector('.card');
card.addEventListener('pointermove', (e) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', e.clientX - rect.left + 'px');
  card.style.setProperty('--my', e.clientY - rect.top + 'px');
});

// local time in Bratislava
const clock = document.getElementById('clock');
const format = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Bratislava',
  hour: '2-digit',
  minute: '2-digit',
});
const tick = () => (clock.textContent = format.format(new Date()));
tick();
setInterval(tick, 10000);

// Zarobenqo mark: draw-in, sheen, tilt toward the cursor
const mark = document.getElementById('mark');
const area = mark.closest('.feature');
const MOTION = ['--g-x', '--g-y', '--h-x', '--h-y', '--tilt-x', '--tilt-y', '--mx', '--my'];

function sweep() {
  mark.classList.remove('sweep');
  void mark.offsetWidth;
  mark.classList.add('sweep');
}

if (!reduceMotion) {
  mark.classList.add('intro');
  setTimeout(sweep, 2300);

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
